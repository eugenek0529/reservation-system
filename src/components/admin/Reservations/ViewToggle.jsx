import React from 'react';

export default function ViewToggle({ value = 'daily', onChange }) {
  return (
    <div className="flex justify-center">
      <div className="relative bg-gray-200 rounded-full p-1 flex items-center">
        <button
          onClick={() => onChange?.('daily')}
          className={`px-6 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            value === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Daily View
        </button>
        <button
          onClick={() => onChange?.('monthly')}
          className={`px-6 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            value === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Monthly View
        </button>
      </div>
    </div>
  );
}
