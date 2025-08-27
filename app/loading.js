// app/admin/loading.js
"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>

      {/* Text */}
      <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
        Loading, please wait...
      </p>

      {/* Optional dots animation */}
      <div className="flex space-x-1 mt-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
      </div>

    </div>
  );
}
