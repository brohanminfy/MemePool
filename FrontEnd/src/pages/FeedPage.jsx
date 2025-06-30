import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeFeed from '../components/MemeFeed';

const FeedPage = () => {
  const { fetchMemes } = useAppContext();

  useEffect(() => {
    fetchMemes();
  }, []);

  return <MemeFeed />;
};

export default FeedPage;