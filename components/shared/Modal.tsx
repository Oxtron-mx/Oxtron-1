import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogClose,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import React from 'react'
import { CircleX, LucideIcon } from 'lucide-react'

type Props = {
  children: React.ReactNode,
  className?: string,
  title?: string,
  Icon?: LucideIcon | string,
  description?: string,
  open: boolean,
  onClose: () => void,
  customClose?: boolean
}

const Modal = ({ children, className, title, Icon, description, open, onClose, customClose = false }: Props) => {
  return (
    <Dialog open={ open } onOpenChange={ onClose } modal>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogContent className={ cn('overflow-y-scroll bg-white border-0 text-black no-scrollbar', className) }>
          { title ??
            <DialogHeader className="flex flex-row items-center justify-between">
              { Icon && React.createElement(Icon, { className: 'w-4 h-4' }) }
              <DialogTitle className="text-black text-center">{ title }</DialogTitle>
              <DialogDescription>{ description }</DialogDescription>
            </DialogHeader>
          }
          { children }
        </DialogContent>
      </DialogPortal>
      { customClose ?? (
        <DialogClose asChild className="flex items-center justify-center">
          <CircleX className="w-16 h-16"/>
        </DialogClose>
      ) }
    </Dialog>
  )
}

export default Modal
