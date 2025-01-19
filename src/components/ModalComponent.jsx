"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function ModalComponent({ 
  isOpen = false,
  onClose,
  content,
  title
}) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black-900/80 z-40" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
          {content}
        </DialogContent>
      </Dialog>
    </>
  )
}