"use client";
import 'chart.js/auto';
import { CheckIcon } from 'lucide-react'; 
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Loading from '@/components/loading/LoadingBlack';
import { useEffect, useState } from 'react';

const InformationTable = () => {
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.capture);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }


  return (
    <div className='rounded-[8px] shadow-custom md:p-6 p-3 w-full h-full'>
      <h2 className='text-xl font-bold text-neutral-800 text-center mb-6'>
      {dictionary.information.title}
      </h2>

      <div className='flex flex-col'>
        {/* Cuadro 1 */} 
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.temperature}</p>
            <h2 className='text-xl font-bold text-neutral-800'>35<span className='text-black text-sm font-normal'>°C</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
        {/* Cuadro 2 */}
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.humidity}</p>
            <h2 className='text-xl font-bold text-neutral-800'>24<span className='text-black text-sm font-normal'>%</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
        {/* Cuadro 3 */}
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.pressure}</p>
            <h2 className='text-xl font-bold text-neutral-800'>1000<span className='text-black text-sm font-normal'>hPa</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
        {/* Cuadro 4 */}
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.water}</p>
            <h2 className='text-xl font-bold text-neutral-800'>20<span className='text-black text-sm font-normal'>L</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
        {/* Cuadro 5 */}
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.chemical}</p>
            <h2 className='text-xl font-bold text-neutral-800'>20<span className='text-black text-sm font-normal'>L</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
        {/* Cuadro 6 */}
        <div className='bg-[#F4F4F4] p-4 rounded-[8px]  flex items-center gap-4 mb-6'>
          <div className='flex flex-col flex-1 text-center'>
            <p className='text-neutral-400 text-sm'>{dictionary.information.produced}</p>
            <h2 className='text-xl font-bold text-neutral-800'>15<span className='text-black text-sm font-normal'>kg</span></h2>
          </div>
          <div className='w-8 h-8 flex items-center justify-center border-2 rounded-[8px] border-[#136AF6]'>
            <div className='w-6 h-6 flex items-center justify-center bg-transparent'>
              <CheckIcon className='w-4 h-4 text-[#136AF6]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationTable;
