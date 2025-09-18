// Initialize and export Firebase app, auth, firestore, and storage, plus providers
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Client-safe public config values (must be NEXT_PUBLIC_*)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Treat empty strings and the literal string "undefined" as missing
const valid = (v?: string) => Boolean(v && v !== "undefined" && v.trim() !== "");

const isConfigured = Boolean(
  valid(firebaseConfig.apiKey) &&
    valid(firebaseConfig.authDomain) &&
    valid(firebaseConfig.projectId) &&
    valid(firebaseConfig.storageBucket) &&
    valid(firebaseConfig.messagingSenderId) &&
    valid(firebaseConfig.appId)
);

let app: FirebaseApp | undefined;
if (getApps().length) {
  app = getApp();
} else if (isConfigured) {
  app = initializeApp(firebaseConfig);
}

export const firebaseEnabled = isConfigured;

// Lazily and safely initialize SDKs to avoid crashing on bad keys
let _auth: Auth | undefined;
try {
  _auth = app ? getAuth(app) : undefined;
} catch (e) {
  console.error("Firebase Auth initialization failed. Check your API key and config.", e);
  _auth = undefined;
}

export const auth: Auth | undefined = _auth;
export const db: Firestore | undefined = app ? getFirestore(app) : undefined;
export const storage: FirebaseStorage | undefined = app ? getStorage(app) : undefined;
export const googleProvider = isConfigured ? new GoogleAuthProvider() : undefined;

export default app as FirebaseApp | undefined;