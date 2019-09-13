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

export const DataContext = createContext({});

const actionBuilder = (array, name, currentUser) => ({
  [`add${name}`]: value => addData(name, value, array, currentUser),
  [`remove${name}`]: value => removeData(name, value, array, currentUser),
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
  const [isSessionOwner, setSessionOwner] = useState(false);
  const [sessionDice, setSessionDice] = useState([]);
  const [isDataLoading, setDataLoading] = useState([]);

  useEffect(() => {
    let unsubscribes;
    loadData(
      currentUser,
      currentSession,
      setDice,
      setSessions,
      setCurrentSession,
      setSessionOwner,
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
        ...actionBuilder(dice, ENTITIES.DIE, currentUser),
        sessions,
        ...actionBuilder(sessions, ENTITIES.SESSION, currentUser),
        getSession,
        currentSession,
        setCurrentSession: chooseSession(setCurrentSession),
        isSessionOwner,
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