import {Form} from '@/components/ui/form'
import CustomFormField from '@/components/CustomFormField'
import {FormFieldType} from '@/components/forms/LoginForm'
import SubmitButton from '@/components/SubmitButton'
import {Manufacturing} from '@/lib/validation'
import Loading from '@/components/loading/LoadingBlack';

type Props = {
  manufacturing: Manufacturing | null,
  loading: boolean;
  facilityOptions: Option[],
  fuelOptions: Option[],
  equipmentOptions: Option[],
  dictionary: any,
  form: any,
  onSubmit: (manufacturing: Manufacturing) => void,
}

const TravelsForm = ({
  manufacturing,
  loading = false,
  facilityOptions,
  fuelOptions,
  equipmentOptions,
  dictionary,
  form,
  onSubmit,
}: Props) => {
  return (!dictionary || loading) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 text-neutral-500 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="process"
            label={dictionary?.process}
            placeholder={dictionary?.process}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idFacility"
            label={dictionary?.label1}
            placeholder={dictionary?.faci}
            options={facilityOptions}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idTypeEquipment"
            label={dictionary?.label2}
            placeholder={dictionary?.type}
            options={equipmentOptions}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="idTypeFuelUsed"
            label={dictionary?.label3}
            placeholder={dictionary?.fuel}
            options={fuelOptions}
            control={form.control}
          />
        </div>
        <SubmitButton isLoading={loading} className="flex items-center justify-center w-32 float-end">
          {!manufacturing ? dictionary?.add : dictionary?.up}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default TravelsForm
