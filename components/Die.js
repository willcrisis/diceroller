import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { Headline, TouchableRipple, Text } from 'react-native-paper';

const SIZE = 100;
const PRESS_TIMEOUT = 200;

const animateToValue = (animationValue, newValue, callback = () => {}) => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      PRESS_TIMEOUT,
      LayoutAnimation.Types.linear,
      LayoutAnimation.Properties.scaleXY
    )
  );
  Animated.timing(animationValue, {
    toValue: newValue,
    duration: PRESS_TIMEOUT,
    useNativeDriver: true,
  }).start(callback);
};

const Die = ({ type, value, onPress }) => {
  const [scaleAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    animateToValue(scaleAnimation, 1);
    return () => {
      animateToValue(scaleAnimation, 0);
    };
  }, []);

  const TouchableComponent = TouchableRipple.supported ? TouchableRipple : TouchableOpacity;

  const handleOnPress = () => {
    if (onPress) {
      animateToValue(scaleAnimation, 0, onPress);
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              scale: scaleAnimation,
            },
          ],
        },
      ]}>
      <TouchableComponent style={styles.container} onPress={handleOnPress}>
        <View style={styles.content}>
          <Headline>{value}</Headline>
          <Text>{type}</Text>
        </View>
      </TouchableComponent>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: SIZE,
    height: SIZE,
  },
  content: {
    alignItems: 'center',
  },
});

export default Die;
