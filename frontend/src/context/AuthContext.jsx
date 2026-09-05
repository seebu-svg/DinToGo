import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('dintogo_token'));
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data);
    } catch {
      sessionStorage.removeItem('dintogo_token');
      sessionStorage.removeItem('dintogo_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      sessionStorage.setItem('dintogo_token', data.token);
      sessionStorage.setItem('dintogo_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await authAPI.register(formData);
      sessionStorage.setItem('dintogo_token', data.token);
      sessionStorage.setItem('dintogo_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // silent
    }
    sessionStorage.removeItem('dintogo_token');
    sessionStorage.removeItem('dintogo_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out.');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateMe(data);
      setUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const isAuthenticated = !!user && !!token;
  const isRestaurant = user?.role === 'restaurant';
  const isCreator = !!user?.influencerData; // Users who've built audience & trust
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isRestaurant,
        isCreator,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
