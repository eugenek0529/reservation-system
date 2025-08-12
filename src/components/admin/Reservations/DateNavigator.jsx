import React from 'react';

function formatDaily(d) {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
function formatYear(d) {
  return d.getFullYear();
}
function formatMonthly(d) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function DateNavigator({ viewMode = 'daily', date = new Date(), onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={onPrev} className="p-2 hover:bg-gray-100 rounded" aria-label="Previous">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {viewMode === 'daily' ? (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">{formatDaily(date)}</div>
          <div className="text-sm text-gray-500">{formatYear(date)}</div>
        </div>
      ) : (
        <div className="text-lg font-semibold text-gray-800">{formatMonthly(date)}</div>
      )}

      <button onClick={onNext} className="p-2 hover:bg-gray-100 rounded" aria-label="Next">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}