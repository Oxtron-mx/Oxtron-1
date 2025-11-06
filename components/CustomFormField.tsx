import { E164Number } from 'libphonenumber-js/core'
import Image from 'next/image'
import ReactDatePicker from 'react-datepicker'
import '@/components/react-datepicker.css'
import "react-datepicker/dist/react-datepicker.css";
// import { format } from 'date-fns'
import { Control } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import { Checkbox } from './ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { /* CalendarIcon, */Eye, EyeOff } from 'lucide-react' // Importa los íconos para mostrar/ocultar contraseña
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
// import { Button } from './ui/button'
// import { cn } from '@/lib/utils'
// import { Calendar } from '@/components/ui/calendar'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import imageCompression from 'browser-image-compression'

export enum FormFieldType {
  INPUT = 'input',
  PASSWORD = 'password',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
  RADIO = 'radio',
  FILE_INPUT = 'fileInput',
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onPasswordToggle?: () => void;
  options?: { value: string; label: string }[]; // Opciones para el SELECT
  className?: string
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, ...restProps } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl className={`flex-1 title-century-gothic-regular bg-[#FCFDFE] ${props.className}`}>
          <Input
            placeholder={ props.placeholder }
            { ...field }
            {...restProps}
            className="bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]"
          />
        </FormControl>
      )
    case FormFieldType.PASSWORD:
      return (
        <div className="relative">
          <Input
            placeholder={ props.placeholder }
            type={ props.showPassword ? 'text' : 'password' }
            { ...field }
            className="bg-[#FCFDFE] border-[#DFE0EB] border-[1px] pr-10 text-[#4B506D]"
          />
          { props.showPasswordToggle && (
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#9FA2B4]"
              onClick={ props.onPasswordToggle }
            >
              { props.showPassword ? <Eye strokeWidth={ 1 }/> : <EyeOff strokeWidth={ 1 }/> }
            </span>
          ) }
        </div>
      )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={ props.placeholder }
            { ...field }
            className="bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]"
            disabled={ props.disabled }
          />
        </FormControl>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={ props.placeholder }
            countryCallingCodeEditable={ false }
            international
            withCountryCallingCode
            value={ field.value as E164Number | undefined }
            onChange={ field.onChange }
            className="flex h-10 w-full !bg-transparent rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 title-century-gothic-regular bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]"
            numberInputProps={ { required: true, className: '!bg-transparent' } }
          />
        </FormControl>
      )
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4 title-century-gothic-regular bg-[#FCFDFE]">
            <Checkbox
              id={ props.name }
              checked={ field.value }
              onCheckedChange={ field.onChange }
            />
            <label htmlFor={ props.name } className="checkbox-label">
              { props.label }
            </label>
          </div>
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      /* const date = field.value ? new Date(field.value) : undefined;

      return (
        <div className="flex rounded-md flex-1 title-century-gothic-regular bg-[#FCFDFE]">
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-dark-200">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    console.log('Selected date:', selectedDate); // Verificar si el onSelect se ejecuta
                    field.onChange(selectedDate?.toISOString()); // Manejar el cambio y convertir a string ISO
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
        </div>
      ); */
      return (
        <div className="flex items-center rounded-md flex-1 title-century-gothic-regular bg-[#FCFDFE] border border-gray-300">
          <div className="flex items-center px-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
              className="mr-2"
            />
          </div>
          <FormControl className="flex-1">
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date ? date.toISOString() : '')}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? 'MM/dd/yyyy'}
              className="w-full px-4 py-2"
              wrapperClassName="date-picker"
              autoFocus={false}
              preventOpenOnFocus={true}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl className="flex-1 title-century-gothic-regular bg-[#FCFDFE]">
          <Select onValueChange={ field.onChange } value={ field.value?.toString() } disabled={props?.disabled}>
            <FormControl>
              <SelectTrigger className="bg-[#FCFDFE] border-[#DFE0EB] text-[#4B506D]">
                <SelectValue placeholder={ props.placeholder }/>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#FCFDFE] border-[#DFE0EB] text-[#4B506D]">
              {props.options?.map((option, index) => (
                <SelectItem
                  key={`${option.value}-${index}`}
                  value={option.value}>
                  { option.label }
                </SelectItem>
              )) }
            </SelectContent>
          </Select>
        </FormControl>
      )
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null
    case FormFieldType.RADIO:
      return (
        <FormControl>
          <div className="flex items-center gap-4 title-century-gothic-regular bg-[#FCFDFE]">
            <RadioGroup defaultValue="1" className="flex">
              { props.options?.map(({ label, value }, index) => {
                if (index === 0) {
                  field.value = value
                }
                return (
                  <div key={ index } className="flex items-center justify-center w-64 h-10 border rounded-lg" onClick={ () => field.value = value }>
                    <RadioGroupItem
                      value={ value }
                      id={ props.name }
                      onChange={ field.onChange }
                      className={ cn(`${ field.value === value ? 'bg-gray' : 'bg-blue' }`) }
                      { ...field }
                    />
                    <Label htmlFor={ value }>{ label }</Label>
                  </div>
                )
              }) }
            </RadioGroup>
          </div>
        </FormControl>
      )
    case FormFieldType.FILE_INPUT:
      return (
        <FormControl>
          <Input
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return

              const isValid = file.type.startsWith("image/")
              if (!isValid) {
                alert("El archivo debe ser una imagen.")
                return
              }

              try {
                const compressedFile = await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1024,
                  useWebWorker: true
                })

                const reader = new FileReader()
                reader.onloadend = () => {
                  const base64Image = reader.result as string
                  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "")

                  field.onChange(cleanBase64)
                }
                reader.readAsDataURL(compressedFile)
              } catch (error) {
                console.error("Error al comprimir la imagen:", error)
              }
            }}
            className="bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]"
          />
        </FormControl>
      )
    default:
      return null
  }
}

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props

  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => (
        <FormItem className="flex-1">
          { props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="text-[12px] uppercase title-century-gothic-bold text-[#9FA2B4]">{ label }</FormLabel>
          ) }
          <RenderInput field={ field } props={ props }/>
          <FormMessage className="shad-error"/>
        </FormItem>
      ) }
    />
  )
}

export default CustomFormField
