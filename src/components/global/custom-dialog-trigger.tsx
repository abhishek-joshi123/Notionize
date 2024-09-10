import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import clsx from 'clsx'

interface CusTomDialogTriggerProps {
    header ?: string
    content ?: React.ReactNode
    children ?: React.ReactNode
    description ?: string
    className ?: string
}

const CusTomDialogTrigger:React.FC<CusTomDialogTriggerProps> = ({header, content, children, description, className}) => {
  return (
    <Dialog>
        <DialogTrigger className= {clsx('', className)}>{children}</DialogTrigger>
        <DialogContent className='h-screen block sm:h-[440px] overflow-scroll w-full'>
        <DialogHeader>
        <DialogTitle>{header}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
        </DialogContent>
    </Dialog>
  )
}

export default CusTomDialogTrigger
