import React, { createContext, useContext, useState, useEffect } from 'react';

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
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
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

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (email && password.length >= 6) {
      const newUser = {
        id: Date.now().toString(),
        username: email.split('@')[0],
        email,
        avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (username && email && password.length >= 6) {
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
    setMemes(prev => [newMeme, ...prev]);
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

  const likeMeme = (memeId) => {
    if (!user) return;
    
    setMemes(prev => prev.map(meme => {
      if (meme.id === memeId) {
        const hasLiked = meme.likedBy.includes(user.username);
        return {
          ...meme,
          likes: hasLiked ? meme.likes - 1 : meme.likes + 1,
          likedBy: hasLiked 
            ? meme.likedBy.filter(username => username !== user.username)
            : [...meme.likedBy, user.username]
        };
      }
      return meme;
    }));
  };

  const getUserMemes = (userId) => {
    return memes.filter(meme => meme.uploaderId === userId);
  };

  // Simulate fetching memes from backend with pagination
  const fetchMemes = async (page = 1) => {
    setIsLoadingMore(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const memesPerPage = 15;
    const startIndex = (page - 1) * memesPerPage;
    
    const sampleImages = [
      'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];

    const sampleCaptions = [
      'When you finally understand React hooks',
      'Me debugging at 3 AM',
      'When your code works on the first try',
      'Trying to explain programming to non-programmers',
      'When you find the bug after 3 hours',
      'Me after deploying to production',
      'When someone asks if you tested your code',
      'Reviewing code written 6 months ago',
      'When the client changes requirements again',
      'Me pretending to understand the legacy code'
    ];

    const sampleUsers = ['DevCat', 'NightOwl', 'LuckyDev', 'CodeNinja', 'BugHunter'];

    const newMemes = Array.from({ length: memesPerPage }, (_, index) => {
      const globalIndex = startIndex + index;
      return {
        id: `sample-${globalIndex}`,
        imageUrl: sampleImages[globalIndex % sampleImages.length],
        caption: sampleCaptions[globalIndex % sampleCaptions.length],
        uploader: sampleUsers[globalIndex % sampleUsers.length],
        uploaderId: `user-${globalIndex % sampleUsers.length}`,
        likes: Math.floor(Math.random() * 200),
        likedBy: [],
        createdAt: new Date(Date.now() - (globalIndex * 1000 * 60 * Math.random() * 60))
      };
    });

    const totalMemes = 60;
    const hasMore = startIndex + memesPerPage < totalMemes;

    setIsLoadingMore(false);
    return { memes: newMemes, hasMore };
  };

  const loadMoreMemes = async () => {
    if (isLoadingMore || !hasMoreMemes) return;
    
    const nextPage = currentPage + 1;
    const { memes: newMemes, hasMore } = await fetchMemes(nextPage);
    
    setMemes(prev => [...prev, ...newMemes]);
    setCurrentPage(nextPage);
    setHasMoreMemes(hasMore);
  };

  // Initial load of memes
  useEffect(() => {
    if (memes.length === 0 && !isLoading) {
      const loadInitialMemes = async () => {
        const { memes: initialMemes, hasMore } = await fetchMemes(1);
        setMemes(initialMemes);
        setHasMoreMemes(hasMore);
      };
      loadInitialMemes();
    }
  }, [memes.length, isLoading]);

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
      getUserMemes
    }}>
      {children}
    </AppContext.Provider>
  );
};