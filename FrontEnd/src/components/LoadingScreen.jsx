import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Smile } from 'lucide-react';

const LoadingScreen = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
        }`}>
          <Smile className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
            isDarkMode 
              ? 'border-purple-600 border-t-transparent' 
              : 'border-blue-500 border-t-transparent'
          }`}></div>
          <span className={`font-medium transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-gray-600'
          }`}>
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;