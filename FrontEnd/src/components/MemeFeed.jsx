import React, { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeCard from './MemeCard';
import { ImageIcon } from 'lucide-react';

const MemeFeed = () => {
  const { memes, isDarkMode, loadMoreMemes, hasMoreMemes, isLoadingMore, user } = useAppContext();
  const observerRef = useRef();
  const loadingTriggerRef = useRef();

  // Intersection Observer for infinite scroll
  const lastMemeElementRef = useCallback((node) => {
    if (isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreMemes) {
        loadMoreMemes();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMoreMemes, loadMoreMemes]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Filter out current user's memes from the feed (additional client-side filtering)
  const feedMemes = user 
    ? memes.filter(meme => meme.uploaderId !== user.id)
    : memes;

  if (feedMemes.length === 0 && !isLoadingMore) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No memes to show!</h3>
        <p className="text-center max-w-md">
          {user 
            ? "There are no memes from other users yet. Check back later or encourage others to share their memes!"
            : "Be the first to share a meme and get the fun started. Click the upload button to add your first meme!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Memes Grid - 3 columns, 40% screen height */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedMemes.map((meme, index) => {
          const isNinthMeme = (index + 1) % 15 === 9;
          
          return (
            <div
              key={meme._id || meme.id}
              ref={isNinthMeme ? lastMemeElementRef : null}
              // className="h-[40vh] min-h-[300px]"
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
      {!hasMoreMemes && feedMemes.length > 0 && (
        <div className={`text-center py-8 transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm">You've seen all the community memes! 🎉</p>
          <p className="text-xs mt-1">Upload your own memes to contribute to the community!</p>
        </div>
      )}
    </div>
  );
};

export default MemeFeed;