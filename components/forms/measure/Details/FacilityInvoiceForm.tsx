import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form} from '@/components/ui/form'
import {useToast} from '@/components/ui/use-toast'
import {CustomRadioButton} from '@/components/controls/radio-button/RadioButton'
import SubmitButton from '@/components/SubmitButton'
import CustomFormField, {FormFieldType} from '@/components/CustomFormField'
import {Button} from '@/components/ui/button'
import {
  ComboType,
  FacilityDescriptionDetails,
  FacilityDescriptionDetailsValidation,
  FacilityDetails,
} from '@/lib/validation'
import {getCboTypes} from '@/actions/communicate'
import {VLabel} from '@/constants/types'
import {getCboElectricityType, getCboFuelType, getCboGasType, getCboRefrigerantsType} from '@/actions/shared'
import {fetchHeader} from '@/actions/dashboard'
import {createFacilityDetails, updateFacilityDetails} from '@/actions/measure/details'
import {usePathname} from "next/navigation";
import {Locale} from "date-fns";
import {getDictionary} from "@/lib/dictionary";
import Loading from "@/components/loading/LoadingBlack";

type Props = { idControlFacility: number; facility?: FacilityDescriptionDetails; reloadData: () => void };

export const FacilityInvoiceForm = ({idControlFacility, facility, reloadData}: Props) => {
  const [idType, setIdType] = useState<string>(facility?.idType.toString() || '')
  const [emissionsFactor, setEmissionsFactor] = useState<string>('1')
  const [measureFugitiveEmissionsFactor, setMeasureFugitiveEmissionsFactor] = useState<string>('1')
  const [dontKnow, setDontKnow] = useState<string>('0')
  const [_, setLabel] = useState<string>('TYPE')
  const [cboTypes, setCboTypes] = useState<VLabel[]>([])
  const [options, setOptions] = useState<VLabel[]>([])
  const emissionsFactorOptions: VLabel[] = [
    {value: '1', label: 'Default'},
  ]
  const [currentStep, setCurrentStep] = useState(1)
  const [optValue, setOptValue] = useState<number | undefined>(facility?.idTypeDetails)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const {toast} = useToast()
  const pathname = usePathname();
  // @ts-ignore
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        // @ts-ignore
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.measure.createm.fac);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<FacilityDescriptionDetails>({
    resolver: zodResolver(FacilityDescriptionDetailsValidation),
    defaultValues: {
      idControlFacilityDetails: facility?.idControlFacilityDetails,
      idControlFacility: idControlFacility,
      // @ts-ignore
      idType: facility?.idType ?? idType,
      idTypeDescription: facility?.idTypeDescription,
      // @ts-ignore
      idEmissionFactor: facility?.idEmissionFactor ?? emissionsFactor,
      idEmissionFactorDescription: facility?.idEmissionFactorDescription,
      startDate: facility?.startDate || new Date().toISOString(),
      endDate: facility?.endDate || new Date().toISOString(),
      invoiceId: facility?.invoiceId || '',
      idTypeDetails: facility?.idTypeDetails ?? optValue,
      idTypeDetailsDescription: facility?.idTypeDetailsDescription,
      amount: facility?.amount,
      unit: facility?.unit,
      typeEquipment: facility?.typeEquipment,
      measureFugitive: facility?.measureFugitive ?? Number(measureFugitiveEmissionsFactor),
      purchased: facility?.purchased,
      delivered: facility?.delivered,
      returnsProducers: facility?.returnsProducers,
      returnedUsers: facility?.returnedUsers,
      returnedOffsiteRecycling: facility?.returnedOffsiteRecycling,
      partialNAmeplateCharged: facility?.partialNAmeplateCharged,
      amountYearsBeginning: facility?.amountYearsBeginning,
      amountYearsEnd: facility?.amountYearsEnd,
      chargedIntoEquipment: facility?.chargedIntoEquipment,
      // @ts-ignore
      dontKnow: facility?.dontKnow ?? '0',
      offSiteRecycling: facility?.offSiteRecycling,
      offSiteDestruction: facility?.offSiteDestruction,
      densityPressurePartial: facility?.densityPressurePartial,
      densityPressureFull: facility?.densityPressureFull,
      active: facility?.active ?? 1,
      firstName: facility?.firstName,
    },
  })

  useEffect(() => {
    setIdType(facility?.idType?.toString() || '');
    setMeasureFugitiveEmissionsFactor(facility?.measureFugitive.toString() || '0')
  }, [facility]);

  useEffect(() => {
    console.log({measureFugitiveEmissionsFactor, measureFugitive: facility?.measureFugitive.toString()})
  }, [measureFugitiveEmissionsFactor]);

  async function onSubmit(facilityDetails: FacilityDetails) {
    setIsLoading(true)
    try {
      const name = await fetchHeader()
      const data = !facility
        ? await createFacilityDetails({
          ...facilityDetails,
          // @ts-ignore
          idType,
          idTypeDescription: cboTypes.find((cboType) => cboType.value === idType)?.label,
          // @ts-ignore
          dontKnow,
          idTypeDetailsDescription: options.find((option) => option.value.toString() === facilityDetails.idTypeDetails.toString())?.label,
          idEmissionFactorDescription: emissionsFactorOptions.find((emissionFactor) => emissionFactor.value === emissionsFactor)?.label,
          firstName: name,
        })
        : await updateFacilityDetails({
          ...facilityDetails,
          // @ts-ignore
          idType,
          idTypeDescription: cboTypes.find((cboType) => cboType.value === idType)?.label,
          // @ts-ignore
          dontKnow,
          idTypeDetailsDescription: options.find((option) =>
            option.value.toString() === facilityDetails.idTypeDetails.toString()
          )?.label,
          idEmissionFactorDescription: emissionsFactorOptions.find((emissionFactor) => emissionFactor.value === emissionsFactor)?.label,
          firstName: name,
        })

      if (data.success) {
        toast({
          title: dictionary.messages?.succ,
          description: `${dictionary.messagess?.inv} ${!facility ? dictionary.messagess?.cre : dictionary.messagess?.up} ${dictionary.messagess?.lly}`,
          className: 'bg-black',
        })
        form.reset()
        reloadData()
      } else {
        toast({
          variant: 'destructive',
          title: dictionary.messages?.wrong,
          description: dictionary.messages?.was,
          className: 'bg-[#7f1d1d]',
        })
      }
    } catch (error) {
      console.error({error})
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    setCurrentStep(2)
  }

  useEffect(() => {
    const loadData = async () => {
      const data = await getCboTypes()
      setCboTypes(data)
    }

    loadData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      switch (idType) {
        case '1':
          const fuel = await getCboFuelType()
          // @ts-ignore
          setData(fuel.data)
          const fuelData = fuel.data as unknown as ComboType[]

          setLabel('TYPE')
          setOptions(fuelData.map((data) => ({
            value: data.idControl,
            label: data.description,
          })) as unknown as VLabel[])
          // setOptValue(-1)
          form.setValue('unit', '');
          break
        case '2':
          const gas = await getCboGasType()
          // @ts-ignore
          setData(gas.data)
          const gasData = gas.data as unknown as ComboType[]

          setLabel('QUANTITY')
          setOptions(gasData.map((data) => ({
            value: data.idControl,
            label: data.description,
          })) as unknown as VLabel[])
          // setOptValue(-1)
          form.setValue('unit', '');
          break
        case '3':
          const electricity = await getCboElectricityType()
          // @ts-ignore
          setData(electricity.data)
          const electricityData = electricity.data as unknown as ComboType[]

          setLabel('CALCULATION APPROACH')
          setOptions(electricityData.map((data) => ({
            value: data.idControl,
            label: data.description,
          })) as unknown as VLabel[])
          // setOptValue(-1)
          form.setValue('unit', '');
          break
        case '4':
          const refrigerants = await getCboRefrigerantsType()
          // @ts-ignore
          setData(refrigerants.data)
          const refrigerantsData = refrigerants.data as unknown as ComboType[]

          setLabel('REFRIGERANT USED')
          setOptions(refrigerantsData.map((data) => ({
            value: data.idControl,
            label: data.description,
          })) as unknown as VLabel[])
          // setOptValue(-1)
          form.setValue('unit', '');
          break
      }
    }

    loadData()
  }, [idType])

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const unitSelected = data.find((type: any) => type.idControl.toString() === value.toString())

    // @ts-ignore
    form.setValue('unit', unitSelected?.units);
    form.setValue('idTypeDetails', Number(value));
    // @ts-ignore
    form.setValue('idTypeDetailsDescription', unitSelected?.description);

    setOptValue(Number(value))
  }

  return (isLoading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1 text-neutral-500 w-full"
        >
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <CustomRadioButton
                  value={idType}
                  onChange={setIdType}
                  options={cboTypes}
                  cols={4}
                  label={dictionary.type}
                  defaultSelected={Number(idType)}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center w-full">
                  <CustomRadioButton
                    value={emissionsFactor}
                    onChange={setEmissionsFactor}
                    options={emissionsFactorOptions}
                    cols={2}
                    label={dictionary.emi}
                    defaultSelected={0}/>
                </div>
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="typeEquipment"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.equipment.label}
                    placeholder={dictionary.equipment.placeholder}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.DATE_PICKER}
                    name="startDate"
                    label={dictionary.startDate.label}
                    placeholder={dictionary.startDate.placeholder}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.DATE_PICKER}
                    name="endDate"
                    label={dictionary.endDate.label}
                    placeholder={dictionary.endDate.placeholder}
                  />
                </div>
                <div>
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="invoiceId"
                    label={dictionary.invoiceId.label}
                    placeholder={dictionary.invoiceId.placeholder}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col justify-center w-full gap-4 text-black">
                  <label
                    htmlFor="idTypeDetails"
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[12px] uppercase title-century-gothic-bold text-[#9FA2B4]">
                    {dictionary.selectType.label}
                  </label>
                  <select
                    name="idTypeDetails"
                    value={optValue}
                    onChange={handleTypeChange}
                    className="flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 title-century-gothic-regular bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]">
                    <option value="" hidden>
                      {dictionary.selectType.placeholder}
                    </option>
                    {options.map((opt) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-center w-full gap-4">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      name="amount"
                      label={dictionary.amount.label}
                      placeholder={dictionary.amount.placeholder}
                    />
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      name="unit"
                      label={dictionary.unit.label}
                      placeholder={dictionary.unit.placeholder}
                      disabled
                    />
                  </div>
                </div>
                {idType === '4' && (
                  <div className="flex justify-center w-full gap-4">
                    <CustomRadioButton
                      label={dictionary.fugitiveEmissions.label}
                      value={measureFugitiveEmissionsFactor}
                      onChange={setMeasureFugitiveEmissionsFactor}
                      options={[{value: '1', label: dictionary.fugitiveEmissions.options.yes}, {value: '0', label: dictionary.fugitiveEmissions.options.no}]}
                      cols={2}/>
                  </div>
                )}
              </div>
            </>
          )}
          {currentStep > 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {idType !== '4' && (
                  <div className="flex justify-center w-full gap-4">
                    <CustomRadioButton
                      label={dictionary.fugitiveEmissions.label}
                      value={measureFugitiveEmissionsFactor}
                      onChange={setMeasureFugitiveEmissionsFactor}
                      options={[{value: '1', label: dictionary.fugitiveEmissions.options.yes}, {value: '0', label: dictionary.fugitiveEmissions.options.no}]}
                      cols={2}/>
                  </div>
                )}
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="amountYearsBeginning"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.amountYearsBeginning.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="amountYearsEnd"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.amountYearsEnd.label}
                    placeholder="000"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="purchased"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.purchased.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="delivered"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.delivered.label}
                    placeholder="000"/>
                </div>
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="chargedIntoEquipment"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.chargedIntoEquipment.label}
                    placeholder="000"/>
                  <CustomRadioButton
                    value={dontKnow}
                    options={[{value: '1', label: dictionary.chargedIntoEquipment.options.idk}]}
                    onChange={setDontKnow}
                    cols={1}/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="returnsProducers"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.returnsProducers.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="returnedUsers"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.returnedUsers.label}
                    placeholder="000"/>
                </div>
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="offSiteRecycling"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.offSiteRecycling.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="offSiteDestruction"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.offSiteDestruction.label}
                    placeholder="000"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="returnedOffsiteRecycling"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.returnedOffsiteRecycling.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="partialNAmeplateCharged"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.partialNAmeplateCharged.label}
                    placeholder="000"/>
                </div>
                <div className="flex justify-center w-full gap-4">
                  <CustomFormField
                    control={form.control}
                    name="densityPressurePartial"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.densityPressurePartial.label}
                    placeholder="000"/>
                  <CustomFormField
                    control={form.control}
                    name="densityPressureFull"
                    fieldType={FormFieldType.INPUT}
                    label={dictionary.densityPressureFull.label}
                    placeholder="000"/>
                </div>
              </div>
            </>
          )}
          <div className="flex justify-end w-32 float-end">
            {idType !== '4' || (idType === '4' && measureFugitiveEmissionsFactor === '0') || currentStep === 2 ? (
              <SubmitButton isLoading={isLoading} onClick={() => onSubmit(form.getValues())}>
                {!facility ? dictionary.create : dictionary.up}
              </SubmitButton>
            ) : (
              <Button
                type="button"
                className={'bg-[#9FA2B4] w-full py-6 hover:scale-95 transition duration-300 text-white'}
                onClick={nextStep}
              >
                {dictionary.next}
              </Button>
            )}
          </div>
        </form>
      </Form>
      {/* <div className="flex items-center justify-center w-full gap-4 fixed bottom-1">
        <button
          type="button"
          onClick={prevStep}
          className={
            cn(
              currentStep === 1 ? 'bg-[#000A14]' : 'bg-[#DFE0EB]',
              'w-4 h-4 rounded-full'
            )}
        ></button>
        <button
          type="button"
          onClick={nextStep}
          className={
            cn(
              currentStep > 1 ? 'bg-[#000A14]' : 'bg-[#DFE0EB]',
              'w-4 h-4 rounded-full'
            )}
        ></button>
      </div> */}
    </>
  )
}
