// useAuth.js
import { create } from "zustand";
import api from "../utils/api";

const useAuth = create((set) => ({
  isLoggedIn: true,
  user: null,
  login: async (token) => {
    try {
      localStorage.setItem("authToken", token);
      const response = await api.get("/auth/self"); 
      set({ isLoggedIn: true, user: response.data.data });
    } catch (error) {
      console.error("Failed to log in:", error);
      set({ isLoggedIn: false, user: null });
    }
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuth;