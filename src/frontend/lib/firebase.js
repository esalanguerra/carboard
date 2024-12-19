import { firebaseConfig } from '../config/firebaseConfig';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
