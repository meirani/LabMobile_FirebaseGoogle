// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDJoN6BtFQw98WnSO2va36mgt3o2WU5Ibc",
    authDomain: "vue-firebase-bb14a.firebaseapp.com",
    projectId: "vue-firebase-bb14a",
    storageBucket: "vue-firebase-bb14a.firebasestorage.app",
    messagingSenderId: "397063020075",
    appId: "1:397063020075:web:0ed8b71df4523d3520d46e",
    measurementId: "G-B7G7HX0X6Y"
  };
  

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };