import React, { useState } from 'react';
import { TextInput, Headline, Title } from 'react-native-paper';
import { ScreenContainer, Spacer, OutlinedButton } from '../../components';
import { useAuth } from '../../context/AuthContext';

const validatePassword = (password, confirmPassword) => password === confirmPassword;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { registerWithEmailAndPassword } = useAuth();

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
          validatePassword(password, confirmPassword) &&
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
