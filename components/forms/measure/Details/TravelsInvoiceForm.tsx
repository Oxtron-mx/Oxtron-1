import {CustomRadioButton} from "@/components/controls/radio-button/RadioButton";
import CustomFormField, {FormFieldType} from "@/components/CustomFormField";
import {Form} from "@/components/ui/form";
import {TravelDetails, TravelDetailsValidation} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from 'react'
import {useForm} from "react-hook-form";
import SubmitButton from '@/components/SubmitButton'
import {createTravelDetails, getDistance, updateTravelDetails} from '@/actions/measure/details'
import {toast} from '@/components/ui/use-toast'
import {ICboModeTransport, VLabel} from '@/constants/types'
import {getCboModeTransport} from '@/actions/shared'
import {getDictionary} from "@/lib/dictionary";
import {usePathname} from "next/navigation";
import {Locale} from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';

type Props = { idControlTravel: number; travel?: TravelDetails; reloadData: () => void };

export const TravelsInvoiceForm = ({idControlTravel, travel, reloadData}: Props) => {
  const [cboModeTransport, setCboModeTransport] = useState<VLabel[]>([])
  const [data, setData] = useState<ICboModeTransport[]>([])
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
        setDictionary(dict.pages.measure);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<TravelDetails>({
    resolver: zodResolver(TravelDetailsValidation),
    defaultValues: {
      active: travel?.active ?? 1,
      endDate: travel?.endDate ?? new Date().toISOString(),
      idEmissionFactor: travel?.idEmissionFactor ?? Number(emissionsFactor),
      // @ts-ignore
      idTravelCboType: travel?.idTravelCboType ?? '0',
      invoiceId: travel?.invoiceId ?? "",
      destiny: travel?.destiny ?? '',
      origin: travel?.origin ?? '',
      amount: travel?.amount ?? 0,
      destinyzc: travel?.destinyzc ?? '',
      originzc: travel?.originzc ?? '',
      startDate: travel?.startDate ?? new Date().toISOString(),
      idControlTravelDetails: travel?.idControlTravelDetails,
      unit: travel?.unit ?? '',
      idControlTravel,
    },
  });

  const selectedType = form.watch('idTravelCboType');
  const originAndDestination = form.watch(['originzc', 'destinyzc']);

  async function onSubmit(travelDetails: TravelDetails) {
    setIsLoading(true);
    try {
      const data = !travel
        ? await createTravelDetails(travelDetails)
        : await updateTravelDetails(travelDetails)

      if (data.success) {
        toast({
          title: 'Success',
          description: `This invoice has been ${!travel ? 'created' : 'updated'} successfully`,
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
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const response = await getCboModeTransport()
      const data = response.data;

      setData(data || [])
      setCboModeTransport(
        data?.map(value => ({
          value: value.idCommutingCboModeTransport.toString(),
          label: value.description,
        })) || []
      )
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedType || travel) {
      const unitSelected = data.find((vehicleCboType) => vehicleCboType.idCommutingCboModeTransport.toString() === selectedType.toString())
      form.setValue('unit', travel?.unit || unitSelected?.units || '');
    }
  }, [selectedType, form, travel]);

  useEffect(() => {
    const origin: number = Number(form.getValues('originzc'));
    const destination: number = Number(form.getValues('destinyzc'));

    if (origin && destination && origin.toString().length >= 4 && destination.toString().length >= 4 && !isNaN(Number(origin)) && !isNaN(Number(destination))) {
      getDistance(origin, destination).then((result) => {
        if (result?.success) {
          const data: any = result.data
          form.setValue('amount', parseInt(String(data?.distance / 1000)));
        } else {
          form.setValue('amount', 0);
        }
      }).catch(() => {
        form.setValue('amount', 0);
      });
    }
  }, [originAndDestination]);

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
                {value: "1", label: dictionary.createm.man.lab1},
                // {value: "2", label: dictionary.createm.man.lab2},
              ]}
              cols={2}
              label={dictionary.createm.man.label}
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
              label={dictionary.createm.man.label2}
              placeholder="dd/mm/yyyy"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="endDate"
              label={dictionary.createm.man.label3}
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="invoiceId"
              label={dictionary.createm.man.label1}
              placeholder={dictionary.createm.man.id}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center w-full">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="idTravelCboType"
              label={dictionary.createm.man.label6}
              placeholder={dictionary.createm.man.tran}
              options={cboModeTransport}
            />
          </div>
          <div className="flex justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              name="origin"
              fieldType={FormFieldType.INPUT}
              label={dictionary.createm.comm.label}
              placeholder={dictionary.createm.comm.origin}
            />
            <CustomFormField
              control={form.control}
              name="originzc"
              fieldType={FormFieldType.INPUT}
              label={dictionary.createm.comm.label1}
              placeholder={dictionary.createm.comm.zip}
            />
          </div>
          <div className="flex justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              name="destiny"
              fieldType={FormFieldType.INPUT}
              label={dictionary.createm.comm.label2}
              placeholder={dictionary.createm.comm.desti}
            />
            <CustomFormField
              control={form.control}
              name="destinyzc"
              fieldType={FormFieldType.INPUT}
              label={dictionary.createm.comm.label3}
              placeholder={dictionary.createm.comm.code}
            />
          </div>
          <div className="flex items-end justify-center w-full gap-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="amount"
              label={dictionary.createm.man.label4}
              placeholder={dictionary.createm.man.amo}
              disabled
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="unit"
              placeholder={dictionary.createm.man.unit}
              label={dictionary.createm.man.label5}
              disabled
            />
          </div>
        </div>
        {/* <div className="flex justify-center w-full gap-4">
              <CustomFormField
                control={form.control}
                name="destination"
                fieldType={FormFieldType.INPUT}
                label={dictionary.createm.man.label2}
                placeholder={dictionary.createm.man.desti}
              />
            </div>
            <div className="flex justify-center w-full gap-4">
              <CustomFormField
                control={form.control}
                name="destinyzc"
                fieldType={FormFieldType.INPUT}
                label={dictionary.createm.man.label3}
                placeholder={dictionary.createm.man.code}
              />
              <CustomFormField
                control={form.control}
                name="distance"
                fieldType={FormFieldType.INPUT}
                label={dictionary.createm.man.label4}
                placeholder={dictionary.createm.man.dis}
                disabled
              />
            </div> */}
        {/* <div>
            <div className="flex items-end justify-center w-full gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="amount"
                label={dictionary.createm.man.label4}
                placeholder={dictionary.createm.man.amo}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="unit"
                placeholder={dictionary.createm.man.unit}
                label={dictionary.createm.man.label5}
                disabled
              />
            </div>
          </div>*/}
        <div className="flex items-center justify-end w-32 float-end">
          <SubmitButton
            isLoading={isLoading}
            onClick={() => onSubmit(form.getValues())}
          >
            {dictionary.createm.man.up}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};
