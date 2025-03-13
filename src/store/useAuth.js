// useAuth.js
import { create } from "zustand";
import api from "../utils/api";

// useAuth.js - modify the initial state
const useAuth = create((set) => ({
  isLoggedIn: false, // Start with logged out state
  user: null,
  isLoading: false, // Add a loading state
  login: async (token) => {
    try {
      set({ isLoading: true });
      localStorage.setItem("authToken", token);
      const response = await api.get("/auth/self"); 
      set({ isLoggedIn: true, user: response.data.data, isLoading: false });
      return true; // Return success
    } catch (error) {
      console.error("Failed to log in:", error);
      set({ isLoggedIn: false, user: null, isLoading: false });
      return false; // Return failure
    }
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuth;