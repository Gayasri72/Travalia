// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'travalia-5b3f0.firebaseapp.com',
  projectId: 'travalia-5b3f0',
  storageBucket: 'travalia-5b3f0.firebasestorage.app',
  messagingSenderId: '1037908831416',
  appId: '1:1037908831416:web:e5bc15fdedc590693d584d',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
