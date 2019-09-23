import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Headline } from 'react-native-paper';
import { useData } from '../context/DataContext';
import { Die, ScreenContainer, Spacer } from '../components';

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

const Window = ({ data: { user, dice } }) => {
  const total = dice.reduce((acc, { value }) => acc + value, 0);

  return (
    <View style={styles.window}>
      <Text style={styles.userName}>{user.name}</Text>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollViewContainer}>
        {dice.map(({ key, type, value }) => (
          <Die key={key} type={type} value={value} />
        ))}
      </ScrollView>
      <View style={styles.total}>
        <Headline>Total: {total}</Headline>
      </View>
    </View>
  );
};

const BoardScreen = () => {
  const { sessionDice, currentSession } = useData();

  if (!currentSession) {
    return (
      <ScreenContainer centered>
        <Text>Please select a session first.</Text>
      </ScreenContainer>
    );
  }

  const groups = sessionDice.reduce((acc, item, index) => {
    if (index % 3 === 0) {
      return [...acc, [item]];
    }
    acc[acc.length - 1].push(item);
    return acc;
  }, []);

  if (!groups.length) {
    return (
      <ScreenContainer centered>
        <Headline>To see the Board, first invite some friends to your session.</Headline>
        <Spacer />
        <Text>
          Go to Sessions screen, touch on a session's option icon, copy it's URL and share to your
          friends.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {groups.map((group, index) => (
        <Row key={`${index}`}>
          {group.map(data => (
            <Window key={data.user.key} data={data} />
          ))}
        </Row>
      ))}
    </ScreenContainer>
  );
};

BoardScreen.navigationOptions = {
  header: null,
};
BoardScreen.title = 'Board';
BoardScreen.iconName = 'desktop';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  window: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  scrollContainer: {
    width: '100%',
    marginTop: 30,
  },
  scrollViewContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  total: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  userName: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

export default BoardScreen;
