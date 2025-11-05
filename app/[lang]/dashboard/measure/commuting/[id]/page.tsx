'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useEffect, useState} from "react";
import {CommutingDetails, Facility} from "@/lib/validation";
import {deleteCommutingDetails, getCommutingDetails} from "@/actions/measure/details";
import {CommutingInvoiceForm} from "@/components/forms/measure/Details/CommutingInvoiceForm";
import Modal from "@/components/measure/Modal";
import {useModal} from "@/hooks/shared/useModal";
import {toast} from "@/components/ui/use-toast";
import {getCommutingByUserId} from "@/actions/measure/commuting";
import {getFacilitiesByUserId} from "@/actions/measure/facilities";

type Props = { params: { id: number } };

export default function CommutingDetailPage({params: {id}}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [facility, setFacility] = useState<Facility>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();
  const columns = [
    {header: dictionary?.measure.table.commuting.trans, accessor: 'cboModeTransportDescription'},
    {header: dictionary?.measure.table.commuting.acti, accessor: 'activity'},
    {header: dictionary?.measure.table.commuting.dis, accessor: 'distance'},
    {header: dictionary?.measure.table.commuting.unit, accessor: 'active'},
    {header: dictionary?.measure.table.commuting.ori, accessor: 'origin'},
    {header: dictionary?.measure.table.commuting.dest, accessor: 'destination'},
    {header: dictionary?.measure.table.commuting.user, accessor: 'idUserControl'},
    {header: dictionary?.measure.table.commuting.status, accessor: 'status'},
  ]

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const commuting = await getCommutingDetails(id)
      return commuting.data
    }

    const newData = await getData(id)

    const commuting = await getCommutingByUserId();
    const comm = commuting.data?.find(value => value.idControlCommuting?.toString() === id.toString())

    const facilities = await getFacilitiesByUserId();
    const facility = facilities.data?.find(value => value.idControlFacility?.toString() === comm?.idControlFacility.toString())

    setFacility(facility)
    setData(newData || [])
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
      const {idControlCommutingDetails} = rowData as CommutingDetails
      const commuting = await deleteCommutingDetails(idControlCommutingDetails || 0)
      return commuting.success
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
            <Link href={path.split('/').slice(0, -1).join('/').replace('commuting', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.commuting}
            </Link>
            {' '} / {facility?.idFacility}
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
          <CommutingInvoiceForm
            idControlCommuting={id}
            commuting={selectedRow as CommutingDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
