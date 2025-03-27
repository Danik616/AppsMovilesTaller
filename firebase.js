import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database"; // Importa las funciones necesarias para la base de datos en tiempo real

const firebaseConfig = {
  apiKey: "AIzaSyDjvaX_LwFIDt85IQUHNIczwcxyDA-yyVg",
  authDomain: "aplicacion-2638c.firebaseapp.com",
  projectId: "aplicacion-2638c",
  storageBucket: "aplicacion-2638c.firebasestorage.app",
  messagingSenderId: "664083386714",
  appId: "1:664083386714:web:fb38a00ee7a6028951a363",
  measurementId: "G-3PV54LNEZG",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ref, push, get };
