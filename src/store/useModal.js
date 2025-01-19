import { create } from 'zustand';

const useModal = create((set) => ({
  isOpen: false,
  content: null,
  openModal: (content) => {
    set({ isOpen: true, content });
  },
  closeModal: () => {
    set({ isOpen: false, content: null });
  },
}));

export default useModal;
