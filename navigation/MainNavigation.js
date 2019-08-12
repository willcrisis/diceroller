import React, { useEffect } from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import JoinScreen from '../screens/Session/JoinSessionScreen';
import LoadingScreen from '../screens/LoadingScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useApp } from '../context/AppContext';

const AppNavigator = createSwitchNavigator({
  Main: {
    screen: MainTabNavigator,
    path: '',
  },
  Join: {
    screen: JoinScreen,
    path: 'join/:session',
  },
});
AppNavigator.path = '';

const AuthNavigator = createStackNavigator({
  Auth: {
    screen: AuthScreen,
    navigationOptions: {
      header: null,
    },
    path: '',
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null,
    },
    path: 'register',
  },
});
AuthNavigator.path = '';

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    App: AppNavigator,
  },
  {
    initialRouteName: 'App',
  }
);
SwitchNavigator.path = '';

const TestNavigator = props => {
  const { isAuthLoading, currentUser } = useAuth();
  const { isDataLoading } = useData();
  const { isAppLoading } = useApp();

  const isLoading = isAuthLoading || isDataLoading || isAppLoading;

  useEffect(() => {
    if (!isLoading) {
      props.navigation.navigate(currentUser ? 'App' : 'Auth');
    }
  }, [isAppLoading, isAuthLoading, isDataLoading, currentUser]);

  if (isLoading) {
    return <LoadingScreen {...props} />;
  }

  return <SwitchNavigator {...props} />;
};

TestNavigator.router = SwitchNavigator.router;

export default TestNavigator;
