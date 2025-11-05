"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Locale } from "@/i18n.config";

interface LayoutContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  lang: Locale;
  setLang: (lang: Locale) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Locale>('en');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, lang, setLang }}>
      {children}
    </LayoutContext.Provider>
  );
};

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
}