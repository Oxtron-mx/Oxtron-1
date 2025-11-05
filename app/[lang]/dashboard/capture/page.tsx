"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores de "document is not defined"
const CarbonChart = dynamic(() => import("@/components/charts/carbonChart"), { ssr: false });
const DataStats = dynamic(() => import("@/components/charts/dataStats"), { ssr: false });
const InformationTable = dynamic(() => import("@/components/charts/informationTable"), { ssr: false });
const ParticularChart = dynamic(() => import("@/components/charts/particularChart"), { ssr: false });
const TitleHandler = dynamic(() => import("@/components/TitleHandler"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });


const Capture = () => {
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
    <div className='min-h-screen overflow-hidden p-6 lg:ml-[205px] ml-0'>
      <TitleHandler title={dictionary.title} text={dictionary.subtitle} />
      <div className='mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <DataStats name={dictionary.produced} stats={449} unit="Tons" />
        <DataStats name={dictionary.captured} stats={265} unit="Tons" />
        <DataStats name={dictionary.impact} stats={6} unit="Tons" />
        <DataStats name={dictionary.progress} stats={44} unit="%" />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mt-7'>
        {/* Contenedor para CarbonChart y ParticularChart */}
        <div className='col-span-3 flex flex-col gap-8'>
          <CarbonChart />
          <ParticularChart />
        </div>
        {/* Contenedor para InformationTable */}
        <div className='lg:col-span-1 mt-7 lg:mt-0'>
          <InformationTable />
        </div>
      </div>
    </div>
  );
}
 
export default Capture