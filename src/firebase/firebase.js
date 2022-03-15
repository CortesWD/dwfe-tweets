/**
 * Dependencies
 */
 import firebaseApp from 'firebase/app';
 import 'firebase/firestore';
 //Se agregó una nueva línea
 import "firebase/auth";
 
 /**
  * Config
  */
 import config from './config';
 // Inicializa Firebase
 firebaseApp.initializeApp(config);
 // el módulo de autenticación
 export const auth = firebaseApp.auth();
 // el proveedor de autenticación
 export const provider = new firebaseApp.auth.GoogleAuthProvider();
 // la utilidad para hacer login con el pop-up
 export const loginWithGoogle = () => auth.signInWithPopup(provider);
 // la utilidad para hacer logout
 export const logout = () => auth.signOut();
 // Exporta la funcionalidad de la base de datos
 export const fireStore = firebaseApp.firestore();
 // Exporta el paquete Firebase para otros usos
 export default firebaseApp;