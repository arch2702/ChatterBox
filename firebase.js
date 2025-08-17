// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// auth import -> step1
import {getAuth} from "firebase/auth";
// firestore step-1
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd0ifxDWhYcU_mR7YefyQeBBrEZNTqMLk",
  authDomain: "wa-clone-d77c1.firebaseapp.com",
  projectId: "wa-clone-d77c1",
  storageBucket: "wa-clone-d77c1.firebasestorage.app",
  messagingSenderId: "547334583213",
  appId: "1:547334583213:web:8710e1757c3b5586b8e724"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// auth-step2
const auth = getAuth(app);
// firestore step-2
 const db = getFirestore();
 const storage= getStorage();

export {auth,db,storage}