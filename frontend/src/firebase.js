import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config from the Firebase Console
// Project Settings > General > Your apps > Web apps
const firebaseConfig = {
  apiKey: "AIzaSyAnZZOV2i0hc-yy0MXmWOx2TdVGy8R08ew",
  authDomain: "beacon-157cb.firebaseapp.com",
  projectId: "beacon-157cb",
  storageBucket: "beacon-157cb.firebasestorage.app",
  messagingSenderId: "430545613579",
  appId: "1:430545613579:web:f76f41b1f8d22687e2680e",
  measurementId: "G-3XE21JTSML"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
