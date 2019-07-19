import React from 'react';
import {
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import User from '../User';
import firebase from 'firebase';
export const PRIMARY_COLOR = '#39CA74';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentWillMount(){
    var firebaseConfig = {
      apiKey: "AIzaSyB1dDa4XvnSeL5IZtykW7aqfoF7I4amymY",
      authDomain: "arka-chat.firebaseapp.com",
      databaseURL: "https://arka-chat.firebaseio.com",
      projectId: "arka-chat",
      storageBucket: "",
      messagingSenderId: "912534555372",
      appId: "1:912534555372:web:a0a0bacb65c29547"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userEmail');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={PRIMARY_COLOR} size="large"/>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}