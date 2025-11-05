'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import Loading from "@/components/loading/LoadingBlack";
import {HistoricalCard} from "@/components/measure/historical/HistoricalCard";
import {SimpleTable} from "@/components/shared/SimpleTable";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/shared/useModal";
import {deleteFacilityDetails, getFacilityDetails} from "@/actions/measure/details";
import Modal from "@/components/measure/Modal";
import {Facility, FacilityDetails} from "@/lib/validation";
import {FacilityInvoiceForm} from "@/components/forms/measure/Details/FacilityInvoiceForm";
import {toast} from "@/components/ui/use-toast";
import {getFacilitiesByUserId} from "@/actions/measure/facilities";

type Props = { params: { id: number } };

export default function FacilitiesDetailPage({params: {id}}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [facility, setFacility] = useState<Facility>()
  const {showModal, handleHideModal, handleShowModal} = useModal()
  const {dictionary} = useDictionary();
  const [data, setData] = useState<Array<any>>([])
  const path = usePathname();
  const columns = [
    {header: dictionary?.measure.table.facilities.type, accessor: 'idTypeDetailsDescription'},
    {header: dictionary?.measure.table.facilities.sour, accessor: 'idTypeDescription'},
    {header: dictionary?.measure.table.facilities.amo, accessor: 'amount'},
    {header: dictionary?.measure.table.facilities.uni, accessor: 'unit'},
    {header: dictionary?.measure.table.facilities.start, accessor: 'startDate'},
    {header: dictionary?.measure.table.facilities.end, accessor: 'endDate'},
    {header: dictionary?.measure.table.facilities.up, accessor: 'firstName'},
    // { header: 'Status', accessor: 'active' },
  ]

  const reloadData = async () => {
    setIsLoading(true)

    async function getData(id: number) {
      const facilities = await getFacilityDetails(id)
      return facilities.data
    }

    const newData = await getData(id)
    const facilities = await getFacilitiesByUserId()
    const facility = facilities?.data?.find(value => value.idControlFacility?.toString() === id.toString())

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
      const {idControlFacilityDetails} = rowData as FacilityDetails
      const facility = await deleteFacilityDetails(idControlFacilityDetails || 0)
      return facility.success
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
            <Link href={path.split('/').slice(0, -1).join('/').replace('facilities', '')}>
              {dictionary?.measure.title}
            </Link> / {' '}

            <Link href={path.split('/').slice(0, -1).join('/')}>
              {dictionary?.measure.all.facilities}
            </Link>
            {' '} / <span className="text-neutral-900">{facility?.idFacility}</span>
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
          <FacilityInvoiceForm
            idControlFacility={id}
            // @ts-ignore
            facility={selectedRow as FacilityDetails}
            reloadData={reloadData}/>
        </Modal>
      )}
    </>
  )
}
