import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const createdUser = userCredential.user;

    // Update display name if provided
    if (displayName.trim()) {
      await updateProfile(createdUser, { displayName: displayName.trim() });
    }

    // Automatically send verification email
    try {
      await sendEmailVerification(createdUser);
    } catch (err) {
      console.warn('Initial verification email dispatch warning:', err);
    }

    // Update local state copy with profile info
    setUser({ ...createdUser, displayName: displayName.trim() } as User);
    return createdUser;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<UserCredential> => {
    return await signInWithPopup(auth, googleProvider);
  }, []);

  const sendVerificationEmail = useCallback(async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    await sendEmailVerification(auth.currentUser);
  }, []);

  const reloadUser = useCallback(async (): Promise<User | null> => {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    const updated = auth.currentUser;
    // Force React re-render by setting a cloned user reference
    setUser(updated ? Object.assign(Object.create(Object.getPrototypeOf(updated)), updated) : null);
    return updated;
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const updateUserProfile = useCallback(async (displayName: string, photoURL?: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    await updateProfile(auth.currentUser, {
      displayName: displayName.trim(),
      photoURL: photoURL || auth.currentUser.photoURL,
    });
    await reloadUser();
  }, [reloadUser]);

  const updateUserPassword = useCallback(async (newPassword: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    await updatePassword(auth.currentUser, newPassword);
  }, []);

  const signOutUser = useCallback(async (): Promise<void> => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      sendVerificationEmail,
      reloadUser,
      resetPassword,
      updateUserProfile,
      updateUserPassword,
      signOutUser,
    }),
    [
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      sendVerificationEmail,
      reloadUser,
      resetPassword,
      updateUserProfile,
      updateUserPassword,
      signOutUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
