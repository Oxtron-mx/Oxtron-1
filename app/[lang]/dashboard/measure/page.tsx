"use client";
import dynamic from "next/dynamic";
import { useDictionary } from "@/hooks/shared/useDictionary";

// ⬇️ Importaciones dinámicas para evitar errores de SSR (document is not defined)
const TitleHandler = dynamic(() => import("@/components/TitleHandler"), { ssr: false });
const TabMenu = dynamic(() => import("@/components/measure/TabMenu"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });

declare global {
  type Card = {
    id: string | number
    title?: string
    lastUpdated: Date | string
    description: string
    icon: {
      src: string
      position?: 'head' | 'body'
      onClick?: () => void
    }
    footerCard?: {
      scope: string[]
    }
    link?: string
    onClick?: () => void
  }

  type Option = {
    value: string;
    label: string;
  }
}

export default function Measure() {
  const {isLoading, dictionary} = useDictionary();
  const items: string[] = dictionary?.measure.bar || [];

  return (isLoading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <div className="flex flex-col gap-4 lg:ml-[205px] p-6 ml-0">
      <TitleHandler title={dictionary?.measure.title} text={dictionary?.measure.subtitle}/>
      <TabMenu items={items} cards={dictionary?.measure.cards}/>
    </div>
  );
}
