import { create } from "zustand";

const useActiveTab = create((set) => ({
  activeTab: null, 
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useActiveTab;
