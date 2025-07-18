import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full border-b border-gray-200 px-10 py-2 flex justify-between items-center">
      <Link to="/">
        <div className="flex items-center space-x-4">
          <div className="text-l font-bold">Sushi Yuen</div>
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/signup">
          <button className="bg-blue-600 text-white px-6 py-1 rounded-md hover:bg-blue-700 cursor-pointer">
            Sign up
          </button>
        </Link>
        <Link to="/login">
          <button className="text-gray-700 px-6 py-1 rounded-md hover:bg-gray-100 cursor-pointer border border-gray-300 font-medium">
            Log in
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
