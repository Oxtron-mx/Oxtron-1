type Props = {
  field: any,
  placeholder: string,
  options: Option[],
}

const CustomSelect = ({ field, placeholder, options }: Props) => {
  return (
    <div className="flex-1 title-century-gothic-regular bg-[#FCFDFE]">
      <div className="flex flex-col justify-center w-full gap-4 text-black">
        <label
          htmlFor="native-select"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[12px] uppercase title-century-gothic-bold text-[#9FA2B4]"
        >
          {placeholder}
        </label>
        <select
          id="native-select"
          name="native-select"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          className="flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 title-century-gothic-regular bg-[#FCFDFE] border-[#DFE0EB] border-[1px] text-[#4B506D]"
        >
          <option value="" hidden>
            {placeholder}
          </option>
          {options?.map((opt, index) => (
            <option key={`${opt.value}-${index}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomSelect;
