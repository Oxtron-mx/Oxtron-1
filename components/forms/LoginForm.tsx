"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserFormValidation } from "@/lib/validation";
import Link from "next/link";
import { login } from "@/actions/auth";
import { toast } from "../ui/use-toast";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface LoginFormProps {
  dictionary: {
    title: string;
    subtitle: string;
    labels: { email: string; password: string; forgot: string; account: string };
    placeholders: { email: string; password: string };
    buttons: { login: string; signup: string };
    toast: { title: string; description: string };
  };
}

const LoginForm = ({ dictionary }: LoginFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const isAuthenticated = await login({ email, password });

      if (!isAuthenticated) {
        toast({
          variant: 'destructive',
          title: (dictionary.toast.title),
          description: (dictionary.toast.description),
          className: 'bg-[#7f1d1d]',
        })
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: (dictionary.toast.title),
        description: (dictionary.toast.description),
        className: 'bg-[#7f1d1d]',
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
        <section className="mb-7 space-y-4 text-center">
          <h1 className="font-bold text-[24px] text-black title-century-gothic-bold">
            {dictionary.title}
          </h1>
          <p className="text-[#9FA2B4] title-century-gothic-regular text-[14px]">
            {dictionary.subtitle}
          </p>
        </section>
        <div className="space-y-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label={dictionary.labels.email}
            placeholder={dictionary.placeholders.email}
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            label={dictionary.labels.password}
            placeholder={dictionary.placeholders.password}
            showPassword={showPassword}
            showPasswordToggle={true}
            onPasswordToggle={() => setShowPassword(!showPassword)}
          />
          <Link href="/forgot-password" className="text-[#9FA2B4] text-[10px] w-full font-extralight">
            <p className="mt-2 title-century-gothic-regular">{dictionary.labels.forgot}</p>
          </Link>
        </div>
        <div className="mt-14">
          <SubmitButton isLoading={isLoading}>
            {dictionary.buttons.login}
          </SubmitButton>
          <Link href="/register" className="text-[#9FA2B4] text-sm w-full font-extralight text-center">
            <p className="mt-4 title-century-gothic-regular">
              {dictionary.labels.account} <b className="text-[#0D2A85] title-century-gothic-bold">{dictionary.buttons.signup}</b>
            </p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
