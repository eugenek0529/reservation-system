import React, { useState } from "react";
import LandingHeader from "../components/Landing-Header";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { signUp, signInWithOAuth } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithOAuth(); // this redirects to Google
    } catch (error) {
      console.error("Google Sign In error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signUp(email, password, name, phone);
      if (user) {
        await supabase.from("user_profiles").insert({
          id: user.id,
          name,
          phone,
        });
      }
      console.log("Sign Up successful:", user);
      // Redirect to the home page or show a success message
      navigate("/");
    } catch (error) {
      console.error("Sign Up error:", error.message);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <>
      <LandingHeader />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-md">
          <h2 className="text-2xl text-center mb-2">Create your account</h2>
          <p className="text-gray-600 text-center mb-6">
            Sign up to book your reservation
          </p>
          {/* Continue with Google Button */}
          <button
            onClick={handleGoogleSignUp}
            className="inline-flex mb-4 h-10 w-full items-center cursor-pointer justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-[18px] w-[18px] "
            />
            Continue with Google
          </button>

          {/* divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink-0 text-sm text-gray-500">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 bg-gray-100 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1 text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 bg-gray-100 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                placeholder="Enter your phone number"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 bg-gray-100 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 bg-gray-100 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-1 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 bg-gray-100 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 cursor-pointer text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
