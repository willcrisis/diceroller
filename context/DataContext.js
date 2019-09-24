import React, { createContext, useState, useContext, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import {
  ENTITIES,
  loadData,
  addData,
  removeData,
  clearData,
  getData,
  joinSession,
} from '../services/DataService';
import { useAuth } from './AuthContext';
import { useShowAlert } from './AlertContext';

export const DataContext = createContext({});

const actionBuilder = (array, name, currentUser, showAlert) => ({
  [`add${name}`]: value => addData(name, value, array, currentUser),
  [`remove${name}`]: value => removeData(name, value, array, currentUser, showAlert),
  [`clear${name}`]: () => clearData(name, currentUser),
});

const chooseSession = setCurrentSession => session => {
  setCurrentSession(session);
  return AsyncStorage.setItem('currentSession', session.key);
};

const getSession = sessionId => getData(ENTITIES.SESSION, sessionId);

const _joinSession = (currentUser, sessions) => sessionId =>
  joinSession(sessionId, sessions, currentUser);

const DataContextProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [dice, setDice] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionDice, setSessionDice] = useState([]);
  const [isDataLoading, setDataLoading] = useState([]);
  const showAlert = useShowAlert();

  useEffect(() => {
    let unsubscribes;
    loadData(
      currentUser,
      currentSession,
      setDice,
      setSessions,
      setCurrentSession,
      setSessionDice
    ).then(subscriptions => {
      setDataLoading(false);
      unsubscribes = subscriptions;
    });

    return () => {
      if (unsubscribes && unsubscribes.length) {
        console.log(`unsubscribing from ${unsubscribes.length} subscriptions`);
        unsubscribes.forEach(unsubscribe => unsubscribe());
      }
    };
  }, [currentSession, currentUser]);

  return (
    <DataContext.Provider
      value={{
        isDataLoading,
        dice,
        ...actionBuilder(dice, ENTITIES.DIE, currentUser, showAlert),
        sessions,
        ...actionBuilder(sessions, ENTITIES.SESSION, currentUser, showAlert),
        getSession,
        currentSession,
        setCurrentSession: chooseSession(setCurrentSession),
        sessionDice,
        joinSession: _joinSession(currentUser, sessions),
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};

export default DataContextProvider;
