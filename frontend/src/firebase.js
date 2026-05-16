import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config from the Firebase Console
// Project Settings > General > Your apps > Web apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "beacon-157cb.firebaseapp.com",
  projectId: "beacon-157cb",
  storageBucket: "beacon-157cb.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
