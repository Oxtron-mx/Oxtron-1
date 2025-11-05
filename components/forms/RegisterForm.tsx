'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { UserRegisterValidation } from '@/lib/validation'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { register } from '@/actions/auth'
import { Button } from '../ui/button'

interface RegisterFormProps {
  dictionary: {
    title: string;
    subtitle: string;
    labels: {
      firstname: string;
      lastname: string;
      role: string;
      email: string;
      organisation: string;
      city: string;
      state: string;
      country: string;
      postal: string;
      license: string;
      account: string;
      pass: string;
      passc: string;
      not: string;
    };
    placeholders: {
      firstname: string;
      lastname: string;
      role: string;
      email: string;
      organisation: string;
      city: string;
      state: string;
      country: string;
      postal: string;
      license: string;
      pass: string;
      passc: string;
    };
    buttons: {
      next: string;
      login: string;
    };
    options: {
      basic: string;
      professional: string;
      emissions: string;
      footprint: string;
      carbon: string;
      advanced: string;
    };
    toast: {
      succ: string;
      been: string;
      wrong: string;
      was: string;
    }
  };
}

const RegisterForm = ({ dictionary }: RegisterFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [timeZone, setTimeZone] = useState('UTC')

  useEffect(() => {
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimeZone(browserTimeZone || 'UTC')
  }, [])

  const form = useForm<z.infer<typeof UserRegisterValidation>>({
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
      telephoneUser: '0000000000',
      timeZone: timeZone,
      language: 'Por definir',
    },
  })

  const [arePasswordsMatch, setArePasswordMatch] = useState<boolean>(true)

  const nextStep = async () => {
    const isFormValid = await form.trigger(["firstName", "lastName", "password", "confirmPassword"])
    const {password, confirmPassword} = form.getValues()
    setArePasswordMatch(password === confirmPassword)

    if (!isFormValid || password !== confirmPassword) return

    setCurrentStep(2)
  }

  async function onSubmit(data: z.infer<typeof UserRegisterValidation>) {
    setIsLoading(true)
    try {
      const response = await register(data)
      if (response?.success) {
        toast({
          title: dictionary.toast.succ,
          description: dictionary.toast.been,
          className: 'bg-black',
        })
      }
      form.reset()
      router.push(`/register-success`)
    } catch (error) {
      console.error({error})
      toast({
        variant: 'destructive',
        title: dictionary.toast.wrong,
        description: dictionary.toast.was,
        className: 'bg-[#7f1d1d]',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6 flex-1 w-[28rem]">
        <section className="mb-12 space-y-4 text-center">
          <h1 className="font-bold text-[24px] text-black title-century-gothic-bold">
            {dictionary.title}
          </h1>
          <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px]">
            {dictionary.subtitle}
          </p>
        </section>
        { currentStep === 1 && (
          <>
            <div className="flex space-x-4">
              <CustomFormField
                fieldType={ FormFieldType.INPUT }
                control={ form.control }
                name="firstName"
                label={dictionary.labels.firstname}
                placeholder={dictionary.placeholders.firstname}
              />
              <CustomFormField
                fieldType={ FormFieldType.INPUT }
                control={ form.control }
                name="lastName"
                label={dictionary.labels.lastname}
                placeholder={dictionary.placeholders.lastname}
              />
            </div>
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="role"
              label={dictionary.labels.role}
              placeholder={dictionary.placeholders.role}
            />
            <CustomFormField
            fieldType={ FormFieldType.INPUT }
            control={ form.control }
            name="email"
            label={dictionary.labels.email}
            placeholder={dictionary.placeholders.email}
            />
            <CustomFormField
            fieldType={ FormFieldType.PASSWORD }
            control={ form.control }
            placeholder={dictionary.labels.pass}
            label={dictionary.labels.pass}
            name="password"
            showPassword={ showPassword }
            onPasswordToggle={ () => setShowPassword(!showPassword) }
            showPasswordToggle/>
            { !arePasswordsMatch && (
              <p id=":R8l7rmj6:-form-item-message" className="text-sm font-medium text-destructive shad-error">
                {dictionary.labels.not}
              </p>
            ) }
            <CustomFormField
              fieldType={ FormFieldType.PASSWORD }
              control={ form.control }
              placeholder={dictionary.labels.passc}
              label={dictionary.labels.passc}
              name="confirmPassword"
              showPassword={ showConfirmPassword }
              onPasswordToggle={ () => setShowConfirmPassword(!showConfirmPassword) }
              showPasswordToggle/>
            { !arePasswordsMatch && (
              <p id=":R8l7rmj6:-form-item-message" className="text-sm font-medium text-destructive shad-error">
                {dictionary.labels.not}
              </p>
            ) }
          </>
        ) }
        { currentStep > 1 && (
          <>
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="organisationName"
              label={dictionary.labels.organisation}
              placeholder={dictionary.placeholders.organisation}
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="city"
              label={dictionary.labels.city}
              placeholder={dictionary.placeholders.city}
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="state"
              label={dictionary.labels.state}
              placeholder={dictionary.placeholders.state}
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="country"
              label={dictionary.labels.country}
              placeholder={dictionary.placeholders.country}
            />
            <CustomFormField
              fieldType={ FormFieldType.INPUT }
              control={ form.control }
              name="postalCode"
              label={dictionary.labels.postal}
              placeholder={dictionary.placeholders.postal}
            />
          </>
        ) }
        { currentStep > 1 ? (
          <SubmitButton isLoading={ isLoading } onClick={ () => onSubmit(form.getValues()) }>
            {dictionary.buttons.login}
          </SubmitButton>
        ) :
          <Button
            type="button"
            disabled={isLoading}
            className="shad-primary-btn w-full py-6 hover:scale-95 transition duration-300"
            onClick={nextStep}
          >
            {dictionary.buttons.next}
          </Button> }

        <Link href="/" className="text-black text-sm w-full font-extralight">
          <p className="mt-4">{dictionary.labels.account} <b>{dictionary.buttons.login}</b></p>
        </Link>
      </form>
    </Form>
  )
}

export default RegisterForm
