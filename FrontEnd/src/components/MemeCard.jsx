import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Heart, User, Clock } from 'lucide-react';

const MemeCard = ({ meme }) => {
  const { user, likeMeme, isDarkMode } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(meme.likes || 0);
  const [hasLiked, setHasLiked] = useState(false); // You can set this from backend initially

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    setLikeAnimation(true);

    const originalLikes = currentLikes;
    const wasLiked = hasLiked;

    try {
      // Optimistic toggle update
      setCurrentLikes(prev => wasLiked ? prev - 1 : prev + 1);
      setHasLiked(!wasLiked);

      // Backend toggle handler
      const updatedLikes = await likeMeme(meme._id);
      if (typeof updatedLikes === 'number') {
        setCurrentLikes(updatedLikes);
      }
    } catch (error) {
      console.error('Like error:', error);
      setCurrentLikes(originalLikes);
      setHasLiked(wasLiked);
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
      setTimeout(() => setLikeAnimation(false), 600);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // ms to minutes

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div
      className={`group rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
        isDarkMode
          ? 'bg-gray-700 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/20'
          : 'bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/20'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-8 h-8 border-2 rounded-full animate-spin ${
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

        {/* Heart Ping Animation */}
        {likeAnimation && hasLiked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-16 h-16 text-red-500 animate-ping" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Caption & Footer */}
      <div className="p-4">
        {meme.caption && (
          <p
            className={`text-sm mb-3 line-clamp-2 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {meme.caption}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
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

          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            title={!user ? 'Please login to like memes' : 'Like this meme'}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiking ? 'animate-pulse' : ''
              } ${hasLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="font-medium">{currentLikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
