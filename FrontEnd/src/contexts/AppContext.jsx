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
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/verify/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Extract token and set user info from token or backend if returned
      const token = data.token;
      const userInfo = parseJwt(token); // Optional: decode JWT to get user data

      const newUser = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
        createdAt: new Date()
      };

      localStorage.setItem('token', token);         // Store JWT
      localStorage.setItem('user', JSON.stringify(newUser)); // Store user info

      setUser(newUser);
      setIsLoading(false);
      return true;

    } catch (err) {
      console.error('Login error:', err.message);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/verify/signup', {
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
      
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      const token = data.token;
      const userInfo = parseJwt(token); // Decode token

      const newUser = {
        id: userInfo.id,
        username: userInfo.username || username,
        email: userInfo.email,
        avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
        createdAt: new Date()
      };

      localStorage.setItem('token', token); // store JWT
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      setIsLoading(false);
      return true;

    } catch (err) {
      console.error('Signup error:', err.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setMemes([]);
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
    // setMemes(prev => [newMeme, ...prev]);
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

  const deleteMeme = (memeId) => {
    if (!user) return;
    
    setMemes(prev => prev.filter(meme => 
      !(meme.id === memeId && meme.uploaderId === user.id)
    ));
  };

  const likeMeme = async (memeId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/meme/likes/${memeId}`, {
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
      throw err; // Re-throw to handle in component
    }
  };

  const getUserMemes = (userId) => {
    // For profile page, we need to fetch user's own memes separately
    // This function will be used in ProfilePage to show user's own memes
    return memes.filter(meme => meme.uploaderId === userId);
  };

  const fetchMemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/meme/getmeme', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawMemes = response.data.data;
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        imageUrl: meme.meme?.[0] || '',
        caption: meme.caption || '',
        uploader: meme.author?.username || 'Unknown',
        uploaderId: meme.author?._id || '',
        likes: Array.isArray(meme.likes) ? meme.likes.length : 0,
        createdAt: meme.createdAt
      }));

      // Filter out current user's memes from the feed
      const filteredMemes = user 
        ? processedMemes.filter(meme => meme.uploaderId !== user.id)
        : processedMemes;

      setMemes(filteredMemes);
    } catch (err) {
      console.error('Failed to fetch memes:', err);
    }
  };

  // Separate function to fetch user's own memes for profile page
  const fetchUserMemes = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/meme/getmeme', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawMemes = response.data.data;
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        id: meme._id, // Add id for compatibility
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

  const loadMoreMemes = async () => {
    if (isLoadingMore || !hasMoreMemes) return;
    
    const nextPage = currentPage + 1;
    const { memes: newMemes, hasMore } = await fetchMemes(nextPage);
    
    setMemes(prev => [...prev, ...newMemes]);
    setCurrentPage(nextPage);
    setHasMoreMemes(hasMore);
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