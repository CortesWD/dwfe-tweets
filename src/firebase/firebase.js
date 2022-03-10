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
// Exporta la funcionalidad de la base de datos
export const fireStore = firebaseApp.firestore();

// el módulo de autenticación
export const auth = firebase.auth();
// el proveedor de autenticación
export const provider = new firebase.auth.GoogleAuthProvider();
// la utilidad para hacer login con el pop-up
export const loginConGoogle = () => auth.signInWithPopup(provider);
// la utilidad para hacer logout
export const logout = () => auth.signOut();

// Exporta el paquete Firebase para otros usos
export default firebaseApp;