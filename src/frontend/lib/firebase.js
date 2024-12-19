import { firebaseConfig } from '@/src/config/firebase-config';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
