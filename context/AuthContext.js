import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  listenToLoginChanges,
  loginWithEmailAndPassword,
  logOut,
  registerWithEmailAndPassword,
} from '../services/AuthService';
import { useShowAlert } from './AlertContext';

export const AuthContext = createContext({});

const _loginWithEmailAndPassword = showAlert => async (email, password) => {
  try {
    return await loginWithEmailAndPassword(email, password);
  } catch (error) {
    showAlert({
      text: error.message,
    });
  }
};

const _registerWithEmailAndPassword = showAlert => async (name, email, password) => {
  try {
    return await registerWithEmailAndPassword(name, email, password);
  } catch (error) {
    showAlert({
      text: error.message,
    });
  }
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setAuthLoading] = useState(true);
  const showAlert = useShowAlert();

  useEffect(() => {
    listenToLoginChanges(setCurrentUser, setAuthLoading);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        currentUser,
        loginWithEmailAndPassword: _loginWithEmailAndPassword(showAlert),
        logOut,
        registerWithEmailAndPassword: _registerWithEmailAndPassword(showAlert),
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
