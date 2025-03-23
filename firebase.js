import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database"; // Importa las funciones necesarias para la base de datos en tiempo real

const firebaseConfig = {
  apiKey: "AIzaSyDGezo6oo0MakP9Opx31yHKT-3t3J1YBZY",
  authDomain: "pruebacodigo-46a09.firebaseapp.com",
  databaseURL: "https://pruebacodigo-46a09-default-rtdb.firebaseio.com",
  projectId: "pruebacodigo-46a09",
  storageBucket: "pruebacodigo-46a09.firebasestorage.app",
  messagingSenderId: "227500433652",
  appId: "1:227500433652:web:00a609a3be033f030cfea1",
  measurementId: "G-LLSSV6Q8SS",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ref, push, get };
