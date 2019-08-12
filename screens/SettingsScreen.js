import React from 'react';
import { View } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { OutlinedButton, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { logOut } = useAuth();
  return (
    <ScreenContainer>
      <View>
        <OutlinedButton onPress={logOut}>Logout</OutlinedButton>
      </View>
      <ExpoConfigView />
    </ScreenContainer>
  );
};

SettingsScreen.title = 'Settings';
SettingsScreen.iconName = 'options';

SettingsScreen.navigationOptions = {
  title: 'app.json',
};

export default SettingsScreen;
