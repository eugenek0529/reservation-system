import React, { useState } from "react";
import LandingHeader from "../components/Landing-Header";
import { useAuth } from "../context/AuthProvider";

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signUp, signInWithOAuth } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithOAuth(); // this redirects to Google
    } catch (error) {
      console.error("Google Sign In error:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
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
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 cursor-pointer rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.0003 4.75C14.0537 4.75 15.8285 5.48512 17.2016 6.74109L20.1712 3.79979C18.0674 1.95408 15.2212 0.75 12.0003 0.75C7.29177 0.75 3.19472 3.42938 1.15783 7.57521L4.77093 10.3015C5.75336 8.39871 8.65342 6.75 12.0003 6.75C13.6823 6.75 15.2536 7.29976 16.5168 8.2801L19.4864 5.3388C18.0674 4.19548 16.2927 3.475 14.3339 3.475C13.2057 3.475 12.1284 3.6559 11.1352 3.99351C9.69741 4.54228 8.3533 5.40938 7.25316 6.54922L3.63999 3.82283C4.94589 1.48895 8.26189 0.75 12.0003 0.75ZM1.15783 7.57521C3.19472 3.42938 7.29177 0.75 12.0003 0.75C15.2212 0.75 18.0674 1.95408 20.1712 3.79979L17.2016 6.74109C15.8285 5.48512 14.0537 4.75 12.0003 4.75C8.65342 4.75 5.75336 6.39871 4.77093 8.3015L1.15783 7.57521ZM12.0003 6.75C10.3183 6.75 8.74704 7.29976 7.48378 8.2801L4.51416 5.3388C5.93291 4.19548 7.70768 3.475 9.66649 3.475C10.7947 3.475 11.872 3.6559 12.8652 3.99351C14.3029 4.54228 15.647 5.40938 16.7472 6.54922L20.3603 3.82283C19.0544 1.48895 15.7384 0.75 12.0003 0.75Z" />
            </svg>
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
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
