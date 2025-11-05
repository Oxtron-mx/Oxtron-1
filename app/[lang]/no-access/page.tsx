"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";
import { usePathname } from "next/navigation";

// ⬇️ Importación dinámica de Lottie para evitar errores de SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import animationData from "@/public/assets/lotties/loading-white.json";

const NoAccess = () => {
  const pathname = usePathname();

  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";

  const [dictionary, setDictionary] = useState({
    label1: "",
    label2: "",
    label3: "",
  });

  useEffect(() => {
    if (!lang) {
      console.error("Lang is undefined.");
      return;
    }

    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict.pages["no-access"]);
      } catch (error) {
        console.error("Error cargando el diccionario:", error);
      }
    };

    loadDictionary();
  }, [lang]);

  return (
    <div className="flex h-screen max-h-screen bg-dark-300">
      {/* Imagen lateral izquierda */}
      <Image
        src="/assets/images/bg-login.jpeg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img lg:max-w-[30%] md:max-w-[20%]"
      />

      {/* Contenido principal */}
      <section className="remove-scrollbar container my-auto flex flex-col justify-center gap-5">
        {/* Animación Lottie */}
        <Lottie
          animationData={animationData}
          className="flex justify-center items-center h-20"
          loop={true}
        />

        {/* Mensaje de acceso denegado */}
        <p className="text-center text-lg my-5">{dictionary.label1}</p>

        {/* Enlace */}
        <Link
          href="https://www.oxtron.mx/es"
          className="text-white uppercase title-geometos text-center"
        >
          {dictionary.label2} <span className="text-[#2A8CFE]">{dictionary.label3}</span>
        </Link>
      </section>

      {/* Imagen lateral derecha */}
      <Image
        src="/assets/images/bg-login-2.jpeg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img lg:max-w-[30%] md:max-w-[20%]"
      />
    </div>
  );
};

export default NoAccess;
