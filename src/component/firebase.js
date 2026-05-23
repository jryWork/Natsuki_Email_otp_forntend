import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAckYVfWnqThiJchkOHjdVBPmbc3-WfIK4",
  authDomain: "backend-email-e48b6.firebaseapp.com",
  projectId: "backend-email-e48b6",
  storageBucket: "backend-email-e48b6.firebasestorage.app",
  messagingSenderId: "347521915763",
  appId: "1:347521915763:web:b30a93cc81d73f4cb8c306",
  databaseURL: "https://backend-email-e48b6-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbr =
  getDatabase(app);
export const appFirebase = app;
