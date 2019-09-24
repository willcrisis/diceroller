import React, { Fragment, useState } from 'react';
import { StyleSheet, FlatList, Clipboard } from 'react-native';
import {
  List,
  Text,
  FAB,
  Dialog,
  Portal,
  Button,
  IconButton,
  TextInput,
  Menu,
} from 'react-native-paper';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer } from '../../components';

const dismissModal = (setOpen, setName) => () => {
  setOpen(false);
  setName('');
};

const AddSessionDialog = ({ isOpen, setOpen, addSession }) => {
  const [name, setName] = useState('');
  const dismiss = dismissModal(setOpen, setName);

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={dismiss}>
        <Dialog.Title>New Session</Dialog.Title>
        <Dialog.Content>
          <TextInput label="Name" value={name} onChangeText={text => setName(text)} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={dismiss}>Cancel</Button>
          <Button
            onPress={() => {
              addSession({ name });
              dismiss();
            }}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const SessionMenu = ({ removeSession, session, currentUser, ...props }) => {
  const [isVisible, setVisible] = useState(false);
  const dismiss = () => setVisible(false);
  return (
    <Menu
      visible={isVisible}
      onDismiss={dismiss}
      anchor={<IconButton {...props} icon="more-vert" onPress={() => setVisible(true)} />}>
      <Menu.Item
        onPress={() => {
          Clipboard.setString(`https://willcrisis.github.io/diceroller/#/join/${session.key}`);
          dismiss();
        }}
        title="Copy link"
        icon="content-copy"
      />
      {/* {session.owner === currentUser.uid && ( */}
      <Menu.Item
        onPress={() => setTimeout(() => removeSession(session), 200)}
        title="Delete"
        icon="delete"
      />
      {/* )} */}
    </Menu>
  );
};

const selectSession = async (session, setCurrentSession, navigation) => {
  await setCurrentSession(session);
  navigation.navigate('roll');
};

const currentSessionBackground = (currentSession, session) => ({
  backgroundColor: currentSession.key === session.key ? '#52d98f' : '#ffffff',
});

const SessionsScreen = ({ navigation }) => {
  const { sessions, addSession, removeSession, setCurrentSession, currentSession } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Fragment>
      {sessions.length > 0 && (
        <FlatList
          data={sessions}
          renderItem={({ item }) => (
            <List.Item
              style={[styles.listItem, currentSessionBackground(currentSession, item)]}
              title={item.name}
              onPress={() => selectSession(item, setCurrentSession, navigation)}
              right={props => (
                <SessionMenu
                  {...props}
                  session={item}
                  removeSession={removeSession}
                  currentUser={currentUser}
                />
              )}
            />
          )}
        />
      )}
      {sessions.length === 0 && (
        <ScreenContainer centered>
          <Text>You don't have any session yet.</Text>
        </ScreenContainer>
      )}
      <AddSessionDialog
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        addSession={session => addSession(session)}
      />
      <FAB style={styles.fab} icon="add" onPress={() => setModalOpen(true)} />
    </Fragment>
  );
};

SessionsScreen.title = 'Sessions';
SessionsScreen.iconName = 'albums';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  listItem: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
});

export default SessionsScreen;
