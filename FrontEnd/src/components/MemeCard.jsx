import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Heart, User, Clock } from 'lucide-react';

const MemeCard = ({ meme }) => {
  const { user, likeMeme, isDarkMode } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(meme.likes || 0);

  // ✅ Determine if current user has already liked
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?.id;
  // console.log(currentUserId)
const [hasLiked, setHasLiked] = useState(() =>
  meme.likesArray.some(user => user._id === currentUserId)
);
  // console.log(hasLiked)

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    setLikeAnimation(true);

    const originalLikes = currentLikes;
    const originalLiked = hasLiked;

    try {
      // Optimistic update
      
      setCurrentLikes(prev => originalLiked ? prev - 1 : prev + 1);
      setHasLiked(!originalLiked);

      // Call backend to like/unlike
      const updatedLikes = await likeMeme(meme._id);
      if (typeof updatedLikes === 'number') {
        setCurrentLikes(updatedLikes);
      }
    } catch (error) {
      console.error('Error liking meme:', error);
      setCurrentLikes(originalLikes);
      setHasLiked(originalLiked);
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
      setTimeout(() => setLikeAnimation(false), 600);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div
      className={`group rounded-lg overflow-hidden max-w-50 mx-auto text-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-1 ${
        isDarkMode
          ? 'bg-gray-700 shadow-md shadow-gray-900/40 hover:shadow-xl hover:shadow-purple-500/20'
          : 'bg-white shadow-md shadow-gray-200/40 hover:shadow-xl hover:shadow-blue-500/20'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] p-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-6 h-6 border-2 rounded-full animate-spin ${
                isDarkMode
                  ? 'border-purple-600 border-t-transparent'
                  : 'border-blue-500 border-t-transparent'
              }`}
            />
          </div>
        )}
        <img
          src={meme.imageUrl}
          alt={meme.caption}
          className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Like ping animation */}
        {likeAnimation && hasLiked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-14 h-14 text-red-500 animate-ping" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Caption & Footer */}
      <div className="p-3">
        {meme.caption && (
          <p
            className={`text-sm mb-2 line-clamp-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {meme.caption}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span
                className={`font-medium truncate ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {meme.uploader}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTimeAgo(meme.createdAt)}
              </span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            title={!user ? 'Please login to like memes' : hasLiked ? 'Unlike this meme' : 'Like this meme'}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isLiking ? 'animate-pulse' : ''}`}
              fill={hasLiked ? 'red' : 'none'}
              stroke={hasLiked ? 'red' : (isDarkMode ? '#D1D5DB' : '#4B5563')}
            />
            <span className="text-sm font-medium">{currentLikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
