import React from 'react';
import { 
  createSwitchNavigator, 
  createStackNavigator, 
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation';

import AuthLoadingScreen from './screens/Auth';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';
import ExploreScreen from './screens/Explore';
import ProfileScreen from './screens/Profile';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

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
    initialRouteName: 'Explore',
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