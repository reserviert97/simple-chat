import React from 'react';
import {
  AsyncStorage,
  StatusBar,
  View,
  PermissionsAndroid
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

  componentWillMount() {
    if (!firebase.apps.length) {
      // Your Firebase Settings Here
      var firebaseConfig = {
        apiKey: 'YOUR FIREBASE API KEY HERE',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }

    this.requestLocation();
  }

  async requestLocation() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log('location permission denied', err);
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.name = await AsyncStorage.getItem('userName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.email = await AsyncStorage.getItem('userEmail');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          animating={true}
          color={PRIMARY_COLOR}
          size="large"
        />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
