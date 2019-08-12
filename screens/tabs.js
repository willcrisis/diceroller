import { Platform } from 'react-native';
import BoardScreen from './BoardScreen';
import DiceRollScreen from './DiceRollScreen';
import SessionsScreen from './Session/SessionsScreen';
import SettingsScreen from './SettingsScreen';

export default {
  ...Platform.select({
    web: {
      board: BoardScreen,
    },
  }),
  roll: DiceRollScreen,
  sessions: SessionsScreen,
  settings: SettingsScreen,
};

export const config = {
  initialRouteName: 'sessions',
};
