import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <AuthPage />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;