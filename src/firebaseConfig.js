import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAzBuodIAzwZsm9P8xHZQ15ZyKbzra5OzA",
    authDomain: "formulario-de-funcionario.firebaseapp.com",
    projectId: "formulario-de-funcionario",
    storageBucket: "formulario-de-funcionario.firebasestorage.app",
    messagingSenderId: "507174967035",
    appId: "1:507174967035:web:7da8cb282e81888724c25e",
    measurementId: "G-47Z9NM5N4R"
};



// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore, Storage e Authentication
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
