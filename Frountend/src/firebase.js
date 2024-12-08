// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries\

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-c2270.firebaseapp.com",
  projectId: "real-estate-c2270",
  storageBucket: "real-estate-c2270.firebasestorage.app",
  messagingSenderId: "483972491423",
  appId: "1:483972491423:web:6e89b1ef8f2c2cce815aaa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);