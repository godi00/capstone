/**
 * ./src/firebase.js
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAaNS6BZbdjZjuvzsJjqkcckyWzi77kx3o", //process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "capstone-firebase-1c410.firebaseapp.com",
    projectId: "capstone-firebase-1c410",
    storageBucket: "capstone-firebase-1c410.appspot.com",
    messagingSenderId: "51164326788",
    appId: "1:51164326788:web:61831c72f7f0a507838bd1",
    measurementId: "G-KPNGMXQQLM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);