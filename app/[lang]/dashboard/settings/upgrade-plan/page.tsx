"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importaciones dinámicas para evitar errores de SSR
import dynamic from "next/dynamic";

const DashboardButton = dynamic(() => import("@/components/DashboardButton"), { ssr: false });
const TitleHandler = dynamic(() => import("@/components/TitleHandler"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/LoadingBlack"), { ssr: false });

const Upgrade = () => {
  const [isLoading, setIsLoading] = useState(false);
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
        setDictionary(dict.pages.settings.plan);
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
    <div className="p-6 lg:ml-[205px] ml-0 min-h-screen flex flex-col justify-between pb-10 md:ml-[205px]">
      <div>
        <div className="flex items-center mb-4 gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <TitleHandler
            title={dictionary.select}
            text={dictionary.choose}
          />
        </div>
        <div className="flex gap-10 flex-wrap mt-4 h-full w-full pb-9 flex-col md:flex-row">
          {/* Contenedor 1 */}
          <div className="relative bg-white shadow-xl px-7 py-5 rounded-xl w-[350px] flex-grow">
            <div className="flex flex-col mb-5">
              <h1 className="font-bold text-neutral-700 text-3xl Geometos">
                {dictionary.basic.title}
              </h1>
              <p className="text-neutral-400 text-xs mb-1">
                {dictionary.basic.subtitle}
              </p>
            </div>
            <div className="mb-5 mt-9">
              <DashboardButton
                isLoading={isLoading}
                onClick={() => {
                  console.log("Basic plan selected");
                }}
                style={{
                  background: "#9FA2B4",
                  fontFamily: "font-sans, sans-serif",
                  padding: "23px",
                  textTransform: "none",
                  width: "100%",
                }}
              >
                {dictionary.basic.button}
              </DashboardButton>
            </div>
            <div className="border-t border-gray-300 mt-4"></div>
            <div className="flex flex-col gap-4 mt-4">
              {[
                dictionary.basic.option1,
                dictionary.basic.option2,
                dictionary.basic.option3,
                dictionary.basic.option4,
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-4 border-white flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800">
                        <svg
                          className="w-4 h-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-neutral-700 text-xs">{item}</h2>
                </div>
              ))}
            </div>
          </div>
          {/* Contenedor 2 */}
          <div className="relative bg-white shadow-xl px-7 py-5 rounded-xl w-[350px] flex-grow">
            <div className="flex flex-col mb-5">
              <h1 className="font-bold text-neutral-700 text-3xl Geometos">
                {dictionary.pro.title}
              </h1>
              <p className="text-neutral-400 text-xs mb-1">
                {dictionary.pro.subtitle}
              </p>
            </div>
            <div className="mb-5">
              <DashboardButton
                isLoading={isLoading}
                onClick={() => {
                  console.log("Pro plan selected");
                }}
                style={{
                  background: "#9FA2B4",
                  fontFamily: "font-sans, sans-serif",
                  padding: "23px",
                  textTransform: "none",
                  width: "100%",
                }}
              >
                {dictionary.pro.button}
              </DashboardButton>
            </div>
            <div className="border-t border-gray-300 mt-4"></div>
            <div className="flex flex-col gap-4 mt-4">
              {[
                dictionary.pro.option1,
                dictionary.pro.option2,
                dictionary.pro.option3,
                dictionary.pro.option4,
                dictionary.pro.option5,
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-4 border-white flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800">
                        <svg
                          className="w-4 h-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-neutral-700 text-xs">{item}</h2>
                </div>
              ))}
            </div>
          </div>
          {/* Contenedor 3 */}
          <div className="relative bg-white shadow-xl px-7 py-5 rounded-xl border-2 border-blue-800 w-[350px] flex-grow">
            <div className="flex flex-col mb-5">
              <h1 className="font-bold text-neutral-700 text-3xl Geometos">
                {dictionary.advanced.title}
              </h1>
              <p className="text-neutral-400 text-xs mb-1">
                {dictionary.advanced.subtitle}
              </p>
            </div>
            <div className="mb-5">
              <DashboardButton
                isLoading={isLoading}
                onClick={() => {
                  console.log("Advanced plan selected");
                }}
                style={{
                  background: "linear-gradient(to top, #2A8CFE, #03133A)",
                  fontFamily: "font-sans, sans-serif",
                  padding: "23px",
                  textTransform: "none",
                  width: "100%",
                }}
              >
                {dictionary.advanced.button}
              </DashboardButton>
            </div>
            <div className="border-t border-gray-300 mt-4"></div>
            <p className="text-neutral-400 text-xs mb-1">
              {dictionary.advanced.label}
            </p>
            <div className="flex flex-col gap-4 mt-4">
              {[
                dictionary.advanced.option1,
                dictionary.advanced.option2,
                dictionary.advanced.option3,
                dictionary.advanced.option4,
                dictionary.advanced.option5,
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-4 border-white flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800">
                        <svg
                          className="w-4 h-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-neutral-700 text-xs">{item}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
