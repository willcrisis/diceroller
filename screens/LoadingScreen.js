import React from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';

const LoadingScreen = ({ navigation }) => {
  const { setAppLoading } = useApp();
  return (
    <AppLoading
      startAsync={loadResourcesAsync}
      onError={handleLoadingError}
      onFinish={() => handleFinishLoading(setAppLoading)}
    />
  );
};

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('../assets/images/robot-dev.png'),
      require('../assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setAppLoading) {
  setAppLoading(false);
}

export default LoadingScreen;
