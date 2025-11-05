import {Form} from '@/components/ui/form'
import CustomFormField from '@/components/CustomFormField'
import {FormFieldType} from '@/components/forms/LoginForm'
import SubmitButton from '@/components/SubmitButton'
import {Vehicle} from '@/lib/validation'
import Loading from '@/components/loading/LoadingBlack'

type Props = {
  vehicle: Vehicle | null;
  loading: boolean;
  statuses: Option[]
  brands: Option[]
  models: Option[]
  types: Option[]
  isModelDisabled: boolean
  dictionary: any;
  form: any;
  onSubmit: (vehicle: Vehicle) => Promise<void>;
}

const VehiclesForm = ({vehicle, loading = false, statuses, brands, models, types, isModelDisabled, onSubmit, dictionary, form}: Props) => {
  return (!dictionary || loading) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 text-neutral-500 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-scroll no-scrollbar">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idStatus"
            label={dictionary.measure.modalv.proper}
            placeholder={dictionary.measure.modalv.select}
            options={statuses}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="name"
            label={dictionary.measure.modalv.opt}
            placeholder={dictionary.measure.modalv.name}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idCboBrand"
            label={dictionary.measure.modalv.brand}
            placeholder={dictionary.measure.modalv.selectb}
            options={brands}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idCboModel"
            label={dictionary.measure.modalv.model}
            placeholder={dictionary.measure.modalv.selectm}
            options={models}
            control={form.control}
            disabled={isModelDisabled}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idCboType"
            label={dictionary.measure.modalv.type}
            placeholder={dictionary.measure.modalv.selectt}
            options={types}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="licensePlate"
            label={dictionary.measure.modalv.license}
            placeholder={dictionary.measure.modalv.write}
            control={form.control}
          />
        </div>
        <SubmitButton isLoading={loading} className="flex items-center justify-center w-32 float-end">
          {!vehicle ? dictionary.measure.modalv.add : dictionary.measure.modalv.up}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default VehiclesForm
