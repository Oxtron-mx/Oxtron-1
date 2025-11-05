import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import Modal from '@/components/shared/Modal';
import SubmitButton from '@/components/SubmitButton';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';

const UserEditValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  userType: z.string().min(1, 'User Type is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
  timeZone: z.string().optional(),
  language: z.string().optional(),
});

type UserEdit = z.infer<typeof UserEditValidation>;

const EditUserModal: React.FC<{ isOpen: boolean; onClose: () => void; formData: UserEdit; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onSave: () => void; isLoading: boolean; }> = ({ isOpen, onClose, formData, onChange, onSave, isLoading }) => {
  const form = useForm<UserEdit>({
    resolver: zodResolver(UserEditValidation),
    defaultValues: formData,
  });

  const handleSubmit = (data: UserEdit) => {
    console.log('User Data to Save:', data);
    onSave();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Edit User">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control} 
            label="Name" 
            name="name" 
          />
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control} 
            label="Surname" 
            name="surname" 
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.SELECT} 
            control={form.control} 
            label="User Type" 
            name="userType" 
            options={[{ value: 'Admin', label: 'Admin' }, { value: 'User', label: 'User' }]} 
          />
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control} 
            label="Email" 
            name="email" 
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.SELECT} 
            control={form.control} 
            label="Role" 
            name="role" 
            options={[{ value: 'Administrator', label: 'Administrator' }, { value: 'Editor', label: 'Editor' }]}   
          />
          <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT} 
            control={form.control} 
            label="Phone" 
            name="phone" 
            className="-mr-4 w-[210px]"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.SELECT} 
            control={form.control} 
            label="Time Zone" 
            name="timeZone" 
            options={[{ value: 'GMT', label: 'GMT' }, { value: 'UTC', label: 'UTC' }]} 
          />
          <CustomFormField 
            fieldType={FormFieldType.INPUT} 
            control={form.control} 
            label="Language" 
            name="language" 
          />
        </div>
          <SubmitButton isLoading={isLoading}>Save</SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default EditUserModal;

