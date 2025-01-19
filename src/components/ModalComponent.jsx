import {
  Dialog,
  DialogContent,
  DialogTitle
} from "../components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function ModalComponent({ 
  isOpen = false,
  onClose,
  content,
}) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-40" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white">
          <VisuallyHidden>
            <DialogTitle>Modal</DialogTitle>
          </VisuallyHidden>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
}
