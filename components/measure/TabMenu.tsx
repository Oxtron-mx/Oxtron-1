'use client'
import { useState } from 'react'
import { Tabs, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@/components/ui/tabs'
import IconButton from '@/components/measure/IconButton'
import MeasureContent from '@/components/measure/MeasureContent'
import { cn } from '@/lib/utils'

type Props = {
  items: string[];
  cards: Card[];
  iconButton?: IIconButton[];
};

const TabMenu = ({ items, cards, iconButton }: Props) => {
  const [item, setItem] = useState<string>(items[0])

  return (
    <Tabs defaultValue={ items[0] }>
      <TabsList
        className="flex items-center justify-between w-full h-8 p-0 border-b-2 border-gray-200 rounded-none overflow-visible">
        <div className={ cn(
          'flex items-center justify-start overscroll-x-contain overflow-x-scroll no-scrollbar',
          iconButton ? 'w-1/2 md:w-2/3' : 'w-full'
        ) }>
          { items.map((item, index) => (
            <TabsTrigger
              onClick={ () => setItem(item) }
              value={ item }
              className={ cn(
                'text-black',
                'data-[state=active]:border-b-4',
                'data-[state=active]:border-black',
                'data-[state=active]:shadow-none'
              ) }
              key={ index }
            >
              { item }
            </TabsTrigger>
          )) }
        </div>
        { iconButton &&
          <div className="flex items-center justify-end w-1/2 md:w-1/3 gap-4">
            { iconButton.map((icon, index) => (
              <IconButton
                text={ icon.text }
                src={ icon.src }
                alt={ icon.alt }
                size="xs"
                onClick={ icon.onClick }
                key={ index }
              />
            )) }
          </div>
        }
      </TabsList>
      <div className="mt-8">
        <MeasureContent cards={ cards } scope={ item }/>
      </div>
    </Tabs>
  )
}

export default TabMenu
