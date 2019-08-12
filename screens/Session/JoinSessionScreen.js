import React, { useEffect, useState, Fragment } from 'react';
import { Headline, ActivityIndicator, Text } from 'react-native-paper';
import { useData } from '../../context/DataContext';
import { ContainedButton, Spacer, ScreenContainer } from '../../components';

const join = (sessionId, joinSession, navigation) => {
  joinSession(sessionId);
  goToSessions(navigation);
};

const goToSessions = navigation => navigation.navigate('sessions');

const JoinSessionScreen = ({ navigation }) => {
  const { getSession, joinSession, sessions } = useData();
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const sessionId = navigation.getParam('session');

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession(sessionId);
      setSession(sessionData);
      setLoadingSession(false);
    };
    loadSession();
  }, []);

  const exists = sessions.find(({ key }) => session && session.key === key);

  return (
    <ScreenContainer centered>
      {loadingSession && <ActivityIndicator />}
      {!loadingSession && (
        <Fragment>
          {exists ? (
            <Text>You already joined this session</Text>
          ) : (
            <Text>Would you like to join this session?</Text>
          )}
          <Spacer />
          <Headline>{session.name}</Headline>
          <Spacer />
          {exists ? (
            <ContainedButton onPress={() => goToSessions(navigation)}>
              Go to Sessions Page
            </ContainedButton>
          ) : (
            <ContainedButton onPress={() => join(sessionId, joinSession, navigation)}>
              Join Session
            </ContainedButton>
          )}
        </Fragment>
      )}
    </ScreenContainer>
  );
};

JoinSessionScreen.navigationOptions = {
  header: null,
};

export default JoinSessionScreen;
