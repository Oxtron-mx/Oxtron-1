"use client";
import Header from "@/components/navigation/Header";
import Navigation from "@/components/navigation/Navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useLayout } from "@/components/context/LayoutContext";

export default function HomeLayout({
  children }: {
  children: React.ReactNode;}) {

  const { isSidebarOpen, toggleSidebar, lang } = useLayout();

  return (
    <div className="bg-white min-h-screen flex h-full justify-center">
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        lang={lang}
      />
      <main className={`flex-1 transition-all duration-300 flex flex-col mx-auto`}>
        <div className="fixed w-full bg-white pb-3 z-10 min-h-[80px]">
          <div className="flex justify-between items-center px-6 pt-6">
            <div className="w-10 h-10 lg:hidden flex items-center">
              {!isSidebarOpen && (
                <Bars3Icon
                  className="text-neutral-700/30 cursor-pointer w-6 h-6"
                  onClick={toggleSidebar}
                />
              )}
            </div>
            <Header lang={lang} />
          </div>
        </div>
        <div className="flex-1 mt-14">{children}</div>
      </main>
    </div>
    );
}
