import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Heart, User, Clock } from 'lucide-react';

const MemeCard = ({ meme }) => {
  const { user, likeMeme, isDarkMode } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = () => {
    if (!user) return;
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 600);
    likeMeme(meme._id);
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`h-full group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col ${
      isDarkMode
        ? 'bg-gray-800 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/20'
        : 'bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/20'
    }`}>
      {/* Image Container */}
      <div className="relative flex-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
              isDarkMode ? 'border-purple-600 border-t-transparent' : 'border-blue-500 border-t-transparent'
            }`}></div>
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

        {/* Like Animation */}
        {likeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-16 h-16 text-red-500 animate-ping" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Caption & Footer */}
      <div className="p-4 flex-shrink-0">
        {meme.caption && (
          <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {meme.caption}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Uploader */}
            <div className="flex items-center space-x-1 min-w-0">
              <User className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {meme.uploader}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTimeAgo(meme.createdAt)}
              </span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{meme.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
