'use client'
import IconButton from '@/components/measure/IconButton';
import {cn} from "@/lib/utils";

type Props = {
  title: string;
  handleOnCloseModal: () => void;
  children: React.ReactNode;
  stepper?: {
    steps: number;
    currentStep: number;
    setCurrentStep: (step: number) => void
  };
  className?: string;
};

const Modal = ({title, handleOnCloseModal, children, stepper, className = ''}: Props) => {
  return (
    <div
      className="fixed top-0 left-0 flex flex-col items-center justify-center w-screen h-screen bg-black/50 z-50"
      onClick={handleOnCloseModal}
    >
      <div
        className={cn('relative flex flex-col items-center justify-between w-full max-w-lg md:w-2/3 lg:w-1/3 h-auto max-h-[80vh] overflow-y-auto bg-white rounded-md p-8 gap-4', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="flex items-center justify-between w-full">
          <h3 className="font-bold text-xl text-neutral-900">{title}</h3>
          <div className="flex items-center justify-center rounded-full border-2 border-neutral-500">
            <IconButton
              src="/assets/icons/black/Delete.png"
              alt="Close icon"
              size="md"
              onClick={handleOnCloseModal}
            />
          </div>
        </section>

        <div className="w-full">{children}</div>
      </div>
      <div className="flex flex-column gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
        {Array.from({length: stepper?.steps || 0}, (_, index) => (
          <button
            key={index}
            className={cn(
              'w-3 h-3 rounded-full',
              index === stepper?.currentStep ? 'bg-[#03133A]' : 'bg-[#D9D9D9]'
            )}
            onClick={() => stepper?.setCurrentStep(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Modal;
