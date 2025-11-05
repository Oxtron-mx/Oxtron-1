import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

interface CaptureEmissionsProps {
  captureEmissions: number | null;
  translations: {
    title: string;
    label1: string;
    label2: string;
    contact: string;
  };
}

const CaptureEmissions: React.FC<CaptureEmissionsProps> = ({ captureEmissions, translations }) => {
  return (
    <div className="h-screen rounded-[8px] shadow-custom p-6 max-h-[400px] md:w-[250px] w-full flex flex-col justify-between">
      <h2 className="text-xl font-bold text-neutral-800 text-center">
        {translations.title}
      </h2>
      <div>
        <Image
          src="/assets/images/arco.png"
          alt={translations.title}
          width={100}
          height={100}
          className="w-auto h-auto mx-auto my-auto"
        />
        <div className="-mt-4">
          <p className="text-4xl font-bold text-neutral-800 font-sans text-center flex flex-col">
            {captureEmissions}
            <span className="text-neutral-700 text-sm font-sans text-center font-light"> T CO2 e</span>
          </p>
        </div>
        <p className="text-black text-sm text-left font-sans mt-4">
          {translations.label1} <br /> <br />
          {translations.label2}
        </p>
      </div>
      <div className="w-[140px] h-[42px] mx-auto">
        <a href="mailto:soporte@oxtron.mx" className="w-full">
          <Button
            type="button"
            className={"shad-primary-btn w-full py-6 hover:scale-95 transition duration-300"}
          >
            {translations.contact}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default CaptureEmissions;
