import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { register } from '@/actions/auth';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { Modal } from '@/components/shared/ModalCom';
import SubmitButton from '@/components/SubmitButton';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateRange } from 'react-day-picker';

const formSchema = z.object({
  type: z.string(),
  dateRange: z.object({
    from: z.date().optional(),  
    to: z.date().optional(),
  }).optional(),
});


const FormModal: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      dateRange: { from: undefined, to: undefined },
    },
  });

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    form.setValue('dateRange', {
      from: range?.from || undefined,  
      to: range?.to || undefined,      
    });
  };
      

  async function onSubmit(user: any) {
    setIsLoading(true);
    try {
      await register(user);
      toast({
        title: 'Success',
        description: 'This user has been inserted successfully',
      className: 'bg-black',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      className: 'bg-black',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Report">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 text-neutral-500 w-full">
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
      <div className="flex space-x-4"> 
      {/* START DATE */}
      <FormItem className="flex flex-col mt-4">
        <FormLabel className="text-[12px] uppercase title-century-gothic-bold text-[#9FA2B4]">
          START DATE
        </FormLabel>
        <Popover open={openStartCalendar} onOpenChange={setOpenStartCalendar}>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-[150px] justify-start text-left font-normal", 
                !field.value?.from && "text-muted-foreground"
              )}
            >
              {field.value?.from ? (
                format(field.value.from, "LLL dd, y")
              ) : (
                <span>Pick a start date</span>
              )}
            </Button>
          </FormControl>
          <PopoverContent className="w-auto p-0 mt-2 z-50">
            <div className="scale-90">  
              <Calendar
                mode="range"
                selected={field.value?.from ? { from: field.value?.from, to: field.value?.to } : undefined}
                onSelect={handleDateRangeSelect}
                numberOfMonths={1}
                defaultMonth={field.value?.from || new Date()}
              />
            </div>
          </PopoverContent>
        </Popover>
      </FormItem>

      {/* END DATE */}
      <FormItem className="flex flex-col mt-4">
        <FormLabel className="text-[12px] uppercase title-century-gothic-bold text-[#9FA2B4]">
          END DATE
        </FormLabel>
        <Popover open={openEndCalendar} onOpenChange={setOpenEndCalendar}>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-[150px] justify-start text-left font-normal", 
                !field.value?.to && "text-muted-foreground"
              )}
            >
              {field.value?.to ? (
                format(field.value.to, "LLL dd, y")
              ) : (
                <span>Pick an end date</span>
              )}
            </Button>
          </FormControl>
          <PopoverContent className="w-auto p-0 mt-2 z-50"> 
            <div className="scale-90">  
              <Calendar
                mode="range"
                selected={field.value?.from ? { from: field.value?.from, to: field.value?.to } : undefined}
                onSelect={handleDateRangeSelect}
                numberOfMonths={1}
                defaultMonth={field.value?.from || new Date()}
              />
            </div>
          </PopoverContent>
        </Popover>
      </FormItem>
    </div>
  )}
/>



          <CustomFormField 
            fieldType={FormFieldType.SELECT} 
            control={form.control} 
            className='w-[315px]'
            name="type"
            label="Type"
            placeholder="Select your type"
            options={[
              { value: "All", label: "All" },
              { value: "Stationary", label: "Stationary Combustion" },
              { value: "Mobil", label: "Mobil Combustion" },
              { value: "Refrigerants", label: "Refrigerants" },
              { value: "Market", label: "Purchased Electricity - Market Based" },
              { value: "Location", label: "Purchased Electricity - Location Based" },
              { value: "Heat", label: "Heat" },
              { value: "Transportation", label: "Transportation" },
            ]}
          />

          <div className='w-[190px] ml-14 mt-10'>
            <SubmitButton isLoading={isLoading}>Update</SubmitButton>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default FormModal;
