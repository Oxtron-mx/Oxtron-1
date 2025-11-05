"use client"
import { motion } from "framer-motion";
import NavigationLink from "./NavigationLink";
import Image from "next/image";
import { Bars3Icon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { logout } from "@/actions/auth";
import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";

interface NavigationProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  lang: "en" | "es" | "fr" | "de" | "ja" | "hi";
}

const Navigation = ({ isSidebarOpen, toggleSidebar }: NavigationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [_, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  const signOut = async () => {
    await logout()
    setIsLoading(true)
  }

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.nav);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  // if (loading || !dictionary) {
  //   return (
  //     <div className="flex items-center justify-center w-full h-full min-h-screen">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className={`fixed top-0 left-0 h-screen lg:w-[193px] w-0 ${isSidebarOpen && 'w-[193px]'} bg-black flex flex-col z-50 shadow shadow-neutral-600 transition-all duration-300`}>
      { dictionary &&
        <motion.nav 
          className={`lg:flex flex flex-col gap-20 p-5 justify-between h-full ${!isSidebarOpen && 'hidden'}`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between items-center">
              <div
                className={ `w-fit h-10 flex justify-center items-center ${ isSidebarOpen && 'block'} lg:block` }>
                <Image
                  src="/assets/images/logoWhite.webp"
                  priority
                  height={ 100 }
                  width={ 500 }
                  alt="Logotipo Oxtron"
                  className="w-[156px] h-[29px]"
                />
              </div>
              <button 
                className="text-white lg:hidden cursor-pointer"
                onClick={() => toggleSidebar()}
              >
                {isSidebarOpen ? (
                  <ChevronLeftIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
            <div className={`lg:flex flex-col gap-3 transition-all duration-300`}>
              <NavigationLink
                name={dictionary.dashboard}
                lang={lang}
                route={`/${lang}/dashboard`}
                isOpen={isSidebarOpen}>
                <Image src="/assets/icons/white/dashboard-1.png" height={20} width={20} alt="Dashboard" />
              </NavigationLink>
              <NavigationLink
                name={dictionary.measure}
                lang={lang}
                route={`/${lang}/dashboard/measure`}
                isOpen={isSidebarOpen}>
                <Image src="/assets/icons/white/Measure-1.png" height={20} width={20} alt="Measure" />
              </NavigationLink>
              <NavigationLink
                name={dictionary.comm}
                lang={lang}
                route={`/${lang}/dashboard/communicate`}
                isOpen={isSidebarOpen}>
                <Image src="/assets/icons/white/Communicate-1.png" height={20} width={20} alt="Communicate" />
              </NavigationLink>
              <NavigationLink
                name={dictionary.capture}
                lang={lang}
                route={`/${lang}/dashboard/capture`}
                isOpen={isSidebarOpen}>
                <Image src="/assets/icons/white/Capture-1.png" height={20} width={20} alt="Capture" />
              </NavigationLink>
              <NavigationLink
                name={dictionary.settings}
                lang={lang}
                route={`/${lang}/dashboard/settings`}
                isOpen={isSidebarOpen}>
                <Image src="/assets/icons/white/Settings.png" height={20} width={20} alt="Settings" />
              </NavigationLink>
            </div>
          </div>
          <form action={ signOut }>
              <button
                disabled={ isLoading }
                className="flex items-center h-[42px] gap-2 justify-center border-[0px] bg-white bg-opacity-20 rounded-lg w-full"
              >
                <Image src="/assets/icons/white/Log Out.png" height={20} width={20} alt="Log Out" />
                <span className="font-normal text-[14px]">{dictionary.out}</span>
              </button>
          </form>
        </motion.nav>
      }
    </div>
  );
}

export default Navigation;
