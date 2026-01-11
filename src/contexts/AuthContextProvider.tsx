import { useState, useEffect, useCallback, createContext, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInAdminUser } from "@/api/user";
import { clearLocalUserData, updateLocalUserData } from "@/consts/app-config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // subscribes to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) clearLocalUserData();
      setUser(user);
      setLoading(false);
    });
    // cleanup subscription
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    const adminUserData = (await signInAdminUser(idToken, uid)).data;
    updateLocalUserData(adminUserData);
    return adminUserData.displayName;
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    clearLocalUserData();
  }, []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export { AuthContext };
