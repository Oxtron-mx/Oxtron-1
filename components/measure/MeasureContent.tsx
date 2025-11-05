import {useEffect, useState} from 'react';
import {usePathname} from "next/navigation";
import {Locale} from "@/i18n.config";
import {TabsContent} from '@/components/ui/tabs'
import MeasureCard from '@/components/measure/MeasureCard'
import Loading from '@/components/loading/LoadingBlack';
import {getDictionary} from "@/lib/dictionary";

type Props = {
  cards: Card[]
  scope: string
};

const MeasureContent = ({scope, cards = []}: Props) => {
  const pathname = usePathname();
  const lang: Locale = (pathname?.split("/")[1] as Locale) || "en";
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        const dict = await getDictionary(lang);
        setDictionary(dict.pages.measure);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const filterCards = (cards: Card[], scope: string): Card[] => {
    if (scope === dictionary.bar[0]) {
      return cards;
    }
    return cards.filter(card => card.footerCard?.scope.includes(scope));
  };

  return (loading || !dictionary) ? (
    <div className="flex items-center justify-center w-full h-full">
      <Loading/>
    </div>
  ) : (
    <TabsContent value={scope}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
        {cards.length !== 0 ? filterCards(cards, scope).map((card) => (
          <MeasureCard
            {...card}
            and={dictionary.and}
            key={card.id}/>
        )) : <p className="text-black">{dictionary.nodata}</p>}
      </div>
    </TabsContent>
  )
}

export default MeasureContent
