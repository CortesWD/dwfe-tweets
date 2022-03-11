/**
 * Dependencies
 */
import firebaseApp from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

/**
 * Config
 */
import config from './config';

firebaseApp.initializeApp(config);

export const auth = firebaseApp.auth();

export const provider = new firebaseApp.auth.GoogleAuthProvider();

export const loginWithGoogle = () => auth.signInWithPopup(provider);

export const logout = () => auth.signOut();

export const fireStore = firebaseApp.firestore();

export default firebaseApp;