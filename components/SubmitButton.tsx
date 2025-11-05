import Image from "next/image";
import {Button} from "./ui/button";
import {cn} from "@/lib/utils";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SubmitButton = ({ isLoading, className, children, onClick }: ButtonProps) => {
  return (
    <Button
      type='submit'
      disabled={isLoading}
      className={cn("shad-primary-btn w-full py-6 hover:scale-95 transition duration-300", className)}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-4 title-century-gothic-regular">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;