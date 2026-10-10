import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9eJcnnoO1hCWcM5lfKvVIpY-AUbWx3dI",
  authDomain: "ayush-a0b88.firebaseapp.com",
  projectId: "ayush-a0b88",
  storageBucket: "ayush-a0b88.firebasestorage.app",
  messagingSenderId: "879514383286",
  appId: "1:879514383286:web:b40b2784e6ee18245f4717",
  measurementId: "G-89HP63G80K"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is only available in the browser
// export const getFirebaseAnalytics = () => {
//   if (typeof window !== "undefined") {
//     return getAnalytics(app);
//   }
//   return null;
// };
