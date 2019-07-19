import React from 'react';
import { 
  createSwitchNavigator, 
  createStackNavigator, 
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation';

// import { createBottomTabNavigator } from "react-navigation-tabs";


import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthLoadingScreen from './screens/Auth';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';
import ExploreScreen from './screens/Explore';
import ProfileScreen from './screens/Profile';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const PRIMARY_COLOR = '#39CA74';

const AppStack = createStackNavigator({ 
  Home: HomeScreen, 
  Chat: {
    screen: ChatScreen
  } 
});


AppStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const AppTabs = createBottomTabNavigator(
  {
    Chat: AppStack,
    Explore: ExploreScreen,
    Profile: ProfileScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Chat') {
          iconName = `ios-chatboxes`;
        } else if (routeName === 'Profile') {
          iconName = `ios-person`;
        } else if (routeName === 'Explore') {
          iconName = `logo-ionic`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
      inactiveTintColor: 'gray',
      showLabel: false
    },
  }

)

const AuthStack = createStackNavigator({ 
  Login: LoginScreen,
  Register: RegisterScreen
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppTabs,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));