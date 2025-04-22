
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZXjYNYsp8tUHCpaSNi7x0PnV9Hlxwvfg",
  authDomain: "aircargo-47e88.firebaseapp.com",
  projectId: "aircargo-47e88",
  storageBucket: "aircargo-47e88.appspot.com",
  messagingSenderId: "470737816303",
  appId: "1:470737816303:web:dummy-app-id",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
