import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  createUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  onAuthStateChange,
  resetPassword,
  getUserData,
  updateUserData,
} from '@/services/firebase.service';

interface AuthContextType {
  currentUser: User | null;
  userData: any;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const user = await createUser(email, password, displayName);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  const resetUserPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (data: any) => {
    if (currentUser) {
      try {
        await updateUserData(currentUser.uid, data);
        const updatedData = await getUserData(currentUser.uid);
        setUserData(updatedData);
      } catch (error) {
        throw error;
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetUserPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
