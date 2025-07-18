import React, { createContext, useState, useEffect, useContext } from "react";

// create AuthContext object
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //

  // Mock login/logout functions for now.
  // We will replace this with Supabase auth later.
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const value = { user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
