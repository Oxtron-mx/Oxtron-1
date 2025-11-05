import React, {useContext, useEffect, useState} from 'react'
import { AdminAccountContext, IAdminAccountContext } from '@/context/setting/admin-account'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Company, UpdateUser, UpdateUserValidation } from '@/lib/validation'
import {getCboRoles, getUserBySession, updateUser} from '@/actions/auth'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import { getCompanyById } from '@/actions/company'

const EditUserForm = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [_, setCompany] = useState<Company>()
  const { user, handleCloseUpdateUserModal } = React.useContext(AdminAccountContext) as IAdminAccountContext
  const { toast } = useToast()
  const { loadData: reloadData } = useContext(AdminAccountContext) as IAdminAccountContext
  const [roles, setRoles] = useState<Option[]>([])

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserValidation),
    defaultValues: {
      active: user?.active,
      confirmPassword: user?.password,
      email: user?.email,
      firstName: user?.firstName,
      idCompany: user?.idCompany,
      idUSerControl: user?.idUSerControl,
      idUSerType: user?.idUSerType,
      language: user?.language,
      lastName: user?.lastName,
      password: user?.password,
      role: user?.role,
      telephoneUser: user?.telephoneUser,
      timeZone: user?.timeZone,
    }
  })

  const loadData = async () => {
    const user = await getUserBySession()
    const company = await getCompanyById(user.idCompany)
    const roles = await getCboRoles();

    setRoles(roles.map((role) => ({
      value: role.idCatRole.toString(),
      label: role.description,
    })))
    setCompany(company)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onSubmit(user: UpdateUser) {
    setIsLoading(true)

    try {
      const response = await updateUser(user)
      if (response?.success) {
        toast({
          title: 'Success',
          description: 'This user has been updated successfully',
          className: 'bg-black',
        })
        form.reset()
        await reloadData()
        handleCloseUpdateUserModal()
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

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 flex-1 text-neutral-500 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="First Name"
            label="First Name"
            name="firstName"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Last Name"
            label="Last Name"
            name="lastName"
          />
          <CustomFormField
            fieldType={ FormFieldType.SELECT }
            control={ form.control }
            placeholder="Role"
            label="Role"
            name="idUSerType"
            options={ roles }
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Email"
            label="Email"
            name="email"
          />
          <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder="Password"
            label="Password"
            name="password"
          />
          <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder="Confirm Password"
            label="Confirm Password"
            name="confirmPassword"
          />
          <CustomFormField
            fieldType={ FormFieldType.PHONE_INPUT }
            control={ form.control }
            placeholder="Telephone"
            label="Telephone"
            name="telephoneUser"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Time Zone"
            label="Time Zone"
            name="timeZone"
          />
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Language"
            label="Language"
            name="language"
          />
        </div>
        <SubmitButton isLoading={ isLoading } onClick={ () => onSubmit(form.getValues()) }>
          Update
        </SubmitButton>
      </form>
    </Form>
  )
}

export default EditUserForm
