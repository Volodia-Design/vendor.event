// Store
import { create } from "zustand";

const useModal = create((set) => ({
    // Regular modal state
    isOpen: false,
    content: null,
    onOpen: (content) => set({ isOpen: true, content }),
    onClose: () => set({ isOpen: false, content: null }),

    // Success modal state
    isSuccessOpen: false,
    showSuccess: () => {
        set({ isSuccessOpen: true });
        setTimeout(() => {
            set({ isSuccessOpen: false });
        }, 3000);
    },
    closeSuccess: () => set({ isSuccessOpen: false }),

    // Error modal state
    isErrorOpen: false,
    showError: () => {
        set({ isErrorOpen: true });
        setTimeout(() => {
            set({ isErrorOpen: false });
        }, 3000);
    },
    closeError: () => set({ isErrorOpen: false }),
}));

export default useModal;