
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJOlreS5uly_0HpFM-AMGa-Ts4Itnpifc",
  authDomain: "aircargo-47e88.firebaseapp.com",
  projectId: "aircargo-47e88",
  storageBucket: "aircargo-47e88.firebasestorage.app",
  messagingSenderId: "470737816303",
  appId: "1:470737816303:web:150d7137b466bcc0fd691a",
  measurementId: "G-B6B9HCE6C0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
