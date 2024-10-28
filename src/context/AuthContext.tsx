import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/User';
import * as api from '../api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadAuthState = () => {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        try {
          const auth = JSON.parse(savedAuth);
          if (auth.user && auth.token) {
            setAuthState({
              user: auth.user,
              token: auth.token,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid stored auth data');
          }
        } catch (error) {
          console.error('Error loading auth state:', error);
          localStorage.removeItem('auth');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  const handleAuthError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    setAuthState(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
    }));
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await api.login(email, password);
      const auth = { user, token };
      localStorage.setItem('auth', JSON.stringify(auth));
      setAuthState({ user, token, isLoading: false, error: null });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await api.register(email, password);
      const auth = { user, token };
      localStorage.setItem('auth', JSON.stringify(auth));
      setAuthState({ user, token, isLoading: false, error: null });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuthState({ user: null, token: null, isLoading: false, error: null });
  };

  const value = {
    ...authState,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}