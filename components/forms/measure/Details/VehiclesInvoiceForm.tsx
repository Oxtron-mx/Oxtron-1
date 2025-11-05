import { CustomRadioButton } from "@/components/controls/radio-button/RadioButton";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { VehicleDetails, VehicleDetailsValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import SubmitButton from '@/components/SubmitButton'
import { createVehicleDetails, updateVehicleDetails } from '@/actions/measure/details'
import { toast } from '@/components/ui/use-toast'
import { getCboTypes } from '@/actions/shared'
import {ComboType} from "@/constants/types";
import { usePathname } from "next/navigation";
import {Locale} from "@/i18n.config";
import {getDictionary} from "@/lib/dictionary";
import Loading from '@/components/loading/LoadingBlack';


type Props = { idControlVehicle: number; vehicle?: VehicleDetails; reloadData: () => void  };

export const VehiclesInvoiceForm = ({idControlVehicle, vehicle, reloadData}: Props) => {
  const [data, setData] = useState<ComboType[]>([])
  const [vehiclesCboTypes, setVehiclesCboTypes] = useState<Option[]>([])
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
  }, [lang]);

  const form = useForm<VehicleDetails>({
    resolver: zodResolver(VehicleDetailsValidation),
    defaultValues: {
      active: vehicle?.active ?? 1,
      // @ts-ignore
      amount: vehicle?.amount ?? '0',
      endDate: vehicle?.endDate ?? new Date().toISOString(),
      idControlVehicle,
      idEmissionFactor: vehicle?.idEmissionFactor ?? 0,
      // @ts-ignore
      idVehicleCboType: vehicle?.idVehicleCboType ?? '0',
      invoiceId: vehicle?.invoiceId ?? "",
      startDate: vehicle?.startDate ?? new Date().toISOString(),
      unit: vehicle?.unit ?? '',
      idControlVehicleDetails: vehicle?.idControlVehicleDetails,
    },
  });

  const selectedType = form.watch('idVehicleCboType');

  async function onSubmit(vehicleDetails: VehicleDetails) {
    setIsLoading(true);
    try {
      const data = !vehicle
        ? await createVehicleDetails(vehicleDetails)
        : await updateVehicleDetails(vehicleDetails)

      if (data.success) {
        toast({
          title: 'Success',
          description: `This invoice has been ${ !vehicle ? 'created' : 'updated' } successfully`,
          className: 'bg-black',
        })
        form.reset()
        reloadData()
      }
    } catch (error) {
      console.error({ error })
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        className: 'bg-[#7f1d1d]',
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const response = await getCboTypes()
      const data = response.data
      setData(data || [])

      setVehiclesCboTypes(
        data?.map(value => ({
          value: value.idVehicleCboType.toString(),
          label: value.description,
        })) || []
      )
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedType) {
      const unitSelected = data.find((vehicleCboType) => vehicleCboType.idVehicleCboType.toString() === selectedType.toString())
      form.setValue('unit', unitSelected?.units);
    }
  }, [selectedType, form]);

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
          <div>
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
              fieldType={FormFieldType.SELECT}
              name="idVehicleCboType"
              label={dictionary.label7}
              placeholder={dictionary.cal}
              options={vehiclesCboTypes}
            />
          </div>
          <div>
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
                disabled
              />
            </div>
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