// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAIYWPy79-534JGFjTDkgworPNfEcivqms",
  authDomain: "sari-sari-store-892d0.firebaseapp.com",
  databaseURL: "https://sari-sari-store-892d0-default-rtdb.firebaseio.com",
  projectId: "sari-sari-store-892d0",
  storageBucket: "sari-sari-store-892d0.firebasestorage.app",
  messagingSenderId: "715099376731",
  appId: "1:715099376731:web:e7cf8b5aef6270d77f837e",
  measurementId: "G-DVKHEES6HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
export const db = getDatabase(app);
