import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut,
} from 'firebase/auth';
import { auth, gProvider } from '../firebase';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
    return onAuthStateChanged(auth, setUser);
  }, []);

  async function signIn() {
    try {
      await signInWithPopup(auth, gProvider);
    } catch (err) {
      // Popup was blocked by the browser — fall back to redirect
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user') {
        return signInWithRedirect(auth, gProvider);
      }
      throw err;
    }
  }

  return (
    <Ctx.Provider value={{
      user,
      loading: user === undefined,
      signIn,
      signOut: () => signOut(auth),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
