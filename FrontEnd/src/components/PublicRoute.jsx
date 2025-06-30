import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import LoadingScreen from './LoadingScreen';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users to feed
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default PublicRoute;