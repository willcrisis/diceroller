import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  listenToLoginChanges,
  loginWithEmailAndPassword,
  logOut,
  registerWithEmailAndPassword,
} from '../services/AuthService';

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    listenToLoginChanges(setCurrentUser, setAuthLoading);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        currentUser,
        loginWithEmailAndPassword,
        logOut,
        registerWithEmailAndPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
