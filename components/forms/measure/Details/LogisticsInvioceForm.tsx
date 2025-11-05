'use client'
import { CustomRadioButton } from "@/components/controls/radio-button/RadioButton";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { LogisticDetails, LogisticDetailsValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';
import {createLogisticDetails, getDistance, updateLogisticDetails} from '@/actions/measure/details'
import { VLabel } from '@/constants/types'
import { getCboTypes } from '@/actions/communicate'
import { toast } from '@/components/ui/use-toast'

type Props = { idControlLogistics: number; logistic?: LogisticDetails; reloadData: () => void };

export const LogisticsInvoiceForm = ({idControlLogistics, logistic, reloadData}: Props) => {
  const [emissionsFactor, setEmissionsFactor] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [dictionary, setDictionary] = useState<any>(null);
  const [_, setFuelType] = useState<VLabel[]>([])

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.measure.createm.log);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<LogisticDetails>({
    resolver: zodResolver(LogisticDetailsValidation),
    defaultValues: {
      active: logistic?.active ?? 1,
      // @ts-ignore
      amount: logistic?.amount ?? '0',
      destiny: logistic?.destiny ?? '',
      endDate: logistic?.endDate ?? new Date().toISOString(),
      idControlLogistics,
      idControlLogisticsDetails: logistic?.idControlLogisticsDetails ?? 0,
      idEmissionFactor: logistic?.idEmissionFactor ?? Number(emissionsFactor),
      // @ts-ignore
      idFuelType: logistic?.idFuelType ?? '0',
      invoiceId: logistic?.invoiceId ?? '',
      origin: logistic?.origin ?? '',
      startDate: logistic?.startDate ?? new Date().toISOString(),
      unit: logistic?.unit ?? '',
    },
  });

  async function onSubmit(logisticsDetails: LogisticDetails) {
    setIsLoading(true);
    try {
      const data = !logistic
        ? await createLogisticDetails(logisticsDetails)
        : await updateLogisticDetails(logisticsDetails)

      if (data.success) {
        toast({
          title: dictionary.messages.succ,
          description: `${dictionary.messagess?.inv} ${!logistic ? dictionary.messagess?.cre : dictionary.messagess.up} ${dictionary.messagess?.lly}`,
          className: 'bg-black',
        })
        form.reset()
        reloadData()
      }
    } catch (error) {
      console.error({error})
      toast({
        variant: 'destructive',
        title: dictionary.messages.wrong,
        description: dictionary.messages.was,
        className: 'bg-[#7f1d1d]',
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const data = await getCboTypes()
      setFuelType(data)
    }

    loadData()
  }, [])

  useEffect(() => {
    const origin = form.getValues('origin');
    const destiny = form.getValues('destiny');

    if (origin && destiny && origin.length >= 4 && destiny.length >= 4 && !isNaN(Number(origin)) && !isNaN(Number(destiny))) {
      getDistance(Number(origin), Number(destiny)).then((result) => {
        if (result?.success) {
          // @ts-ignore
          const response: string = result?.data?.distance;
          const distance = response.split(' ')[0]
          const unit = response.split(' ')[1]

          form.setValue('amount', Number(distance.split(',').join('')));
          form.setValue('unit', unit)
        } else {
          toast({
            variant: 'destructive',
            title: dictionary.messages.wrong,
            description: dictionary.messages.des,
            className: 'bg-[#7f1d1d]',
          })
        }
      });
    }
  }, [form.getValues('origin'), form.getValues('destiny')]);

  return (isLoading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 text-neutral-500 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center w-full gap-4">
            <CustomRadioButton
              value={emissionsFactor}
              onChange={setEmissionsFactor}
              options={[
                {value: "1", label: dictionary.lab1},
                // { value: "2", label: dictionary.lab2 },
              ]}
              cols={2}
              label={dictionary.label}
              defaultSelected={0}/>
          </div>
          <div className="flex justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="origin"
              label="ORIGIN"
              placeholder="Origin"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="destiny"
              label="DESTINY"
              placeholder="Destiny"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="startDate"
              label={dictionary.label3}
              placeholder="dd/mm/yyyy"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="endDate"
              label={dictionary.label4}
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="invoiceId"
              label={dictionary.label5}
              placeholder={dictionary.id}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <div className="flex justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="idFuelType"
              label="FUEL TYPE"
              placeholder="Fuel Type"
              options={fuelType}
            />
          </div> */ }
          <div>
            <div className="flex justify-center w-full gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="amount"
                label={dictionary.label7}
                placeholder={dictionary.amo}
              />
              {/* <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="unit"
                placeholder="Unit"
                label="UNIT"
              /> */}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end w-32 float-end">
          <SubmitButton isLoading={isLoading}>
            {dictionary.up}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};