import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

interface RegisterPageProps {
  params: { lang: Locale }; 
}

export default async function RegisterPage({ params: { lang } }: RegisterPageProps) {
  const dictionary = await getDictionary(lang); 

  return (
    <div className="bg-register flex min-h-screen md:h-full h-screen md:py-10">
      <section 
        className="remove-scrollbar bg-[#FFFFFF] m-auto md:min-w-[458px] w-full md:w-auto min-h-full md:min-h-[950px] md:rounded-[10px] p-[32px] pt-16"
      >
        <Image 
          src="/assets/images/logo.png"
          height={100}
          width={500}
          alt="oxtron" 
          className="mb-6 h-[64px] w-[336px] mx-auto"
        />
        <RegisterForm dictionary={dictionary.pages.signup} />
      </section>
    </div>
  );
}
