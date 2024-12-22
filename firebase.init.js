// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-l9xzxpiQq46StUVW2wJWTMim9PLzGPM",
  authDomain: "hotel-managemet.firebaseapp.com",
  projectId: "hotel-managemet",
  storageBucket: "hotel-managemet.firebasestorage.app",
  messagingSenderId: "417474334668",
  appId: "1:417474334668:web:af7c22d1a517df678f5769"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



