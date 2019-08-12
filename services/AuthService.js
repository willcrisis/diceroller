import * as FirebaseService from './FirebaseService';

export const listenToLoginChanges = (setCurrentUser, setAuthLoading) =>
  FirebaseService.listenToLoginChanges(setCurrentUser, setAuthLoading);

export const loginWithEmailAndPassword = (email, password) =>
  FirebaseService.loginWithEmailAndPassword(email, password);

export const logOut = () => FirebaseService.logOut();

export const registerWithEmailAndPassword = (name, email, password) =>
  FirebaseService.registerWithEmailAndPassword(name, email, password);
