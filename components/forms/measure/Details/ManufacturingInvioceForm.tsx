import {CustomRadioButton} from "@/components/controls/radio-button/RadioButton";
import CustomFormField, {FormFieldType} from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {Form} from "@/components/ui/form";
import {ManufacturingDetails, ManufacturingDetailsValidation} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {getDictionary} from "@/lib/dictionary";
import {usePathname} from "next/navigation";
import {Locale} from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';
import {
  createManufacturingDetails,
  updateManufacturingDetails
} from "@/actions/measure/details";
import {toast} from "@/components/ui/use-toast";

type Props = { idControlManufacturing: number; manufacturing?: ManufacturingDetails; reloadData: () => void };

export const ManufacturingInvoiceForm = ({idControlManufacturing, manufacturing, reloadData}: Props) => {
  const [emissionsFactor, setEmissionsFactor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.measure.createm.man);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang])

  const form = useForm<ManufacturingDetails>({
    resolver: zodResolver(ManufacturingDetailsValidation),
    defaultValues: {
      active: manufacturing?.active ?? 1,
      endDate: manufacturing?.endDate ?? new Date().toISOString(),
      idControlManufacturing,
      idEmissionFactor: manufacturing?.idEmissionFactor ?? Number(emissionsFactor),
      startDate: manufacturing?.startDate ?? new Date().toISOString(),
      invoiceId: manufacturing?.invoiceId,
      unit: manufacturing?.unit,
      amount: manufacturing?.amount,
      idControlManufacturingDetails: manufacturing?.idControlManufacturingDetails,
    },
  })

  async function onSubmit(manufacturingDetails: ManufacturingDetails) {
    setIsLoading(true)
    try {
      const data = !manufacturing
        ? await createManufacturingDetails(manufacturingDetails)
        : await updateManufacturingDetails(manufacturingDetails)

      if (data.success) {
        toast({
          title: 'Success',
          description: `This invoice has been ${!manufacturing ? 'created' : 'updated'} successfully`,
          className: 'bg-black',
        })
        form.reset()
        reloadData()
      }
    } catch (error) {
      console.error({error})
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        className: 'bg-[#7f1d1d]',
      })
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="flex items-center justify-center w-full">
            <CustomRadioButton
              value={emissionsFactor}
              onChange={setEmissionsFactor}
              options={[
                {value: "1", label: dictionary.lab1},
                // {value: "2", label: dictionary.lab2},
              ]}
              cols={2}
              label={dictionary.label}
              defaultSelected={0}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="invoiceId"
              label={dictionary.label1}
              placeholder={dictionary.id}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center w-full">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="startDate"
              label={dictionary.label2}
              placeholder="dd/mm/yyyy"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="endDate"
              label={dictionary.label3}
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="amount"
              label={dictionary.label4}
              placeholder={dictionary.amo}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="unit"
              placeholder={dictionary.unit}
              label={dictionary.label5}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-32 float-end">
          <SubmitButton
            isLoading={isLoading}
            onClick={() => onSubmit(form.getValues())}
          >
            {dictionary.up}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};