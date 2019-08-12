import React from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { buttonStyle } from '../constants/Button';

const IconButton = ({ style, ...props }) => (
  <PaperIconButton {...props} style={[buttonStyle.button, style]} />
);

export default IconButton;
