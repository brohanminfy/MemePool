import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from './Header';
import MemeFeed from './MemeFeed';
import UploadModal from './UploadModal';
import ProfilePage from './ProfilePage';

const MainApp = () => {
  const { isDarkMode } = useAppContext();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Header 
        onUpload={() => setIsUploadModalOpen(true)} 
        onProfileClick={() => setShowProfile(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemeFeed />
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

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

export default MainApp;