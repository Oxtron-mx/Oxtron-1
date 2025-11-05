import {useState, useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {getDictionary} from "@/lib/dictionary";

// type Locale = 'en' | 'es' ;
type Locale = 'en' | 'es' | 'de' | 'fr' | 'ja' | 'hi' ;

export const useDictionary = () => {
  const path = usePathname();
  const lang: Locale = (path?.split("/")[1] as Locale) || "en";
  const [isLoading, setIsLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      setIsLoading(true);
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict.pages);
      } catch (error) {
        console.error("Error loading dictionary", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  return {isLoading, dictionary, lang};
};
