import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBVtNCtfvwi0w4eANxxet0zJeYDxNHbCfs",
  authDomain: "emailotp-d2991.firebaseapp.com",
  projectId: "emailotp-d2991",
  storageBucket: "emailotp-d2991.firebasestorage.app",
  messagingSenderId: "127965436139",
  appId: "1:127965436139:web:c7248df7cbaa846bdfc6ae",
  measurementId: "G-6XJ72M3HGV",
  databaseURL: "https://emailotp-d2991-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbr =
  getDatabase(app);
export const appFirebase = app;
