import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabaseClient";

// 1. create the context
const AuthContext = createContext(null);

// 2. provide the context to the app
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. fetch session and subscribe to auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data?.session || null);
      setLoading(false);
      if (error) {
        console.error("Error fetching session from AuthContext:", error);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signup({ email, password });
    if (error) {
      console.error("Error signing up:", error);
      throw error;
    }
    console.log(`Sign up successful:`, data);
    return data;
  };

  const signInWithOAuth = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("Error signing up with Google:", error);
      throw error;
    }
    console.log(`Sign up with Google successful:`, data);
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error);
      throw error;
    }
    console.log(`Sign in successful:`, data);
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
    setSession(null);
    console.log("Sign out successful");
  };

  // 4. provide the session and loading state to children
  return (
    <AuthContext.Provider
      value={{ session, loading, signUp, signIn, signOut, signInWithOAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
