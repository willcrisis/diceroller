import React, { Fragment } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { buttonStyle } from '../constants/Button';
import { OutlinedButton, DieButton, Die, ScreenContainer } from '../components';
import { useData } from '../context/DataContext';

const DiceRollScreen = () => {
  const { dice, addDie, removeDie, clearDie, currentSession } = useData();

  if (!currentSession) {
    return (
      <View style={styles.emptyMessage}>
        <Text>Please select a session first.</Text>
      </View>
    );
  }

  const total = dice.reduce((acc, die) => acc + die.value, 0);

  return (
    <ScreenContainer>
      {dice.length === 0 && (
        <View style={styles.emptyMessage}>
          <Text>Tap buttons below to roll some dice</Text>
        </View>
      )}

      {dice.length > 0 && (
        <Fragment>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.rolledDice}>
            {dice.map(die => (
              <Die key={die.key} type={die.type} value={die.value} onPress={() => removeDie(die)} />
            ))}
          </ScrollView>
          <View style={styles.total}>
            <Headline>Total: {total}</Headline>
          </View>
        </Fragment>
      )}

      <View style={styles.dice}>
        <DieButton faces={4} onPress={addDie} />
        <DieButton faces={6} onPress={addDie} />
        <DieButton faces={8} onPress={addDie} />
        <DieButton faces={10} onPress={addDie} />
        <DieButton faces={12} onPress={addDie} />
        <DieButton faces={20} onPress={addDie} />
        <OutlinedButton style={buttonStyle.button} compact onPress={clearDie}>
          <Ionicons name="ios-refresh" />
        </OutlinedButton>
      </View>
    </ScreenContainer>
  );
};

DiceRollScreen.navigationOptions = {
  header: null,
};

DiceRollScreen.title = 'Roll';
DiceRollScreen.iconName = 'cube';

const shadow = {
  ...Platform.select({
    ios: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 20,
    },
    web: {
      boxShadow: '0 -3px 3px rgba(0, 0, 0, 0.1)',
    },
  }),
};

const styles = StyleSheet.create({
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
    ...Platform.select({
      ios: {
        marginTop: 30,
      },
    }),
  },
  rolledDice: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  total: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  dice: {
    ...shadow,
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiceRollScreen;
