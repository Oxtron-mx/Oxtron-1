"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ForgotPasswordValidation } from "@/lib/validation"
import Link from "next/link"
import { forgotPassword } from "@/actions/auth"
import Lottie from "lottie-react";
import animationData from "@/public/assets/lotties/success.json"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}

interface ForgotPasswordProps {
    dictionary: {
        title: string;
        subtitle: string;
        label: string;
        placeholder: string;
        button: string;
        label2: string;
        button2: string;
        label3: string;
        label4: string;
        button3: string;
        error1: string;
        error2: string;
        error3: string;
    };
}

const ForgotPassword = ({ dictionary }: ForgotPasswordProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
        resolver: zodResolver(ForgotPasswordValidation),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit({ email }: z.infer<typeof ForgotPasswordValidation>) {
        setIsLoading(true);
        try {
            const response = await forgotPassword({ email });
            setSuccess(true)
            if (!response) {
                console.log(response)
            }
        } catch (e) {
            setError(true)
            console.error(e);
        }
        setIsLoading(false)
    }

    return (
        <div>
            {success ? (
                <div className="h-fit my-20 flex flex-col gap-4">
                    <Lottie
                        animationData={animationData}
                        className="flex justify-center items-center h-32"
                        loop={true}
                    />
                    <p className="text-dark-600 text-center">
                        {dictionary.label3} <br /> {dictionary.label4}
                    </p>
                    <SubmitButton isLoading={isLoading} onClick={() => router.push('/')}>
                        {dictionary.button3}
                    </SubmitButton>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                        <section className="mb-7 space-y-4 text-center">
                            <h1 className="font-bold text-[24px] text-black title-century-gothic-bold">
                                {dictionary.title}
                            </h1>
                            <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px]">
                                {dictionary.subtitle}
                            </p>
                        </section>
                        {error ? (
                            <div className="space-y-6 flex-1">
                                <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px] text-center">
                                    {dictionary.error1} <br /> {dictionary.error2}
                                </p>
                                <Button
                                    type='button'
                                    className={"shad-primary-btn w-full py-6 hover:scale-95 transition duration-300"}
                                    onClick={() => setError(false)}
                                >
                                    {dictionary.error3}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6 flex-1">
                                <CustomFormField 
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control} 
                                    name="email"
                                    label={dictionary.label}
                                    placeholder={dictionary.placeholder}
                                />
                                <SubmitButton isLoading={isLoading}>
                                    {dictionary.button}
                                </SubmitButton>
                            </div>
                        )}
                        <Link href="/" className="text-black text-sm w-full font-extralight">
                            <p className="mt-4">{dictionary.label2} <b>{dictionary.button2}</b></p>
                        </Link>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ForgotPassword;
