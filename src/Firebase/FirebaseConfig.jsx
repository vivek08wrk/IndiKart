// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcfmj2Rac6NOQOeq88bbtSj35Mq7lMvbY",
  authDomain: "myapp-df9e6.firebaseapp.com",
  projectId: "myapp-df9e6",
  storageBucket: "myapp-df9e6.firebasestorage.app",
  messagingSenderId: "1058088709355",
  appId: "1:1058088709355:web:9d5a281ddd1ff4ba3022ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth};