import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Props = {
  title: string
  description?: string
  cancelText?: string
  continueText?: string
  children: React.ReactNode
  onAcceptHandler: () => void
}

export function Dialog({ title, description, cancelText = 'cancel', continueText = 'continue', onAcceptHandler, children }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        { children }
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>{ title }</AlertDialogTitle>
          { description ?? (
            <AlertDialogDescription>
              { description }
            </AlertDialogDescription>
          ) }
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="shad-danger-btn">{ cancelText }</AlertDialogCancel>
          <AlertDialogAction onClick={ onAcceptHandler } className="shad-primary-btn hover:scale-95 transition duration-300">{ continueText }</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
