import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabaseClient";

// 1. create the context
const AuthContext = createContext(null);

// 2. provide the context to the app
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Helper function to get user role from JWT
  const getUserRole = (session) => {
    if (!session?.user) return null;

    // Check if user has admin role in JWT claims
    const userRole =
      session.user.user_metadata?.role || session.user.app_metadata?.role;

    // If no role is set, default to 'user'
    return userRole || "user";
  };

  // 3. fetch session and subscribe to auth state changes
  useEffect(() => {
    const getSessionAndInsertProfile = async () => {
      const { data, error } = await supabase.auth.getSession();
      const currentSession = data?.session || null;
      setSession(currentSession);

      // Set user role
      const role = getUserRole(currentSession);
      setUserRole(role);

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
      const role = getUserRole(session);
      setUserRole(role);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phone,
        },
      },
    });

    if (data.user) {
      await supabase.from("user_profiles").insert({
        id: data.user.id,
        name,
        email,
        phone,
      });
    }

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
    console.log("Signing in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error);
      throw error;
    }

    // Get the role after successful login
    const role = getUserRole(data.session);
    setUserRole(role);

    console.log(`Sign in successful:`, data);
    return { data, role };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
    setSession(null);
    setUserRole(null);
    console.log("Sign out successful");
  };

  // 4. provide the session, loading state, and user role to children
  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        userRole,
        signUp,
        signIn,
        signOut,
        signInWithOAuth,
      }}
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
