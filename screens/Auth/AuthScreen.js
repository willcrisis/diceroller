import React, { useState } from 'react';
import { TextInput, Headline, Title } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { OutlinedButton, Spacer, ScreenContainer } from '../../components';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithEmailAndPassword } = useAuth();

  return (
    <ScreenContainer centered>
      <Headline>Dice Roller</Headline>
      <Spacer />
      <Title>Login</Title>
      <Spacer />
      <TextInput
        mode="outlined"
        label="E-mail"
        value={email}
        error={!email}
        onChangeText={text => setEmail(text)}
      />
      <Spacer />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        error={!password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Spacer />
      <OutlinedButton onPress={() => loginWithEmailAndPassword(email, password)}>
        Login
      </OutlinedButton>
      <Spacer />
      <OutlinedButton onPress={() => navigation.navigate('Register')}>Register</OutlinedButton>
    </ScreenContainer>
  );
};

export default AuthScreen;
