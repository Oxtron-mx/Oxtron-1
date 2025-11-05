"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores en SSR
import dynamic from 'next/dynamic';

const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });



const V = () => {
    const pathname = usePathname()
    const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
    const [loading, setLoading] = useState(true);
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        const loadDictionary = async () => {
          try {
            setLoading(true);
            const dict = await getDictionary(lang);
            setDictionary(dict.pages.settings.glossary);
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

    const glossaryItems = [
        { term: dictionary.v.value, 
            definition: dictionary.v.definition},
    ];

    return (
        <div className='min-h-screen flex flex-col justify-between ml-0 p-6 lg:ml-[205px]'>
            <div>
                <div className='flex items-center mb-4 gap-2'>
                    <button onClick={() => window.history.back()} className='flex items-center gap-2 text-blue-600 hover:text-blue-800'>
                        <ArrowLeft className='w-6 h-6' /> 
                    </button>
                    <TitleHandler title={dictionary.title} text='V' />
                </div>
                <div className='flex gap-10 flex-wrap mt-4 h-full w-full pb-9 flex-col lg:flex-row'>

                    {glossaryItems.map((item, index) => (
                        <div key={index} className='relative bg-white shadow-xl px-7 py-5 rounded-xl w-[350px] flex-grow'>
                            <div className='flex flex-col mb-5'>
                                <h1 className='font-bold text-neutral-700 text-2xl Geometos'>{item.term}</h1>
                                <p className='text-neutral-600 mt-2'>{item.definition}</p>
                            </div>
                            <div className='border-t border-gray-300 mt-4'></div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default V;
