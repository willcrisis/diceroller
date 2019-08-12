import React from 'react';
import Button from '../components/Button';

const ContainedButton = ({ ...props }) => <Button {...props} mode="contained" />;
export default ContainedButton;
