import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyBvqM-mLJIybmTo3tE13fZGHDGvRPs4YuA",
    authDomain: "pricehound-aut.firebaseapp.com",
    projectId: "pricehound-aut",
    storageBucket: "pricehound-aut.appspot.com",
    messagingSenderId: "37369181782",
    appId: "1:37369181782:web:caec45e46d013c26e9edf7",
    measurementId: "G-PJDRXM5TET"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
export default app
