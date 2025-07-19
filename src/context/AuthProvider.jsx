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
    const getSessionAndInsertProfile = async () => {
      const { data, error } = await supabase.auth.getSession();
      // setSession(data?.session || null); // This wont re-render the component
      const currentSession = data?.session || null; // this will re-render the component
      setSession(currentSession);
      setLoading(false);
      if (error) {
        console.error("Error fetching session from AuthContext:", error);
        return;
      }

      if (currentSession?.user) {
        const user = currentSession.user;
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profileData) {
          // If no profile exists, create one
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              name: user.user_metadata.full_name || "",
              email: user.email,
              phone: "",
            });
          if (insertError) {
            console.error("Error creating user profile:", insertError);
            throw insertError;
          } else {
            console.log("User profile inserted or already exists.");
          }
        }
      }
    };

    getSessionAndInsertProfile();

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
    const { data, error } = await supabase.auth.signUp({ email, password });
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
    // check if the user data is in the user_profiles table

    if (data?.session?.user) {
      const { user } = data.session;
      console.log(user_metadata, "User metadata:", user.user_metadata);
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      if (!profileData) {
        // If no profile exists, create one
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            id: user.id,
            name: user.user_metadata.full_name || "",
            email: user.email,
            phone: "",
          });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          throw insertError;
        }
      }
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
