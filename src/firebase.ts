import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-TQEPVIsvvftWMkq4LG-IQMQmJ7oGEQo",
  authDomain: "tungpham-6ebe1.firebaseapp.com",
  projectId: "tungpham-6ebe1",
  storageBucket: "tungpham-6ebe1.firebasestorage.app",
  messagingSenderId: "690431785521",
  appId: "1:690431785521:web:8f0424ccc9b9cbb85fb310"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
