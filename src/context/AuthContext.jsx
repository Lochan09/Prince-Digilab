import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut,
} from 'firebase/auth';
import { auth, gProvider } from '../firebase';

const Ctx = createContext(null);

const IS_PROD = window.location.hostname !== 'localhost';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    // Pick up redirect result if coming back from Google sign-in
    getRedirectResult(auth).catch(() => {});
    return onAuthStateChanged(auth, setUser);
  }, []);

  function signIn() {
    if (IS_PROD) {
      return signInWithRedirect(auth, gProvider);
    }
    return signInWithPopup(auth, gProvider);
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
