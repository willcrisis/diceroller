import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/auth';
import { AsyncStorage } from 'react-native';

const extractData = snapshot => ({
  ...snapshot.data(),
  key: snapshot.id,
});

const sort = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

export const listenToLoginChanges = (setCurrentUser, setAuthLoading) =>
  firebase.auth().onAuthStateChanged(user => {
    setCurrentUser(user);
    setAuthLoading(false);
  });

export const loginWithEmailAndPassword = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

export const registerWithEmailAndPassword = async (name, email, password) => {
  const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
  await user.updateProfile({ displayName: name });
  await firebase
    .firestore()
    .doc(`users/${user.uid}`)
    .set({
      name,
    });
};

export const logOut = async () => {
  await AsyncStorage.removeItem('currentSession');
  return firebase.auth().signOut();
};

export const loadData = async (
  currentUser,
  currentSession,
  setDice,
  setSessions,
  setCurrentSession,
  setSessionOwner,
  setSessionDice
) => {
  const unsubscribes = [];

  let currentSessionId = currentSession && currentSession.key;
  if (!currentSessionId) {
    currentSessionId = await AsyncStorage.getItem('currentSession');
  }

  const firestoreRef = firebase.firestore();

  const currentUserId = currentUser && currentUser.uid;

  if (currentUserId) {
    unsubscribes.push(
      firestoreRef.doc(`users/${currentUserId}`).onSnapshot(async snapshot => {
        if (!snapshot.exists) {
          return;
        }
        const currentUser = extractData(snapshot);
        const userSessions = currentUser.sessions;
        if (userSessions && userSessions.length > 0) {
          let sessions = [];
          sessions = await Promise.all(
            userSessions.map(async sessionId => {
              const snapshot = await firestoreRef.doc(`sessions/${sessionId}`).get();
              if (snapshot.exists) {
                return extractData(snapshot);
              } else {
                firestoreRef.doc(`users/${currentUserId}`).set(
                  {
                    sessions: userSessions.filter(id => id !== sessionId),
                  },
                  { merge: true }
                );
              }
              return null;
            })
          );
          setSessions(sessions.filter(session => session).sort((a, b) => sort(a.name, b.name)));
        }
      })
    );
  }

  if (currentSessionId) {
    unsubscribes.push(
      firestoreRef.doc(`sessions/${currentSessionId}`).onSnapshot(async snapshot => {
        if (!snapshot.exists) {
          setCurrentSession(null);
          setDice([]);
          setSessionOwner(false);
          setSessionDice([]);
          return AsyncStorage.removeItem('currentSession');
        }
        let session = extractData(snapshot);

        if (!currentSession) {
          setCurrentSession(session);
        }

        unsubscribes.push(
          snapshot.ref
            .collection(`users/${currentUserId}/dice`)
            .orderBy('timestamp', 'asc')
            .onSnapshot(diceSnapshot => {
              let dice = [];
              diceSnapshot.forEach(dieSnapshot => {
                dice = [...dice, extractData(dieSnapshot)];
              });
              setDice(dice);
            })
        );

        if (session.owner === currentUserId) {
          setSessionOwner(true);

          let usersDice = {};
          const usersSnapshot = await snapshot.ref.collection('users').get();
          usersSnapshot.forEach(async userSnapshot => {
            if (userSnapshot.id !== currentUserId) {
              const userData = await firestoreRef.doc(`users/${userSnapshot.id}`).get();
              const user = extractData(userData);
              unsubscribes.push(
                userSnapshot.ref.collection('dice').onSnapshot(userDiceSnapshot => {
                  let userDice = [];
                  userDiceSnapshot.forEach(dieSnapshot => {
                    userDice = [...userDice, extractData(dieSnapshot)];
                  });

                  usersDice = {
                    ...usersDice,
                    [userSnapshot.id]: {
                      user,
                      dice: userDice,
                    },
                  };

                  setSessionDice(
                    Object.values(usersDice).sort((a, b) => sort(a.user.name, b.user.name))
                  );
                })
              );
            }
          });
        } else {
          setSessionOwner(false);
          setSessionDice([]);
        }
      })
    );
  }

  return unsubscribes;
};

export const addDie = async (value, currentUser) => {
  const currentSessionId = await AsyncStorage.getItem('currentSession');
  if (!currentUser || !currentSessionId) {
    return;
  }
  const firestoreRef = firebase.firestore();
  return firestoreRef.collection(`sessions/${currentSessionId}/users/${currentUser.uid}/dice`).add({
    ...value,
    timestamp: new Date(),
  });
};

export const removeDie = async ({ key }, currentUser) => {
  const currentSessionId = await AsyncStorage.getItem('currentSession');
  if (!currentUser || !currentSessionId) {
    return;
  }
  const firestoreRef = firebase.firestore();
  return firestoreRef
    .doc(`sessions/${currentSessionId}/users/${currentUser.uid}/dice/${key}`)
    .delete();
};

export const clearDie = async currentUser => {
  const currentSessionId = await AsyncStorage.getItem('currentSession');
  if (!currentUser || !currentSessionId) {
    return;
  }
  const firestoreRef = firebase.firestore();
  const dice = await firestoreRef
    .collection(`sessions/${currentSessionId}/users/${currentUser.uid}/dice`)
    .get();
  dice.forEach(async ({ id }) => {
    await firestoreRef
      .doc(`sessions/${currentSessionId}/users/${currentUser.uid}/dice/${id}`)
      .delete();
  });
};

export const addSession = async (value, sessions, currentUser) => {
  if (!currentUser) {
    return;
  }
  const firestoreRef = firebase.firestore();
  const session = await firestoreRef.collection(`sessions`).add({
    ...value,
    owner: currentUser.uid,
  });

  await firestoreRef.doc(`sessions/${session.id}/users/${currentUser.uid}`).set({
    timestamp: new Date(),
  });

  return firestoreRef.doc(`users/${currentUser.uid}`).set(
    {
      sessions: [...sessions.map(({ key }) => key), session.id],
    },
    { merge: true }
  );
};

export const getSession = async sessionId => {
  const snapshot = await firebase
    .firestore()
    .doc(`sessions/${sessionId}`)
    .get();
  if (snapshot.exists) {
    return extractData(snapshot);
  } else {
    return null;
  }
};

export const joinSession = async (sessionId, sessions, currentUser) => {
  if (!currentUser) {
    return;
  }

  const firestoreRef = firebase.firestore();

  await firestoreRef.doc(`sessions/${sessionId}/users/${currentUser.uid}`).set({
    timestamp: new Date(),
  });

  return firestoreRef.doc(`users/${currentUser.uid}`).set(
    {
      sessions: [...sessions.map(({ key }) => key), sessionId],
    },
    { merge: true }
  );
};
