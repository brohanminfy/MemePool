import React, { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeCard from './MemeCard';
import { ImageIcon } from 'lucide-react';

const MemeFeed = () => {
  const { 
    memes, 
    isDarkMode, 
    loadMoreMemes, 
    hasMoreMemes, 
    isLoadingMore, 
    user,
    fetchMemes 
  } = useAppContext();
  
  const observerRef = useRef();
  const isInitialLoadRef = useRef(false);

  // Initial load effect - fetch memes when component mounts and user is available
  useEffect(() => {
    if (user && memes.length === 0 && !isInitialLoadRef.current) {
      isInitialLoadRef.current = true;
      fetchMemes(1);
    }
  }, [user, fetchMemes]);

  // Reset initial load flag when user changes
  useEffect(() => {
    if (!user) {
      isInitialLoadRef.current = false;
    }
  }, [user]);

  // Intersection Observer for infinite scroll
  const lastMemeElementRef = useCallback((node) => {
    // Don't set up observer if we're loading or there are no more memes
    if (isLoadingMore || !hasMoreMemes) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreMemes && !isLoadingMore) {
        loadMoreMemes();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px' // Trigger a bit earlier
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoadingMore, hasMoreMemes, loadMoreMemes, memes.length]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Please log in</h3>
        <p className="text-center max-w-md">
          You need to be logged in to view the meme feed.
        </p>
      </div>
    );
  }

  // Show loading state for initial load
  if (memes.length === 0 && isLoadingMore) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className={`w-8 h-8 border-2 rounded-full animate-spin mb-4 ${
          isDarkMode 
            ? 'border-purple-600 border-t-transparent' 
            : 'border-blue-500 border-t-transparent'
        }`}></div>
        <h3 className="text-xl font-semibold mb-2">Loading memes...</h3>
        <p className="text-center max-w-md">
          Fetching the latest memes for you!
        </p>
      </div>
    );
  }

  // Show empty state if no memes and not loading
  if (memes.length === 0 && !isLoadingMore) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No memes to show!</h3>
        <p className="text-center max-w-md">
          There are no memes from other users yet. Check back later or encourage others to share their memes!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Memes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.map((meme, index) => {
          const isLastItem = index === memes.length - 1;
          
          return (
            <div
              key={meme._id || meme.id}
              ref={isLastItem && hasMoreMemes ? lastMemeElementRef : null}
              className="relative"
            >
              <MemeCard meme={meme} />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 border-2 rounded-full animate-spin ${
              isDarkMode 
                ? 'border-purple-600 border-t-transparent' 
                : 'border-blue-500 border-t-transparent'
            }`}></div>
            <span className={`text-sm font-medium transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Loading more memes...
            </span>
          </div>
        </div>
      )}

      {/* End of content indicator */}
      {!hasMoreMemes && memes.length > 0 && (
        <div className={`text-center py-8 transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm">🎉 You've seen all the community memes!</p>
          <p className="text-xs mt-1">Upload your own memes to contribute to the community!</p>
        </div>
      )}
    </div>
  );
};

export default MemeFeed;