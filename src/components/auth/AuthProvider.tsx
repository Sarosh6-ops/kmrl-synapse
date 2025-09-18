"use client";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      // Firebase not configured; treat as signed-out and stop loading
      setUser(null);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInGoogle = async () => {
    if (!firebaseEnabled || !auth) throw new Error("Firebase is not configured");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
    if (!firebaseEnabled || !auth) return;
    await signOut(auth);
  };

  const signInEmail = async (email: string, password: string) => {
    if (!firebaseEnabled || !auth) throw new Error("Firebase is not configured");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (name: string, email: string, password: string) => {
    if (!firebaseEnabled || !auth) throw new Error("Firebase is not configured");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user && name) {
      await updateProfile(cred.user, { displayName: name });
    }
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signInGoogle, signOutUser, signInEmail, signUpEmail }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}