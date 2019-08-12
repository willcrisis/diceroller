import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import screens, { config as tabsConfig } from '../screens/tabs';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const reduceFn = (acc, { id, Component }) => {
  let routes;
  if (typeof Component === 'object' && !Component.screen) {
    routes = Object.keys(Component.screens)
      .map(id => ({ id, Component: Component.screens[id] }))
      .reduce(reduceFn, {});
  } else {
    const Comp = Component.screen || Component;
    const Screen = props => <Comp {...props} />;
    Screen.navigationOptions = props => {
      return {
        header: (
          <Appbar.Header>
            <Appbar.Content title={Comp.title} />
          </Appbar.Header>
        ),
        ...(typeof Comp.navigationOptions === 'function'
          ? Comp.navigationOptions(props)
          : Comp.navigationOptions),
      };
    };

    routes = {
      [id]: Screen,
    };
  }

  const Stack = createStackNavigator(routes, Object.assign({}, config, Component.config));

  Stack.navigationOptions = {
    tabBarLabel: Component.title,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? `ios-${Component.iconName}` : `md-${Component.iconName}`}
      />
    ),
  };

  Stack.path = Component.path || '';

  return {
    ...acc,
    [id]: Stack,
  };
};

const routes = Object.keys(screens)
  .map(id => ({ id, Component: screens[id] }))
  .reduce(reduceFn, {});

const TabNavigator = createMaterialBottomTabNavigator(routes, tabsConfig);

export default TabNavigator;
