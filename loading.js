// components/Loading.js
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      
      {/* Text */}
      <p className="text-lg font-semibold text-gray-700">
        Loading orders, please wait...
      </p>
      
      {/* Dots animation */}
      <div className="flex space-x-1">
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}
