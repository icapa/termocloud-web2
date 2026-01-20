import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration from environment variables
// appId is optional - only needed for Analytics and advanced features
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    ...(import.meta.env.VITE_FIREBASE_APP_ID && { appId: import.meta.env.VITE_FIREBASE_APP_ID }),
    // Realtime Database URL (optional, auto-detected from projectId if not provided)
    ...(import.meta.env.VITE_FIREBASE_DATABASE_URL && { databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL })
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Realtime Database instance
