'use client'
import React, { useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCompany } from '@/actions/company'
import { useToast } from '@/components/ui/use-toast'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import SubmitButton from '@/components/SubmitButton'
import { Company, CompanyValidation } from '@/lib/validation'

type Props = { company?: Company }

export const CompanyForm = ({ company }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<Company>({
    resolver: zodResolver(CompanyValidation),
    defaultValues: {
      idCompany: company?.idCompany,
      firstName: company?.firstName,
      lastName: company?.lastName,
      role: company?.role,
      email: company?.email,
      password: company?.password,
      organisatioName: company?.organisatioName,
      city: company?.city,
      state: company?.state,
      country: company?.country,
      postalCode: company?.postalCode,
      active: company?.active,
      registrationDate: company?.registrationDate,
      idTypeLicense: company?.idTypeLicense,
      address: company?.address,
      telephoneCompany: company?.telephoneCompany,
      size: company?.size,
      industry: company?.industry,
    }
  })

  async function onSubmit(company: Company) {
    setIsLoading(true)
    try {
      await updateCompany(company)
      toast({
        title: 'Success',
        description: 'This company has been updated successfully',
        className: 'bg-black',
      })
      form.reset()
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        className: 'bg-black',
      })
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
            placeholder="Business Name"
            label="BUSINESS NAME"
            name="organisatioName"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Industry"
            label="INDUSTRY"
            name="industry"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Country"
            label="COUNTRY"
            name="country"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="State"
            label="STATE"
            name="state"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="City"
            label="CITY"
            name="city"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Zip Code"
            label="ZIP CODE"
            name="postalCode"/>
          <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            placeholder="Adress"
            label="ADDRESS"
            name="address"/>
          <CustomFormField
            fieldType={ FormFieldType.PHONE_INPUT }
            control={ form.control }
            placeholder="Telephone"
            label="TELEPHONE"
            name="telephoneCompany"/>
        </div>
        <SubmitButton isLoading={ isLoading }>Update</SubmitButton>
      </form>
    </Form>
  )
}
