import { create } from "zustand";

const useAuth = create((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user: user }),
  logout: () => set({ isLoggedIn: false, user: null, email: "" }),
}));

export default useAuth;
