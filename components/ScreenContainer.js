import React from 'react';
import { View, StyleSheet } from 'react-native';

const ScreenContainer = ({ children, centeredHorizontal, centeredVertical, centered }) => {
  const appliedStyles = [styles.container];
  if (centered) {
    appliedStyles.push(styles.centeredHorizontal, styles.centeredVertical);
  } else {
    if (centeredHorizontal) {
      appliedStyles.push(styles.centeredHorizontal);
    }
    if (centeredVertical) {
      appliedStyles.push(styles.centeredVertical);
    }
  }

  return <View style={appliedStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  centeredHorizontal: {
    alignItems: 'center',
  },
  centeredVertical: {
    justifyContent: 'center',
  },
});

export default ScreenContainer;
