"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import SubmitButton from "../SubmitButton"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updatePassword } from '@/actions/auth'
import { UpdatePasswordValidation } from '@/lib/validation'
import CustomFormField from '../CustomFormField'
import Lottie from 'lottie-react'
import animationData from "@/public/assets/lotties/success.json"
import { Button } from '../ui/button'

interface UpdatePasswordProps{
    dictionary: {
        successMessage: string;
        been: string;
        goBackToLogin: string;
        form: {
            title: string;
            instruction: string;
            errorMessage: string;
            was: string;
            tryAgain: string;
            fields: {
                email: {
                    label: string;
                    placeholder: string;
                },
                currentPassword: {
                    label: string;
                    placeholder: string;
                },
                newPassword: {
                    label: string;
                    placeholder: string;
                },
                confirmNewPassword: {
                    label: string;
                    placeholder: string;
                }
            },
            submitButton: string;
            returnToLogin: string;
            log: string;
        }
    }
}

export enum FormFieldType {
    INPUT = 'input',
    PASSWORD = "password",
    TEXTAREA = 'textarea',
    PHONE_INPUT= 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}

type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordValidation>;

const UpdatePassword = ({ dictionary }: UpdatePasswordProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showValidatePassword, setShowValidatePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const form = useForm<UpdatePasswordFormValues>({
        resolver: zodResolver(UpdatePasswordValidation),
        defaultValues: {
            email: "",
            passwordOld: "",
            passwordNew: "",
            confirmPassword: ""
        },
    });

  
    async function onSubmit({ email, passwordOld, passwordNew }: z.infer<typeof UpdatePasswordValidation>) {
        setIsLoading(true);
        try {
            await updatePassword({ email, passwordOld, passwordNew });
            setSuccess(true)
        } catch (e) {
            setError(true)
            console.error(e);
        }
        setIsLoading(false)
    }

    return (
        <div>
            { success ?
                <div className="flex flex-col gap-4 h-screen md:my-20">
                    <Lottie
                        animationData={animationData}
                        className="flex justify-center items-center h-32"
                        loop={true}
                    />
                    <p className="text-dark-600 text-center">{dictionary.successMessage} <br />{dictionary.been}</p>
                    <SubmitButton isLoading={isLoading} onClick={() => router.push('/')}>
                        {dictionary.goBackToLogin}
                    </SubmitButton>
                </div>
                :
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                        <section className="mb-12 space-y-4 text-center">
                            <h1 className="font-bold text-[24px] text-black title-century-gothic-bold">{dictionary.form.title}</h1>
                            <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px]">{dictionary.form.instruction}</p>
                        </section>
                        { error ?
                            <div className="space-y-6 flex-1">
                                <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px] text-center">{dictionary.form.errorMessage}<br />{dictionary.form.was}</p>
                                <Button
                                    type='button'
                                    className={"shad-primary-btn w-full py-6 hover:scale-95 transition duration-300"}
                                    onClick={() => setError(false)}
                                >
                                    {dictionary.form.tryAgain}
                                </Button>
                            </div>
                            :
                            <div className="space-y-6 flex-1">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="email"
                                    label={dictionary.form.fields.email.label}
                                    placeholder={dictionary.form.fields.email.placeholder}
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.PASSWORD}
                                    control={form.control}
                                    name="passwordOld"
                                    label={dictionary.form.fields.currentPassword.label}
                                    placeholder={dictionary.form.fields.currentPassword.placeholder}
                                    showPassword={showPassword}
                                    showPasswordToggle={true}
                                    onPasswordToggle={() => setShowPassword(!showPassword)}
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.PASSWORD}
                                    control={form.control}
                                    name="passwordNew"
                                    label={dictionary.form.fields.newPassword.label}
                                    placeholder={dictionary.form.fields.newPassword.placeholder}
                                    showPassword={showNewPassword}
                                    showPasswordToggle={true}
                                    onPasswordToggle={() => setShowNewPassword(!showPassword)}
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.PASSWORD}
                                    control={form.control}
                                    name="confirmPassword"
                                    label={dictionary.form.fields.confirmNewPassword.label}
                                    placeholder={dictionary.form.fields.confirmNewPassword.placeholder}
                                    showPassword={showValidatePassword}
                                    showPasswordToggle={true}
                                    onPasswordToggle={() => setShowValidatePassword(!showPassword)}
                                />
                                <SubmitButton isLoading={isLoading}>
                                    {dictionary.form.submitButton}
                                </SubmitButton>
                                <Link href="/" className="text-dark-600 text-sm w-full font-extralight mb-20">
                                    <p className="mt-4">{dictionary.form.returnToLogin} <b>{dictionary.form.log}</b></p>
                                </Link>
                            </div>
                        }
                    </form>
                </Form>
            }
        </div>
    )
}

export default UpdatePassword