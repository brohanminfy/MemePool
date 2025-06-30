import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from './Header';

const Layout = ({ children }) => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/6 w-32 h-32 rounded-full opacity-10 blur-3xl animate-pulse ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/6 w-40 h-40 rounded-full opacity-10 blur-3xl animate-pulse ${
          isDarkMode ? 'bg-pink-600' : 'bg-purple-400'
        }`}></div>
      </div>
    </div>
  );
};

export default Layout;