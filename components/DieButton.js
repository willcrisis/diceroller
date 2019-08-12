import React from 'react';
import { buttonStyle } from '../constants/Button';
import ContainedButton from './ContainedButton';

const rollRandomNumber = max => {
  return Math.floor(Math.random() * max) + 1;
};

const DieButton = ({ faces, onPress }) => {
  const type = `d${faces}`;
  return (
    <ContainedButton
      style={buttonStyle.button}
      dark
      compact
      onPress={() => onPress({ type, value: rollRandomNumber(faces) })}
      uppercase={false}>
      {type}
    </ContainedButton>
  );
};

export default DieButton;
