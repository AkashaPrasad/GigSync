import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCq2zblLIa9k9hjrT_0nXs952Y9lCTbpR0",
  authDomain: "gigflow-digilocker.firebaseapp.com",
  projectId: "gigflow-digilocker",
  storageBucket: "gigflow-digilocker.firebasestorage.app",
  messagingSenderId: "672022131509",
  appId: "1:672022131509:web:827da8b3e568e4fe21927c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
