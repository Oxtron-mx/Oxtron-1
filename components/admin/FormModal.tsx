import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { register } from '@/actions/auth'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import Modal from '@/components/shared/Modal'
import SubmitButton from '@/components/SubmitButton'
import { roles } from '@/constants/auth'
import { UserRegisterValidation } from '@/lib/validation'

declare global {
  type UserRegister = z.infer<typeof UserRegisterValidation>
}

const FormModal: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<UserRegister>({
    resolver: zodResolver(UserRegisterValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      password: '',
      confirmPassword: '',
      organisationName: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      telephoneUser: '',
      timeZone: '',
      language: '',
    }
  })

  async function onSubmit(user: z.infer<typeof UserRegisterValidation>) {
    setIsLoading(true)

    try {
      await register(user)
      toast({
        title: 'Success',
        description: 'This user has been inserted successfully',
      className: 'bg-black',
      })
      form.reset()
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
    <Modal open={ open } onClose={ onClose } title="Add New User">
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
              name="role"
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
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="Organisation Name"
              label="Organisation Name"
              name="organisationName"
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="City"
              label="City"
              name="city"
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="State"
              label="State"
              name="state"
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="Country"
              label="Country"
              name="country"
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="Postal Code"
              label="Postal Code"
              name="postalCode"
            />
            <CustomFormField 
              fieldType={FormFieldType.SELECT} 
              control={form.control} 
              name="typeOfLicense"
              label="Type of License"
              placeholder="Select your type of license"
              options={[
                { value: "Inventario de Emisiones Basic", label: "Inventario de Emisiones Basic" },
                { value: "Inventario de Emisiones Professional", label: "Inventario de Emisiones Professional" },
                { value: "Inventario de Emisiones Advanced", label: "Inventario de Emisiones Advanced" },
                { value: "Huella de Carbono Basic", label: "Huella de Carbono Basic" },
                { value: "Huella de Carbono Professional", label: "Huella de Carbono Professional" },
                { value: "Huella de Carbono Advanced", label: "Huella de Carbono Advanced" }
                ]}
              />
            <CustomFormField
              fieldType={ FormFieldType.PHONE_INPUT }
              control={ form.control }
              placeholder="Telephone"
              label="Telephone"
              name="telephoneUser"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT} 
              control={form.control} 
              placeholder="Time Zone"
              label="Time Zone"
              name="timeZone"
              options={[
                { value: "UTC", label: "Coordinated Universal Time (UTC)" },
                { value: "America/Mexico_City", label: "Mexico City (GMT-6)" },
                { value: "America/New_York", label: "New York (GMT-5)" },
                { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
                { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
                { value: "America/Bogota", label: "Bogotá (GMT-5) - Sudamérica" },
                { value: "Africa/Cairo", label: "Cairo (GMT+2) - África" },
                { value: "Pacific/Auckland", label: "Auckland (GMT+12) - Oceanía" },
                ]}
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              placeholder="Language"
              label="Language"
              name="language"
            />
          </div>
          <SubmitButton isLoading={ isLoading }>Add</SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default FormModal
