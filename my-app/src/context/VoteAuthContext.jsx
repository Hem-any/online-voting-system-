/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { login as loginApi, logout as logoutApi } from "../Api/authApi";

const VoteAuthContext = createContext(null);

export function VoteAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("voteUser");

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("voteUser");
        localStorage.removeItem("token");
      }
    }

    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const payload = await loginApi(email, password);
      const loggedInUser = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <VoteAuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </VoteAuthContext.Provider>
  );
}

export function useVoteAuth() {
  const context = useContext(VoteAuthContext);

  if (!context) {
    throw new Error(
      "useVoteAuth must be used inside VoteAuthProvider"
    );
  }

  return context;
} 
