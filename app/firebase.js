// app/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// YOUR REAL KEYS
const firebaseConfig = {
  apiKey: "AIzaSyDGjMmrm-LxINZjdU4Cn-hFNwXTTFHJYq0",
  authDomain: "zinc-sanctuary-483113-f5.firebaseapp.com",
  projectId: "zinc-sanctuary-483113-f5",
  storageBucket: "zinc-sanctuary-483113-f5.firebasestorage.app",
  messagingSenderId: "178023080970",
  appId: "1:178023080970:web:7b4c14566af0505f4f2bf3",
  measurementId: "G-8Z81YKEWS4"
};

// Initialize Firebase (Singleton pattern to prevent errors in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export the tools we need for Login and Chat
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };