'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores en SSR
const TitleHandler = dynamic(() => import('@/components/TitleHandler'), { ssr: false });
const Loading = dynamic(() => import('@/components/loading/LoadingBlack'), { ssr: false });
const LocalSwitcher = dynamic(() => import('@/components/lang/locale-switcher'), { ssr: false });
const BackButton = dynamic(() => import('@/components/navigation/BackButton'), { ssr: false });

const Change = () => {
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);  // Estado para verificar si el componente se ha montado
  const pathname = usePathname();
  const lang = (pathname?.split("/")[1] as Locale) || "en";

  useEffect(() => {
    setIsMounted(true);  // Solo después de que el componente se monte en el cliente

    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.settings.change);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  // Asegúrate de que el componente solo se renderiza cuando ya se haya montado
  if (!isMounted) {
    return null;
  }

  if (loading || !dictionary) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className='p-6 ml-0 mt-6 lg:ml-[205px]'>
      <div className='flex items-center mb-4 gap-2'>
        <BackButton/>
        <TitleHandler title={dictionary.title} text={dictionary.subtitle} />
      </div>
      <LocalSwitcher />
    </div>
  );
};

export default Change;
