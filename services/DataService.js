import * as FirebaseDataService from './FirebaseService';

export const ENTITIES = {
  DIE: 'Die',
  SESSION: 'Session',
};

export const addData = async (entityName, value, array, currentUser) => {
  switch (entityName) {
    case ENTITIES.DIE:
      return FirebaseDataService.addDie(value, currentUser);
    case ENTITIES.SESSION:
      return FirebaseDataService.addSession(value, array, currentUser);
    default:
      throw new Error('Unknown entity');
  }
};

export const removeData = async (entityName, value, array, currentUser) => {
  switch (entityName) {
    case ENTITIES.DIE:
      return FirebaseDataService.removeDie(value, currentUser);
    case ENTITIES.SESSION:
      break;
    default:
      throw new Error('Unknown entity');
  }
};

export const clearData = async (entityName, currentUser) => {
  switch (entityName) {
    case ENTITIES.DIE:
      return FirebaseDataService.clearDie(currentUser);
    case ENTITIES.SESSION:
      break;
    default:
      throw new Error('Unknown entity');
  }
};

export const loadData = async (
  currentUser,
  currentSession,
  setDice,
  setSessions,
  setCurrentUser,
  setCurrentSession,
  setSessionOwner,
  setSessionDice
) => {
  return FirebaseDataService.loadData(
    currentUser,
    currentSession,
    setDice,
    setSessions,
    setCurrentUser,
    setCurrentSession,
    setSessionOwner,
    setSessionDice
  );
};

export const getData = (entityName, entityId) => {
  switch (entityName) {
    case ENTITIES.SESSION:
      return FirebaseDataService.getSession(entityId);
    default:
      throw new Error('Unknown entity');
  }
};

export const joinSession = (sessionId, sessions, currentUser) =>
  FirebaseDataService.joinSession(sessionId, sessions, currentUser);
