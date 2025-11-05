'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import IconButton from '@/components/measure/IconButton'
import ScopeBadge from '@/components/measure/ScopeBadge'
import { cn } from '@/lib/utils'

const MeasureCard = ({
  title = '',
  icon: { src, position = 'head', onClick: iconOnClick },
  description,
  footerCard,
  link,
  onClick,
  and = 'and',
}: Card & {and?: string}) => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Card className="w-full text-neutral-500 rounded-[8px] !shadow-custom" onClick={ onClick }>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 ">
          <div>
            <h3
              className={ cn(
                'font-bold text-xl text-neutral-900',
                link ? 'cursor-pointer' : 'cursor-default',
              ) }
              onClick={ link ? () => router.push(pathname + link) : undefined }
            >
              { title }
            </h3>
            {/*<span className="font-light text-neutral-500 text-xs">{`Last Update: ${dateOnly}`}</span>*/}
          </div>
          { position === 'head' &&
            <IconButton
              src={ src }
              alt="Edit icon"
              size="md"
              onClick={ iconOnClick }
            />
          }
        </div>
        <hr/>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <span className="text-sm">{ description }</span>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-4">
        { position === 'body' && footerCard &&
          <>
            <ScopeBadge scope={ footerCard.scope } and={and}/>
            <IconButton src={ src } alt={ src } size="xl"/>
          </>
        }
      </CardFooter>
    </Card>
  )
}

export default MeasureCard
