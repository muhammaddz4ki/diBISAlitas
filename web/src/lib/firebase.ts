import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpmJMNsMvbb9gSWLFG6tibDortImOcw_w",
  authDomain: "dibisalitas-bcbcc.firebaseapp.com",
  projectId: "dibisalitas-bcbcc",
  storageBucket: "dibisalitas-bcbcc.firebasestorage.app",
  messagingSenderId: "844088774514",
  appId: "1:844088774514:web:74fdd9b96239cb0531d7eb",
  measurementId: "G-557R2KYC0P"
};

// Initialize Firebase (Singleton pattern to avoid re-initialization in Next.js dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
