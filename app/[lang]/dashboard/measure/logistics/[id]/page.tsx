'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/shared/useModal";
import Modal from "@/components/measure/Modal";
import {Logistic, LogisticDetails} from "@/lib/validation";
import {LogisticsInvoiceForm} from "@/components/forms/measure/Details/LogisticsInvioceForm";
import {deleteLogisticDetails, getLogisticDetails} from "@/actions/measure/details";
import {toast} from "@/components/ui/use-toast";
import {getLogisticsByUserId} from "@/actions/measure/logistics";

type Props = { params: { id: number } };

export default function LogisticsDetailPage({ params: { id } }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [logistic, setLogistic] = useState<Logistic>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();

  const columns = [
    {header: dictionary?.measure.table.logistics.trans, accessor: 'invoiceId'},
    {header: dictionary?.measure.table.logistics.fuel, accessor: 'idEmissionFactorDescription'},
    {header: dictionary?.measure.table.logistics.ori, accessor: 'origin'},
    {header: dictionary?.measure.table.logistics.des, accessor: 'destiny'},
    {header: dictionary?.measure.table.logistics.dis, accessor: 'amount'},
    {header: dictionary?.measure.table.logistics.fue, accessor: 'fuelTypeDescription'},
    {header: dictionary?.measure.table.logistics.up, accessor: 'firstName'},
    // { header: 'Status', accessor: 'amount' },
  ]

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const logistics = await getLogisticDetails(id)
      return logistics.data
    }

    const newData = await getData(id)
    const logistics = await getLogisticsByUserId();
    const logistic = logistics?.data?.find((logistic) => logistic.idControlLogistics?.toString() === id.toString())

    setData(newData || [])
    setLogistic(logistic)
    setIsLoading(false)
    handleHideModal()
  }

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
      const {idControlLogisticsDetails} = rowData as LogisticDetails
      const logistic = await deleteLogisticDetails(idControlLogisticsDetails || 0)
      return logistic.success
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
          <h1 className="title-geometos font-[400] text-2xl text-neutral-300">
            <Link href={path.split('/').slice(0, -1).join('/').replace('logistics', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.logistics}
            </Link>
            {' '} / <span className="text-neutral-900">{`${logistic?.origin} - ${logistic?.destination}`}</span>
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
          <LogisticsInvoiceForm
            idControlLogistics={id}
            // @ts-ignore
            logistic={selectedRow as LogisticDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
