// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCa-Xl2wJBvKhdCI0XDkdeif2OR15Rct-Y",
  authDomain: "campusloop-251f9.firebaseapp.com",
  projectId: "campusloop-251f9",
 storageBucket: "campusloop-251f9.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);