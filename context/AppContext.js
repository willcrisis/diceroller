import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [isAppLoading, setAppLoading] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isAppLoading,
        setAppLoading,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};

export default AppContextProvider;
