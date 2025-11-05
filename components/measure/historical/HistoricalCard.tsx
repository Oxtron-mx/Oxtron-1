import Image from 'next/image'
import { SearchIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Facility from '@/public/assets/icons/black/Facility.png'
import Loading from '@/components/loading/LoadingBlack';  
import { getDictionary } from "@/lib/dictionary";  
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import { useEffect, useState } from 'react'

type Props = {
  title: string,
  children: React.ReactNode
  registryCount: number,
  onClick: () => void,
};

export const HistoricalCard = ({ title, children, registryCount, onClick }: Props) => {
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.measure.histori);
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
    <Card className="w-full text-neutral-500 rounded-[8px] border-none shadow-2xl">
      <CardHeader className="flex flex-col items-start md:flex-row md:items-center md:justify-between w-full">
        <div className="flex flex-row items-center justify-center gap-4">
          <Image src={ Facility.src } alt="Facility" width="96" height="96" className="w-16 h-16"/>
          <h2 className="text-[#252733] text-3xl font-bold">{ title }</h2>
        </div>
        <div className="flex flex-row items-center justify-between gap-8">
          <Button className="text-[#FDFDFD] bg-[#03133A]" onClick={ onClick }>{dictionary.new}</Button>
          <div className="flex flex-row items-center justify-center bg-[#FDFDFD] w-48 border border-[#9FA2B4] rounded-lg pl-4">
            <SearchIcon className="w-10 h-10"/>
            <Input placeholder={dictionary.search} className="bg-transparent border-none focus-visible:ring-transparent h-8 w-[90%]"/>
          </div>
          <Badge className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 text-[#9FA2B4] bg-[#F4F4F4]">
            { `${ registryCount } record${ registryCount > 1 ? 's' : '' }` }
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        { children }
      </CardContent>
    </Card>
  )
}
