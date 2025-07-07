import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMemes, setHasMoreMemes] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme and check for existing session
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch memes when user logs in
  useEffect(() => {
    if (user && memes.length === 0) {
      fetchMemes(1, 12, false); // Initial load, not load more
    }
  }, [user]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Invalid JWT Token", e);
      return {};
    }
  }

  const login = async (email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return { success: false, message: data.error || 'Login failed' };
      }

      const token = data.token;
      const userInfo = parseJwt(token);

      const newUser = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
        createdAt: new Date()
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };

    } catch (err) {
      console.error('Login error:', err.message);
      setIsLoading(false);
      return { success: false, message: err.message || 'Something went wrong' }; 
    }
  };

    const signup = async (username, email, password) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            password,
            confirmpassword: password
          })
        });

        const data = await res.json();
        console.log(data)
        if (!res.ok) {
          return { success: false, message: data.error || 'Signup failed' };
        }

        const token = data.token;
        const userInfo = parseJwt(token);

        const newUser = {
          id: userInfo.id,
          username: userInfo.username || username,
          email: userInfo.email,
          avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
          createdAt: new Date()
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));

        setUser(newUser);

        return { success: true };
      } catch (err) {
        console.error('Signup error:', err.message);
        return { success: false, message: err.message || 'Something went wrong' };
      }
    };

  const logout = () => {
    setUser(null);
    setMemes([]);
    setCurrentPage(1);
    setHasMoreMemes(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addMeme = (memeData) => {
    if (!user) return;
    
    const newMeme = {
      ...memeData,
      id: Date.now().toString(),
      uploaderId: user.id,
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
    };
    // Don't add to memes array since we filter out user's own memes from feed
  };

  const updateMeme = (memeId, updates) => {
    if (!user) return;
    
    setMemes(prev => prev.map(meme => {
      if (meme.id === memeId && meme.uploaderId === user.id) {
        return { ...meme, ...updates };
      }
      return meme;
    }));
  };

  const deleteMeme = async (memeId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/delete/${memeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Frontend state update
        setMemes(prev => prev.filter(meme => meme.id !== memeId));
      } else {
        console.error(data.error || data.Message);
      }
    } catch (err) {
      console.error("Error deleting meme:", err);
    }
  };

  const likeMeme = async (memeId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/likes/${memeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to like/unlike meme');

      // Update likes count in state
      setMemes(prev =>
        prev.map(meme =>
          meme._id === memeId
            ? { ...meme, likes: data.totalLikes }
            : meme
        )
      );

      // Return the updated likes count for optimistic updates
      return data.totalLikes;
    } catch (err) {
      console.error("Like/unlike failed:", err.message);
      throw err;
    }
  };

  const getUserMemes = (userId) => {
    return memes.filter(meme => meme.uploaderId === userId);
  };

  // Helper function to remove duplicates based on _id
  const removeDuplicateMemes = (memesArray) => {
    const seen = new Set();
    return memesArray.filter(meme => {
      const memeId = meme._id || meme.id;
      if (seen.has(memeId)) {
        return false;
      }
      seen.add(memeId);
      return true;
    });
  };

  // FIXED: fetchMemes function with proper pagination
  const fetchMemes = async (page = 1, limit = 10, isLoadMore = false) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/meme/getmeme`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page,
          limit
        }
      });

      const rawMemes = response.data.data || [];
      const totalMemes = response.data.total || rawMemes.length;
      const totalPages = response.data.totalPages || Math.ceil(totalMemes / limit);
      
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        imageUrl: meme.meme?.[0] || '',
        caption: meme.caption || '',
        uploader: meme.author?.username || 'Unknown',
        uploaderId: meme.author?._id || '',
        likes: Array.isArray(meme.likes) ? meme.likes.length : 0,
        likesArray: meme.likes,
        createdAt: meme.createdAt
      }));

      // Filter out current user's memes from the feed
      const filteredMemes = user 
        ? processedMemes.filter(meme => meme.uploaderId !== user.id)
        : processedMemes;
      // Only update state if this is the initial load (page 1)
      // For pagination, let loadMoreMemes handle the state update
      if (page === 1 && !isLoadMore) {
        setMemes(filteredMemes);
        setCurrentPage(1);
        setHasMoreMemes(page < totalPages);
      }

      return {
        memes: filteredMemes,
        hasMore: page < totalPages,
        totalPages,
        currentPage: page
      };
    } catch (err) {
      console.error('❌ Failed to fetch memes:', err);
      return { memes: [], hasMore: false, totalPages: 1, currentPage: page };
    }
  };

  // Separate function to fetch user's own memes for profile page
  const fetchUserMemes = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/meme/getmeme`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawMemes = response.data.data;
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        id: meme._id,
        imageUrl: meme.meme?.[0] || '',
        caption: meme.caption || '',
        uploader: meme.author?.username || 'Unknown',
        uploaderId: meme.author?._id || '',
        likes: Array.isArray(meme.likes) ? meme.likes.length : 0,
        createdAt: meme.createdAt
      }));

      // Return only current user's memes
      return processedMemes.filter(meme => meme.uploaderId === userId);
    } catch (err) {
      console.error('Failed to fetch user memes:', err);
      return [];
    }
  };

  // FIXED: loadMoreMemes function with duplicate prevention and better debugging
  const loadMoreMemes = async () => {

    if (isLoadingMore || !hasMoreMemes) {
      return;
    }
    
    setIsLoadingMore(true);    
    try {
      const nextPage = currentPage + 1;
      
      const result = await fetchMemes(nextPage);
      
      // Merge new memes with existing ones and remove duplicates
      setMemes(prev => {
        const combined = [...prev, ...result.memes];
        const deduplicated = removeDuplicateMemes(combined);
        return deduplicated;
      });
      
      setCurrentPage(nextPage);
      setHasMoreMemes(result.hasMore);
      
    } catch (error) {
      console.error('❌ Error loading more memes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      memes,
      addMeme,
      updateMeme,
      deleteMeme,
      likeMeme,
      isDarkMode,
      toggleTheme,
      loadMoreMemes,
      hasMoreMemes,
      isLoadingMore,
      login,
      signup,
      logout,
      getUserMemes,
      fetchMemes,
      fetchUserMemes
    }}>
      {children}
    </AppContext.Provider>
  );
};