import React, { useState } from "react";
import LandingHeader from "../components/Landing-Header";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signInWithOAuth, signIn } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming you have a signIn function in your AuthProvider
      const { data, userRole } = await signIn(email, password);
      console.log("Login successful");
      // Redirect to home page or show a success message
      navigate(userRole === "admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle error (e.g., show a notification)
    }
  };

  const handleGoogleSignIn = async () => {
    e.preventdefult();
    try {
      const { data, userRole } = await signInWithOAuth();
      console.log("Google Sign In successful");
      // Redirect to home page or show a success message
      navigate(userRole === "admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Google Sign In error:", error.message);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <>
      <LandingHeader />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-md">
          <h2 className="text-2xl text-center mb-2">Welcome back</h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your account to continue
          </p>
          {/* Continue with Google Button */}
          <button
            onClick={handleGoogleSignIn}
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
          <form onSubmit={handleLoginSubmit}>
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
              />
            </div>
            <div className="mb-6">
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 cursor-pointer text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-gray-600 hover:underline text-sm">
              Forgot your password?
            </a>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
