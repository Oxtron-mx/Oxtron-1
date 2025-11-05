import React, { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Company, UpdateUser, UpdateUserValidation } from '@/lib/validation'
import {getCboRoles, updateUser} from '@/actions/auth'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';

type Props = { user?: UpdateUser, company?: Company, loadData: () => Promise<void>, onClose: () => void }

const EditUserForm = ({ user, loadData, onClose }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);
  const [roles, setRoles] = useState<Option[]>([])

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserValidation),
    defaultValues: {
      ...user,
      confirmPassword: user?.password,
    }
  })

  async function onSubmit(user: UpdateUser) {
    setIsLoading(true)

    try {
      const response = await updateUser(user)
      if (response?.success){
        toast({
          title: 'Success',
          description: 'This user has been updated successfully',
          className: 'bg-black',
        })
        form.reset()
        onClose()
        await loadData()
      }
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        className: 'bg-black',
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const roles = await getCboRoles();

        setRoles(roles.map((role) => ({
          value: role.idCatRole.toString(),
          label: role.description,
        })))
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.setup);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 flex-1 text-neutral-500 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.name}
            label={dictionary.modal.name}
            name="firstName"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.last}
            label={dictionary.modal.last}
            name="lastName"
          />
          <CustomFormField
            fieldType={ FormFieldType.SELECT }
            control={ form.control }
            placeholder={dictionary.modal.role}
            label={dictionary.modal.role}
            name="idUSerType"
            options={ roles }
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.typeOfUser}
            label={dictionary.modal.typeOfUser}
            name="role"
            options={ roles }
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.email}
            label={dictionary.modal.email}
            name="email"
          />
          <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder={dictionary.modal.pass}
            label={dictionary.modal.pass}
            name="password"
          />
          <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder={dictionary.modal.confirm}
            label={dictionary.modal.confirm}
            name="confirmPassword"
          />
          <CustomFormField
            fieldType={ FormFieldType.PHONE_INPUT }
            control={ form.control }
            placeholder={dictionary.modal.phone}
            label={dictionary.modal.phone}
            name="telephoneUser"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.zone}
            label={dictionary.modal.zone}
            name="timeZone"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder={dictionary.modal.lang}
            label={dictionary.modal.lang}
            name="language"
          />
        </div>

        <SubmitButton isLoading={ isLoading } onClick={ () => onSubmit(form.getValues()) }>
          {dictionary.content1.up}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default EditUserForm
