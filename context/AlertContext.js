import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from 'react-native-paper';

export const AlertContext = createContext({});

const _showAlert = (setAlert, setVisible) => alert => {
  setAlert(alert);
  setVisible(true);
};

const hideAlert = (setAlert, setVisible) => () => {
  setVisible(false);
  setAlert(null);
};

const AlertContextProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setVisible] = useState(false);

  return (
    <AlertContext.Provider
      value={{
        showAlert: _showAlert(setAlert, setVisible),
      }}>
      {children}
      <Snackbar
        visible={isVisible}
        action={alert && alert.action}
        onDismiss={hideAlert(setAlert, setVisible)}>
        {alert && alert.text}
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useShowAlert = () => {
  const { showAlert } = useContext(AlertContext);
  return showAlert;
};

export default AlertContextProvider;
