/*
  ⚠️ IMPORTANT — FIREBASE SETUP REQUIRED:

  For Google Sign-In to work locally, you MUST add
  these domains in Firebase Console:

  Firebase Console → Your Project → Authentication
  → Settings → Authorized domains → Add domain:

  ✅ localhost
  ✅ 127.0.0.1

  Without this, Google auth will fail with
  'auth/unauthorized-domain' error.

  For production, also add your Vercel domain:
  ✅ your-app.vercel.app
*/

// React concepts: Context API, useEffect, useState, useCallback, async/await

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const getErrorMessage = (errorCode) => {
  const messages = {
    'auth/wrong-password': 'Incorrect password.',
    'auth/user-not-found': 'No account with this email.',
    'auth/email-already-in-use': 'Email already registered. Try logging in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/popup-blocked': 'Popup blocked — allow popups for this site.',
    'auth/cancelled-popup-request': 'Another sign-in is in progress.',
    'auth/unauthorized-domain': 'Domain not authorised in Firebase Console. Add localhost and 127.0.0.1 to Authorised Domains.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/internal-error': 'Firebase internal error. Check console.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return messages[errorCode] || `Error: ${errorCode || 'unknown'}`;
};

async function upsertUserDocument(user, displayName = '') {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      displayName: displayName || user.displayName || '',
      email: user.email || '',
      createdAt: serverTimestamp(),
      totalSearches: 0,
    },
    { merge: true },
  );
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.code, error.message);
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    setAuthError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(credential.user, { displayName });
      await upsertUserDocument(credential.user, displayName);
      setCurrentUser({ ...credential.user, displayName });
      return credential;
    } catch (error) {
      console.error(error.code, error.message);
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      console.log('Current domain:', window.location.hostname);
      console.log('Auth domain from config:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

      const credential = await signInWithPopup(auth, googleProvider);
      await upsertUserDocument(credential.user, credential.user.displayName);
      return credential;
    } catch (error) {
      console.error('Google auth full error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      const googleErrorMessages = {
        'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
        'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
        'auth/cancelled-popup-request': 'Another sign-in is in progress.',
        'auth/unauthorized-domain':
          'This domain is not authorised in Firebase. Add 127.0.0.1 and localhost to Firebase Console → Authentication → Settings → Authorised domains.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/internal-error': 'Firebase internal error. Check console.',
      };
      const message = googleErrorMessages[error.code] || `Auth error: ${error.code} — ${error.message}`;
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.code, error.message);
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const updateDisplayName = useCallback(async (name) => {
    setAuthError(null);
    try {
      const trimmedName = name.trim();
      await updateProfile(auth.currentUser, { displayName: trimmedName });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { displayName: trimmedName });
      setCurrentUser({ ...auth.currentUser, displayName: trimmedName });
    } catch (error) {
      console.error(error.code, error.message);
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      signup,
      loginWithEmail: login,
      signupWithEmail: signup,
      loginWithGoogle,
      logout,
      updateDisplayName,
      authError,
    }),
    [authError, currentUser, loading, login, loginWithGoogle, logout, signup, updateDisplayName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
