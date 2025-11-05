'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';
import { getGWPDataset } from '@/actions/settings';
import { IGWP } from '@/constants/types';
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores en SSR
import dynamic from 'next/dynamic';
import BackButton from "@/components/navigation/BackButton";

const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });
const Select = dynamic(() => import('@/components/ui/select').then((mod) => mod.Select), { ssr: false });
const SelectItem = dynamic(() => import('@/components/ui/select').then((mod) => mod.SelectItem), { ssr: false });
const SelectContent = dynamic(() => import('@/components/ui/select').then((mod) => mod.SelectContent), { ssr: false });
const SelectGroup = dynamic(() => import('@/components/ui/select').then((mod) => mod.SelectGroup), { ssr: false });
const SelectValue = dynamic(() => import('@/components/ui/select').then((mod) => mod.SelectValue), { ssr: false });
const SelectTrigger = dynamic(() => import('@/components/ui/select').then((mod) => mod.SelectTrigger), { ssr: false });

const Report = () => {
  const [gwpDataset, setGwpDataset] = useState<IGWP[]>()
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  const loadData = async () => {
    const response = await getGWPDataset()

    if (response.success)
      setGwpDataset(response.data as IGWP[])
  }

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.report);
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
    <div className="ml-0 p-6 w-full lg:w-1/2 lg:ml-[205px]">
      <div className="flex items-center mb-4 gap-2">
        <BackButton/>
        <TitleHandler title={dictionary.params} text={dictionary.manage}/>
      </div>
      <div className="flex flex-col gap-6 mt-6">
        {/* Primer Contenedor */ }
        <div className="bg-white shadow-xl p-4 rounded-xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-neutral-700 text-lg font-bold">GWP Dataset</h2>
            <div className="w-8 h-8 flex items-center justify-center border border-black rounded-full">
              <span className="text-neutral-600 italic">i</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between rounded-xl text-black">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="GWP" className="bg-dark-200 text-black" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200">
                <SelectGroup className="bg-dark-200">
                  { gwpDataset?.map((value) =>
                    <SelectItem value={ value.description.toLowerCase() } key={ value.idGWP }>
                      { value.description }
                    </SelectItem>)
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segundo Contenedor */ }
        <div className="bg-white shadow-xl p-4 rounded-xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-neutral-700 text-lg font-bold">RF Factors</h2>
            <div className="w-8 h-8 flex items-center justify-center border border-black rounded-full">
              <span className="text-neutral-600 italic">i</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between rounded-xl text-black">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={dictionary.option3} className="bg-dark-200 text-black"/>
              </SelectTrigger>
              <SelectContent className="bg-dark-200">
                <SelectGroup className="bg-dark-200">
                  <SelectItem value="yes">{dictionary.option3}</SelectItem>
                  <SelectItem value="no">{dictionary.option4}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ChevronDownIcon className="w-5 h-5 text-neutral-700"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report
