'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/shared/useModal";
import {deleteVehicleDetails, getVehicleDetails} from "@/actions/measure/details";
import Modal from "@/components/measure/Modal";
import {Vehicle, VehicleDetails} from "@/lib/validation";
import {VehiclesInvoiceForm} from "@/components/forms/measure/Details/VehiclesInvoiceForm";
import {toast} from "@/components/ui/use-toast";
import {getVehiclesByUserId} from "@/actions/measure/vehicles";

type Props = { params: { id: number } };

export default function VehiclesDetailPage({ params: { id } }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [vehicle, setVehicle] = useState<Vehicle>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const vehicles = await getVehicleDetails(id)
      return vehicles.data
    }

    const newData = await getData(id)
    const vehicles = await getVehiclesByUserId()
    const vehicle = vehicles?.data?.find((vehicle) => vehicle.idControlVehicle?.toString() === id.toString())

    setData(newData || [])
    setVehicle(vehicle)
    setIsLoading(false)
    handleHideModal()
  }

  useEffect(() => {
    setIsLoading(true)
    reloadData()
  }, [id])

  const columns = [
    {header: dictionary?.measure.table.vehicles.type, accessor: 'idEmissionFactorDescription'},
    {header: dictionary?.measure.table.vehicles.sou, accessor: 'cboTypeDescription'},
    {header: dictionary?.measure.table.vehicles.amo, accessor: 'amount'},
    {header: dictionary?.measure.table.vehicles.unit, accessor: 'unit'},
    {header: dictionary?.measure.table.vehicles.start, accessor: 'startDate'},
    {header: dictionary?.measure.table.vehicles.end, accessor: 'endDate'},
    {header: dictionary?.measure.table.vehicles.up, accessor: 'firstName'},
    // { header: 'Status', accessor: 'active' },
  ]

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
      const {idControlVehicleDetails} = rowData as VehicleDetails
      const vehicles = await deleteVehicleDetails(idControlVehicleDetails || 0)
      return vehicles.success
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

  return (isLoading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <>
      <div className="flex flex-col  gap-4 p-6 lg:ml-[205px] ml-0">
        <div>
          <h1 className="title-geometos font-[400] text-2xl text-neutral-300">
            <Link href={path.split('/').slice(0, -1).join('/').replace('vehicles', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.vehicles}
            </Link>
            {' '} / <span className="text-neutral-900">{vehicle?.name}</span>
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
          <VehiclesInvoiceForm
            idControlVehicle={id}
            // @ts-ignore
            vehicle={selectedRow as VehicleDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
