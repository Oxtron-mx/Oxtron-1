import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  isSelected: boolean,
}

export const StepButton = ({isSelected}: Props) => {
  return (
    <Button type="button" className={cn("w-[16px] h-[16px] rounded-full", isSelected ? 'bg-[#03133A]' : 'bg-[#D9D9D9]')}></Button>
  )
}
