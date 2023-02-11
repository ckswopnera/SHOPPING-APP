// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAiVjAqYaf47oReYHle7_C-Ds1zjKoyBM4",
    authDomain: "shopping-app-899ab.firebaseapp.com",
    projectId: "shopping-app-899ab",
    storageBucket: "shopping-app-899ab.appspot.com",
    messagingSenderId: "974334130003",
    appId: "1:974334130003:web:cdc5b4c82a4afe6ffa93a6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
  app,
  db,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
};
