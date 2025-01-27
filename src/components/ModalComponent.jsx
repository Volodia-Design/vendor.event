import {
  Dialog,
  DialogContent,
  DialogTitle
} from "../components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { CheckCircle, XCircle } from 'lucide-react' // Assuming you're using lucide icons
import { motion, AnimatePresence } from 'framer-motion'

// Regular Modal Component (unchanged)
export function ModalComponent({ 
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

// Success Modal Component
export function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black-900/80 z-40" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle>a</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="bg-green-50 border-2 border-green-500 max-w-sm p-0 overflow-hidden">
          <motion.div 
            className="flex items-center gap-3 p-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
            >
              <CheckCircle className="h-6 w-6 text-green-500" />
            </motion.div>
            <motion.p 
              className="text-green-700 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Operation completed successfully!
            </motion.p>
          </motion.div>
          <motion.div
            className="h-1 bg-green-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

// Error Modal Component
export function ErrorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black-900/80 z-40" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle>a</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="bg-red-50 border-2 border-red-500 max-w-sm p-0 overflow-hidden">
          <motion.div 
            className="flex items-center gap-3 p-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
            >
              <XCircle className="h-6 w-6 text-red-500" />
            </motion.div>
            <motion.p 
              className="text-red-700 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              An error occurred!
            </motion.p>
          </motion.div>
          <motion.div
            className="h-1 bg-red-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

