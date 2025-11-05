import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import Modal from '@/components/shared/Modal';
import SubmitButton from '@/components/SubmitButton';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';

const CompanyEditValidation = z.object({
  businessName: z.string().min(1, 'Business Name is required'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().optional(),
});

type CompanyEdit = z.infer<typeof CompanyEditValidation>;

const EditCompanyModal: React.FC<{ isOpen: boolean; onClose: () => void; formData: CompanyEdit; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onSave: () => void; isLoading: boolean; }> = ({ isOpen, onClose, formData, onChange, onSave, isLoading }) => {
  const form = useForm<CompanyEdit>({
    resolver: zodResolver(CompanyEditValidation),
    defaultValues: formData,
  });

  const handleSubmit = (data: CompanyEdit) => {
    console.log('Company Data to Save:', data);
    onSave();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Edit Company">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="Business Name" 
              name="businessName" 
            />
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="Industry" 
              name="industry" 
          />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="Country" 
              name="country" 
            />
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="State" 
              name="state" 
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="City" 
              name="city" 
            />
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="Zip Code" 
              name="zipCode" 
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
              fieldType={FormFieldType.INPUT} 
              control={form.control} 
              label="Address" 
              name="address" 
            />
            <CustomFormField 
              fieldType={FormFieldType.PHONE_INPUT} 
              control={form.control} 
              label="Telephone" 
              name="telephone" 
              className="-mr-4 w-[210px]"
            />
          </div>
          <SubmitButton isLoading={isLoading}>Save</SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default EditCompanyModal;

