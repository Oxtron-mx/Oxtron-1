'use client'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import Modal from '@/components/shared/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import {Communicate, CommunicateSchema} from '@/lib/validation'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import { SendHorizonal } from 'lucide-react'
import {getCboTypes} from '@/actions/communicate'
import { VLabel } from '@/constants/types'
import {getFacilitiesByUserId} from "@/actions/measure/facilities";
import {toast} from "@/components/ui/use-toast";
import {useCommunicateStore} from "@/store/communicate";

type Props = { communicateReport?: Communicate }

export default function CreateReport ({ communicateReport }: Props) {
  const {createReport, showCreateReportModal, handleHideCreateReportModal} = useCommunicateStore()
  const [types, setTypes] = useState<VLabel[]>([])
  const [_error, setError] = useState<AxiosError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [facilityOptions, setFacilityOptions] = useState<VLabel[]>([])
  const [idFacility, setIdFacility] = useState<string>('')
  const [type, setType] = useState<string>('')
  const form = useForm<Communicate>({
    resolver: zodResolver(CommunicateSchema),
    defaultValues: {
      idUserControl: communicateReport?.idUserControl,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      idFacility: idFacility,
      type: type,
    }
  })
  const facilityWatched = form.watch('idControlFacility');
  const typeWatched = form.watch('type')

  useEffect(() => {
    const value: string = facilityOptions.find((item) => item.value === facilityWatched?.toString() || '')?.label || '';
    setIdFacility(value)
  }, [facilityWatched]);

  useEffect(() => {
    const value = types.find((item) => item.value === typeWatched?.toString())?.label || '';
    setType(value);
  }, [typeWatched]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await getCboTypes()
        const facilities = await getFacilitiesByUserId();
        setTypes(response)
        setFacilityOptions(facilities.data?.map((facility) => ({
          value: facility?.idControlFacility?.toString() || '',
          label: facility.idFacility,
        })) || [])
      } catch (error) {
        console.error({ error })
        setError(error as AxiosError)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpdateReport = async () => {};

  /* const handleUpdateReport = async (report: ReportHeader) => {
    const response = await updateReport(report)
    console.log({ response })
    toast({
      title: 'Success',
      description: 'This report has been updated successfully',
      className: 'bg-black',
    })
  } */

  async function onSubmit(report: Communicate) {
    try {
      setIsLoading(true)
      if (!communicateReport) {
        await createReport({...report, type, idFacility});
        toast({
          title: 'Success',
          description: 'Item successfully created',
          className: 'bg-black',
        })
        setType('')
        setIdFacility('')
        form.resetField('idControlFacility')
        form.reset()
        form.setValue('type', '')
      } else {
        await handleUpdateReport()
      }
    } catch (error) {
      console.error('CreateReport->onSubmit', { error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="New Report"
      Icon={ SendHorizonal }
      open={ showCreateReportModal }
      onClose={ handleHideCreateReportModal }
      className="w-10/12 xl:w-1/4 lg:w-1/3 md:w-1/2 md:h-[65vh]"
    >
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-">
            <div className="flex flex-row lg:flex-row col-span-2 space-x-8">
              <CustomFormField
                fieldType={ FormFieldType.DATE_PICKER }
                name="startDate"
                label="START DATE"
                placeholder="dd/mm/yyyy"
                control={ form.control }/>
              <CustomFormField
                fieldType={ FormFieldType.DATE_PICKER }
                name="endDate"
                label="END DATE"
                placeholder="dd/mm/yyyy"
                control={ form.control }/>
            </div>
            <div className="col-span-2">
              <CustomFormField
                fieldType={ FormFieldType.SELECT }
                name="type"
                label="TYPE"
                placeholder="Select Activity Type"
                options={ types }
                control={ form.control }/>
            </div>
            <div className="col-span-2">
              <CustomFormField
                fieldType={ FormFieldType.SELECT }
                name="idControlFacility"
                label="FACILITY"
                placeholder="Select Activity Type"
                options={ facilityOptions }
                control={ form.control }/>
            </div>
          </div>
          <div className="flex items-center justify-end w-32 float-end">
            <SubmitButton isLoading={ isLoading }>
              { !communicateReport ? 'Add' : 'Update' }
            </SubmitButton>
          </div>
        </form>
      </Form>
    </Modal>
  )
}
