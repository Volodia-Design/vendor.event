import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckCircle, XCircle } from "lucide-react"; // Assuming you're using lucide icons
import { motion } from "framer-motion";
import { useState } from "react";

export function ModalComponent({
  isOpen = false,
  onClose,
  content,
  title,
  className = "",
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black-900/80 z-40' />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${className}  max-h-[99vh]`}>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription>{title}</DialogDescription>
          </VisuallyHidden>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Success Modal Component
export function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black-900/80 z-40' />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle>a</DialogTitle>
        </VisuallyHidden>
        <DialogContent className='bg-green-50 border-2 border-green-500 max-w-sm p-0 overflow-hidden'>
          <motion.div
            className='flex items-center gap-3 p-4'
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
                delay: 0.1,
              }}
            >
              <CheckCircle className='h-6 w-6 text-green-500' />
            </motion.div>
            <motion.p
              className='text-green-700 font-medium'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Operation completed successfully!
            </motion.p>
          </motion.div>
          <motion.div
            className='h-1 bg-green-500'
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Error Modal Component
export function ErrorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black-900/80 z-40' />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle>a</DialogTitle>
        </VisuallyHidden>
        <DialogContent className='bg-red-50 border-2 border-red-500 max-w-sm p-0 overflow-hidden'>
          <motion.div
            className='flex items-center gap-3 p-4'
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
                delay: 0.1,
              }}
            >
              <XCircle className='h-6 w-6 text-red-500' />
            </motion.div>
            <motion.p
              className='text-red-700 font-medium'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              An error occurred!
            </motion.p>
          </motion.div>
          <motion.div
            className='h-1 bg-red-500'
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Delete Confirmation Modal
export function DeleteConfirmationModal({ isOpen, onClose, data, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!data?.onConfirm) return;

    setIsLoading(true);
    try {
      await data.onConfirm(); // Execute the delete function
      onClose(); // Close modal only after success
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white p-6 rounded-lg shadow-lg max-w-sm'>
        <DialogTitle className='text-lg font-semibold'>
          Are you sure?
        </DialogTitle>
        <div className='flex flex-col gap-2'>
          <p className='text-gray-600'>Do you really want to delete?</p>
          <p className='text-gray-600'>This action cannot be undone.</p>
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <motion.button
            className='px-4 py-2 bg-gray-300 rounded-md'
            whileHover={{ scale: 1.05 }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </motion.button>
          <motion.button
            className='px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50'
            whileHover={{ scale: 1.05 }}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
