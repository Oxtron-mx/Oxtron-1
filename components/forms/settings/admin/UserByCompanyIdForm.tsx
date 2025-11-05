"use client"
import React, {useContext, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getUserBySession, registerByCompanyId } from '@/actions/auth'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import { roles } from '@/constants/auth'
import { UserRegisterByCompanyId, UserRegisterByCompanyIdValidation } from '@/lib/validation'
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';
import {AdminAccountContext, IAdminAccountContext} from "@/context/setting/admin-account";

const UserByCompanyIdForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const { toast } = useToast()
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  const form = useForm<UserRegisterByCompanyId>({
    resolver: zodResolver(UserRegisterByCompanyIdValidation),
    defaultValues: {
      idCompany: 0,
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      password: '',
      confirmPassword: '',
      telephoneUser: '',
      timeZone: '',
      language: '',
    }
  })

  const {loadData, handleCloseRegisterUserModal} = useContext(AdminAccountContext) as IAdminAccountContext

  async function onSubmit(user: UserRegisterByCompanyId) {
    setIsLoading(true)

    try {
      const session = await getUserBySession()
      await registerByCompanyId({ ...user, idCompany: session.idCompany })
      toast({
        title: dictionary.modal.success,
        description: dictionary.modal.description,
        className: 'bg-black',
      })
      form.reset()
      await loadData()
      handleCloseRegisterUserModal()
    } catch (error) {
      toast({
        title: dictionary.modal.error,
        description: dictionary.modal.descript,
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
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.admin);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  useEffect(() => {
    console.log(form.watch(['idUSerType']))
  }, [form.watch(['idUSerType'])]);

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
            showPassword={ showPassword }
            onPasswordToggle={ () => setShowPassword(!showPassword) }
            showPasswordToggle
          />
          <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder={dictionary.modal.confirm}
            label={dictionary.modal.confirm}
            name="confirmPassword"
            showPassword={ showConfirmPassword }
            onPasswordToggle={ () => setShowConfirmPassword(!showConfirmPassword) }
            showPasswordToggle
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
        <SubmitButton isLoading={ isLoading }>{dictionary.modal.add}</SubmitButton>
      </form>
    </Form>
  )
}

export default UserByCompanyIdForm
