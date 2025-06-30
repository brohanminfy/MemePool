import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Smile, ArrowRight, Star, Users, Share2 } from 'lucide-react';

const LandingPage = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-400'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-pink-600' : 'bg-pink-400'
        } blur-3xl animate-pulse`}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
            }`}>
              <Smile className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              MemeShare
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Spread Smile <span className={`${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>Happy Memeing</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link
                to="/signup"
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                }`}
              >
                <span>Join</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;