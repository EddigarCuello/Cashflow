// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAhLxF2QpDN9jMO5NQ8uONcHU2yvFy_C1g",
  authDomain: "cashflow-7f4de.firebaseapp.com",
  projectId: "cashflow-7f4de",
  storageBucket: "cashflow-7f4de.firebasestorage.app",
  messagingSenderId: "833568958580",
  appId: "1:833568958580:web:c0ef847d4cf93a212b8921",
  measurementId: "G-1ZPXB77P09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

//const db = getFirestore(app);

export { auth, db,storage,};
