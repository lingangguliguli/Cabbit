// React concepts: useCallback, useState, async/await, custom hooks

import { useCallback, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit as limitQuery,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function useFirestore(userId) {
  const { currentUser } = useAuth();
  const uid = userId || currentUser?.uid;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requireUser = useCallback(() => {
    if (!uid) throw new Error('Please log in to continue');
    return uid;
  }, [uid]);

  const runOperation = useCallback(async (operation) => {
    setLoading(true);
    setError(null);
    try {
      return await operation();
    } catch (err) {
      const message = err?.message || 'Firestore operation failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRoute = useCallback(
    async (routeData) => runOperation(async () => {
      const activeUid = requireUser();
      const routeRef = collection(db, 'users', activeUid, 'savedRoutes');
      const docRef = await addDoc(routeRef, {
        ...routeData,
        notes: routeData.notes || '',
        savedAt: serverTimestamp(),
      });
      return docRef.id;
    }),
    [requireUser, runOperation],
  );

  const getSavedRoutes = useCallback(
    async () => runOperation(async () => {
      const activeUid = requireUser();
      const routeRef = collection(db, 'users', activeUid, 'savedRoutes');
      const routeQuery = query(routeRef, orderBy('savedAt', 'desc'), limitQuery(50));
      const snapshot = await getDocs(routeQuery);
      return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    }),
    [requireUser, runOperation],
  );

  const deleteRoute = useCallback(
    async (routeId) => runOperation(async () => {
      const activeUid = requireUser();
      await deleteDoc(doc(db, 'users', activeUid, 'savedRoutes', routeId));
    }),
    [requireUser, runOperation],
  );

  const updateRouteNotes = useCallback(
    async (routeId, notes) => runOperation(async () => {
      const activeUid = requireUser();
      await updateDoc(doc(db, 'users', activeUid, 'savedRoutes', routeId), { notes });
    }),
    [requireUser, runOperation],
  );

  const saveToHistory = useCallback(
    async (searchData) => runOperation(async () => {
      const activeUid = requireUser();
      const historyRef = collection(db, 'users', activeUid, 'searchHistory');
      await addDoc(historyRef, {
        ...searchData,
        searchedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', activeUid), { totalSearches: increment(1) });

      const oldHistoryQuery = query(historyRef, orderBy('searchedAt', 'desc'), limitQuery(60));
      const snapshot = await getDocs(oldHistoryQuery);
      if (snapshot.size > 50) {
        const batch = writeBatch(db);
        snapshot.docs.slice(50).forEach((item) => batch.delete(item.ref));
        await batch.commit();
      }
    }),
    [requireUser, runOperation],
  );

  const getHistory = useCallback(
    async (limit = 20) => runOperation(async () => {
      const activeUid = requireUser();
      const historyRef = collection(db, 'users', activeUid, 'searchHistory');
      const historyQuery = query(historyRef, orderBy('searchedAt', 'desc'), limitQuery(Math.min(limit, 20)));
      const snapshot = await getDocs(historyQuery);
      return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    }),
    [requireUser, runOperation],
  );

  const clearHistory = useCallback(
    async () => runOperation(async () => {
      const activeUid = requireUser();
      const historyRef = collection(db, 'users', activeUid, 'searchHistory');
      const historyQuery = query(historyRef, orderBy('searchedAt', 'desc'), limitQuery(50));
      const snapshot = await getDocs(historyQuery);
      const batch = writeBatch(db);
      snapshot.docs.forEach((item) => batch.delete(item.ref));
      await batch.commit();
    }),
    [requireUser, runOperation],
  );

  const getUserStats = useCallback(
    async () => runOperation(async () => {
      const activeUid = requireUser();
      const userRef = doc(db, 'users', activeUid);
      const savedRoutesRef = collection(db, 'users', activeUid, 'savedRoutes');
      const historyRef = collection(db, 'users', activeUid, 'searchHistory');
      const [userSnapshot, savedCount, historyCount] = await Promise.all([
        getDoc(userRef),
        getCountFromServer(savedRoutesRef),
        getCountFromServer(historyRef),
      ]);
      return {
        totalSearches: userSnapshot.data()?.totalSearches ?? historyCount.data().count,
        savedRoutes: savedCount.data().count,
      };
    }),
    [requireUser, runOperation],
  );

  const updateDisplayName = useCallback(
    async (name) => runOperation(async () => {
      const activeUid = requireUser();
      await updateDoc(doc(db, 'users', activeUid), { displayName: name.trim() });
    }),
    [requireUser, runOperation],
  );

  return {
    saveRoute,
    getSavedRoutes,
    deleteRoute,
    updateRouteNotes,
    saveToHistory,
    addToHistory: saveToHistory,
    getHistory,
    clearHistory,
    getUserStats,
    updateDisplayName,
    loading,
    error,
  };
}
