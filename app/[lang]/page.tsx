"use server"
import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";
import { LayoutProvider } from "@/components/context/LayoutContext";

interface HomeProps {
  params: { lang: Locale };
}

export default async function Home({ params: { lang } }: HomeProps) {
  const dictionary = await getDictionary(lang);

  return (
    <LayoutProvider>
      <div className="flex h-screen max-h-screen bg-login">
        <section 
          className="remove-scrollbar bg-[#FFFFFF] my-auto mx-auto md:min-w-[458px] md:w-auto w-full h-full md:h-[617px] md:rounded-[10px] p-[32px] md:pt-16 pt-36"
        >
          <Image 
            src="/assets/images/logo.png"
            height={100}
            width={500}
            alt="oxtron"
            className="mb-6 h-[64px] w-[336px] ml-auto mr-auto "
          />
          <LoginForm dictionary={dictionary.pages.login} /> 
        </section>
      </div>
    </LayoutProvider>
  );
}
