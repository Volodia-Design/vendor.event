import { create } from "zustand";

const useModal = create((set) => ({
  // Regular modal state
  isOpen: false,
  content: null,
  className: "",
  needToRefetch: false,
  setNeedToRefetch: (value) => set({ needToRefetch: value }),
  onOpen: (content, className = "") => {
    set({
      isOpen: true,
      content,
      className,
    });
  },
  onClose: () =>
    set({
      isOpen: false,
      content: null,
      className: "",
      needToRefetch: true,      
    }),

  // Success modal state
  isSuccessOpen: false,
  showSuccess: () => {
    set({ isSuccessOpen: true });
    setTimeout(() => {
      set({ isSuccessOpen: false });
    }, 1500);
  },
  closeSuccess: () => set({ isSuccessOpen: false }),

  // Error modal state
  isErrorOpen: false,
  showError: () => {
    set({ isErrorOpen: true });
    setTimeout(() => {
      set({ isErrorOpen: false });
    }, 1500);
  },
  closeError: () => set({ isErrorOpen: false }),

  // Delete modal state
  isDeleteModalOpen: false,
  deleteModalData: null,
  openDeleteModal: (data) => set({ isDeleteModalOpen: true, deleteModalData: data }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, deleteModalData: null }),
}));

export default useModal;