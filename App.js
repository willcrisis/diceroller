import React from 'react';
import { Linking } from 'expo';
import { Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useScreens } from 'react-native-screens';
import { ScreenContainer } from './components';
import configure from './config';
import AlertProvider from './context/AlertContext';
import AuthProvider from './context/AuthContext';
import DataProvider from './context/DataContext';
import AppProvider from './context/AppContext';
import AppNavigator from './navigation/AppNavigator';

configure();
useScreens();

const appPrefix = Linking.makeUrl('/');

const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <DataProvider>
          <AppProvider>
            <PaperProvider>
              <ScreenContainer>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <AppNavigator uriPrefix={appPrefix} />
              </ScreenContainer>
            </PaperProvider>
          </AppProvider>
        </DataProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
