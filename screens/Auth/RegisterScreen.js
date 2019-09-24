import React, { useState } from 'react';
import { TextInput, Headline, Title } from 'react-native-paper';
import { ScreenContainer, Spacer, OutlinedButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useShowAlert } from '../../context/AlertContext';

const validatePassword = (showAlert, password, confirmPassword) => {
  return (
    password === confirmPassword ||
    (showAlert({
      text: 'Passwords must match',
    }) &&
      false)
  );
};

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { registerWithEmailAndPassword } = useAuth();
  const showAlert = useShowAlert();

  return (
    <ScreenContainer centered>
      <Headline>Dice Roller</Headline>
      <Spacer />
      <Title>Register</Title>
      <Spacer />
      <TextInput
        mode="outlined"
        label="Name"
        value={name}
        error={!name}
        onChangeText={text => setName(text)}
      />
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
      <TextInput
        mode="outlined"
        label="Confirm Password"
        value={confirmPassword}
        error={!confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
        secureTextEntry
      />
      <Spacer />
      <OutlinedButton
        onPress={() =>
          validatePassword(showAlert, password, confirmPassword) &&
          registerWithEmailAndPassword(name, email, password)
        }>
        Register
      </OutlinedButton>
      <Spacer />
      <OutlinedButton onPress={() => navigation.goBack()}>Go back</OutlinedButton>
    </ScreenContainer>
  );
};

export default RegisterScreen;
