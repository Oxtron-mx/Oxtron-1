import {Form} from '@/components/ui/form'
import CustomFormField from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import {FormFieldType} from '@/components/forms/LoginForm'
import {Travel} from '@/lib/validation'
import Loading from "@/components/loading/LoadingBlack";

type Props = {
  travel: Travel | null;
  loading: boolean;
  dictionary: any,
  form: any,
  onSubmit: (travel: Travel) => void,
}

const TravelsForm = ({travel, loading = false, dictionary, form, onSubmit}: Props) => {
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
            name="idTravel"
            label={dictionary?.measure.modalt.id}
            placeholder={dictionary?.measure.modalt.write}
            control={form.control}
          />
          <div className="col-span-2">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label={dictionary?.measure.modalt.descri}
              placeholder={dictionary?.measure.modalt.writed}
              control={form.control}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-32 float-end">
          <SubmitButton isLoading={loading} onClick={() => onSubmit(form.getValues())}>
            {!travel ? dictionary?.measure.modalt.add : dictionary?.measure.modalt.up}
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}

export default TravelsForm
