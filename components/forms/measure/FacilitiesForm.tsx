import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Facility } from "@/lib/validation";
import Loading from "@/components/loading/LoadingBlack";
import { useEffect, useState } from "react";
import { getCities } from "@/services/CatalogService";

type Props = {
  facility: Facility | null;
  loading: boolean;
  options: Option[];
  countries: Option[];
  dictionary: any;
  form: any;
  onSubmit: (facility: Facility) => Promise<void>;
};

const FacilitiesForm = ({
  facility,
  loading = false,
  options,
  countries,
  onSubmit,
  dictionary,
  form,
}: Props) => {
  const [cities, setCities] = useState<Option[]>([]);

  const utilGetCities = async (countryId: string) => {
    const citiesRes = await getCities(countryId);
    if (citiesRes.success) {
      const options: Option[] =
        citiesRes?.data?.map((city: any) => ({
          value: city.id.toString(),
          label: city.city,
        })) || [];
      setCities(options);
    }
  };

  const country = form.watch("country");

  useEffect(() => {
    // reset city when country changes
    setCities([]);
    form.setValue("city", "");
    if (country) {
      utilGetCities(country);
    }
  }, [country]);

  return !dictionary || loading ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading />
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 text-neutral-500 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="idFacility"
            label={dictionary.measure.modal.title}
            placeholder={dictionary.measure.modal.write}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="propertyStatus"
            label={dictionary.measure.modal.status}
            placeholder={dictionary.measure.modal.status}
            options={options}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="country"
            label={dictionary.measure.modal.country}
            placeholder={dictionary.measure.modal.country}
            options={countries}
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="city"
            placeholder={dictionary.measure.modal.city}
            label={dictionary.measure.modal.city}
            options={cities}
            control={form.control}
          />

          <div className="col-span-2">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label={dictionary.measure.modal.desc}
              placeholder={dictionary.measure.modal.desc}
              control={form.control}
            />
          </div>
        </div>
        <SubmitButton
          isLoading={loading}
          className="flex items-center justify-center w-32 float-end"
        >
          {facility
            ? dictionary.measure.modal.button
            : dictionary.measure.modal.add}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default FacilitiesForm;
