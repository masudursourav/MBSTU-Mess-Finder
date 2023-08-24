// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYgEJ6y1DChNonGWEU8uo5Yb7mU6M9ZnM",
  authDomain: "mbstu-recycle.firebaseapp.com",
  projectId: "mbstu-recycle",
  storageBucket: "mbstu-recycle.appspot.com",
  messagingSenderId: "987222268269",
  appId: "1:987222268269:web:a1c87e8c003c0d0106e264"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();