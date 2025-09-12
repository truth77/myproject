import React, { createContext, useState, useEffect, useContext } from 'react';
import { postsApi, authApi } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on initial render
  useEffect(() => {
    let isMounted = true;
    let timer;
    
    const loadUser = async () => {
      // Add a small delay to prevent rapid state updates
      await new Promise(resolve => timer = setTimeout(resolve, 100));
      
      // Skip if we already know the user is not authenticated (e.g., from localStorage)
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await authApi.getCurrentUser();
        if (!isMounted) return;
        
        if (userData) {
          // Batch state updates
          const updates = {
            isAdmin: userData.role === 'admin' || userData.isAdmin === true,
            role: userData.role || 'user'
          };
          
          if (updates.isAdmin) {
            userData.isAdmin = true;
            userData.role = 'admin';
          }
          
          setUser(prev => ({
            ...prev,
            ...userData,
            ...updates
          }));
          setIsAuthenticated(true);
        } else {
          // If no user data but we had a token, clear it
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Clear invalid token on error
        if (isMounted) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auth functions
  const login = async (credentials) => {
    try {
      const userData = await authApi.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      // Check if user is admin
      const isAdmin = userData.role === 'admin' || userData.isAdmin === true;
      if (isAdmin) {
        userData.isAdmin = true;
        userData.role = 'admin';
      }
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Posts functions
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postsApi.getAll();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const newPost = await postsApi.create(postData);
      setPosts([newPost, ...posts]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const updatedPost = await postsApi.update(id, postData);
      setPosts(posts.map(post => post.id === id ? updatedPost : post));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deletePost = async (id) => {
    try {
      await postsApi.delete(id);
      setPosts(posts.filter(post => post.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        // State
        posts,
        loading,
        error,
        user,
        isAuthenticated,
        
        // Auth functions
        login,
        register,
        logout,
        
        // Post functions
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
