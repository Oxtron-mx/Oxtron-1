'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {deleteManufacturingDetails, getManufacturingDetails} from "@/actions/measure/details";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/shared/useModal";
import Modal from "@/components/measure/Modal";
import {LogisticDetails, Manufacturing, ManufacturingDetails} from "@/lib/validation";
import {ManufacturingInvoiceForm} from "@/components/forms/measure/Details/ManufacturingInvioceForm";
import {toast} from "@/components/ui/use-toast";
import {getManufacturingByUserId} from "@/actions/measure/manufacturing";

type Props = { params: { id: number } }

export default function ManufacturingDetailPage({ params: { id } }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [manufacturing, setManufacturing] = useState<Manufacturing>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();

  const handleOnClick = () => {
    setSelectedRow(null)
    handleShowModal()
  }

  const handleEdit = async (rowData: any) => {
    setSelectedRow(rowData)
    handleShowModal()
  }

  const handleDelete = async (rowData: any) => {
    async function deleteData(rowData: any) {
      const {idControlManufacturingDetails} = rowData as ManufacturingDetails
      const manufacturing = await deleteManufacturingDetails(idControlManufacturingDetails || 0)
      return manufacturing.success
    }

    const data = await deleteData(rowData)

    if (!data) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        className: 'bg-[#7f1d1d]',
      })
      return
    }

    toast({
      title: 'Success',
      description: 'This item has been deleted successfully',
      className: 'bg-black',
    })

    await reloadData()
  }

  const columns = [
    {header: dictionary?.measure.table.manufacturing.equi, accessor: 'invoiceId'},
    {header: dictionary?.measure.table.manufacturing.cd, accessor: 'idEmissionFactor'},
    {header: dictionary?.measure.table.manufacturing.amo, accessor: 'amount'},
    {header: dictionary?.measure.table.manufacturing.unit, accessor: 'unit'},
    {header: dictionary?.measure.table.manufacturing.start, accessor: 'startDate'},
    {header: dictionary?.measure.table.manufacturing.end, accessor: 'endDate'},
    {header: dictionary?.measure.table.manufacturing.up, accessor: 'firstName'},
    // { header: 'Status', accessor: 'idControlManufacturing' },
  ]

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const manufacturing = await getManufacturingDetails(id)
      return manufacturing.data
    }

    const newData = await getData(id)
    const manufacturing = await getManufacturingByUserId()
    const manufacture = manufacturing?.data?.find(value => value.idControlManufacturing?.toString() === id.toString())

    setData(newData || [])
    setManufacturing(manufacture)
    setIsLoading(false)
    handleHideModal()
  }

  useEffect(() => {
    setIsLoading(true)
    reloadData()
  }, [id])

  return (isLoading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <>
      <div className="flex flex-col  gap-4 p-6 lg:ml-[205px] ml-0">
        <div>
          <h1 className="title-geometos font-[400] text-2xl text-neutral-900">
            <Link href={path.split('/').slice(0, -1).join('/').replace('manufacturing', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.manufacturing}
            </Link>
            {' '} / <span className="text-neutral-900">{manufacturing?.process}</span>
          </h1>
          <p className="font-light text-neutral-500">
            {dictionary?.measure.subtitle}
          </p>
        </div>
        <HistoricalCard onClick={handleOnClick} registryCount={data.length} title="">
          {isLoading ?
            <Loading/> :
            <SimpleTable
              columns={columns}
              data={data}
              options={ {
                onEdit: handleEdit,
                onDelete: handleDelete
              } }
            />
          }
        </HistoricalCard>
      </div>
      {showModal && (
        <Modal
          handleOnCloseModal={handleHideModal}
          title="Create an invoice manually"
          className="h-auto min-w-full lg:min-w-[70vw] xl:min-w-[700px] 2xl:min-w-[1000px]"
        >
          <ManufacturingInvoiceForm
            idControlManufacturing={id}
            // @ts-ignore
            manufacturing={selectedRow as LogisticDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
