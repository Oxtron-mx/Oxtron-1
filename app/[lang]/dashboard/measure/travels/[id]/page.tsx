'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/shared/useModal";
import {deleteTravelDetails, getTravelDetails} from "@/actions/measure/details";
import Modal from "@/components/measure/Modal";
import {Travel, TravelDetails, VehicleDetails} from "@/lib/validation";
import {TravelsInvoiceForm} from "@/components/forms/measure/Details/TravelsInvoiceForm";
import {toast} from "@/components/ui/use-toast";
import {getTravelsByUserId} from "@/actions/measure/travels";

type Props = { params: { id: number } };

export default function TravelsDetailPage({params: {id}}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [travel, setTravel] = useState<Travel>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();

  const columns = [
    {header: dictionary?.measure.table.travels.vehi, accessor: 'travelCboTypeDescription'},
    {header: dictionary?.measure.table.travels.sou, accessor: 'invoiceId'},
    {header: dictionary?.measure.table.travels.ori, accessor: 'origin'},
    {header: dictionary?.measure.table.travels.desti, accessor: 'destiny'},
    {header: dictionary?.measure.table.travels.km, accessor: 'amount'},
    {header: dictionary?.measure.table.travels.date, accessor: 'startDate'},
    {header: dictionary?.measure.table.travels.up, accessor: 'firstName'},
    // { header: 'Status', accessor: 'idControlTravel' },
  ]

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const vehicles = await getTravelDetails(id)
      return vehicles.data
    }

    const newData = await getData(id)
    const travels = await getTravelsByUserId()
    const travel = travels?.data?.find((travel) => travel.idControlTravel?.toString() === id.toString())

    setData(newData || [])
    setTravel(travel)
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
      const {idControlTravelDetails} = rowData as TravelDetails
      const travels = await deleteTravelDetails(idControlTravelDetails || 0)
      return travels.success
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
            <Link href={path.split('/').slice(0, -1).join('/').replace('travels', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.travels}
            </Link>
            {' '} / <span className="text-neutral-900">{travel?.idTravel}</span>
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
          <TravelsInvoiceForm
            idControlTravel={id}
            // @ts-ignore
            travel={selectedRow as VehicleDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
