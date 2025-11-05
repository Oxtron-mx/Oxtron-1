import dynamic from "next/dynamic";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";

// ⬇️ Importación dinámica de UpdatePasswordForm para evitar errores de SSR
const UpdatePasswordForm = dynamic(
  () => import("@/components/forms/UpdatePasswordForm"),
  { ssr: false }
);

interface RegisterPageProps {
  params: { lang: Locale }; 
}

export default async function Update({ params: { lang } }: RegisterPageProps) {
  const dictionary = await getDictionary(lang); 

  return (
    <div className="bg-register flex min-h-screen md:h-full md:py-10">
      <section
        className="remove-scrollbar bg-[#FFFFFF] mx-auto md:min-w-[458px] md:w-auto w-full h-full md:rounded-[10px] p-[32px] md:pt-16 pt-36"
      >
          <Image 
            src="/assets/images/logo.png"
            height={100}
            width={500}
            alt="oxtron"
            className="mb-6 h-[64px] w-[336px] ml-auto mr-auto "
          />
          <UpdatePasswordForm dictionary={dictionary.pages.update}/>
      </section>
    </div>
  );
}
