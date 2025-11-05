"use client"
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../public/assets/lotties/loading.json';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
  };

  return (
    <div className="flex items-center justify-center">
      <Lottie {...defaultOptions} />
    </div>
  );
};

const ErrorPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
      const loadDictionary = async () => {
        try {
          setLoading(true);
          const dict = await getDictionary(lang);
          setDictionary(dict.pages.dashboard.error);
        } catch (error) {
          console.error("Error loading dictionary:", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadDictionary();
    }, [lang]);

  const handleGoHome = () => {
    router.push('/dashboard/measure'); 
  };

  if (loading || !dictionary) {
    return <Loading />;
  }

  return (
    <div className="lg:ml-[205px] flex flex-col items-center justify-center h-full">
      <Loading />

      <h1 className="text-3xl mb-10 mt-7 font-bold text-black">
        {dictionary.title}
      </h1>
      <h2 className="text-xl mb-10 font-bold text-black">
        {dictionary.subtitle}
      </h2>

      <Button
        type="button"
        onClick={handleGoHome}
        className={"shad-primary-btn w-[200px] py-6 hover:scale-95 transition duration-300"}
      >
        {dictionary.button}
      </Button>
    </div>
  );
};

export default ErrorPage;
