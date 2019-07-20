import React, { Component } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity,
  Alert,
  AsyncStorage,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput, Dialog, Portal, Paragraph, Provider } from 'react-native-paper';
import firebase from 'firebase';
import { auth, initializeApp, storage } from 'firebase';
import User from '../User';

// Shared Utils
export const emailValidator = (email) => {
  const email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.(\w|\|){2,})+$/;
  return email_reg.test(email);
};

// Colors
export const PRIMARY_COLOR = '#39CA74';
export const DARK_GRAY = '#757575';
export const BLACK = '#000000';
export const WHITE = '#ffffff';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
      password: undefined,
      enabled: false,
      loading: false,
      error: false
    }

    this.updateLoginField = key => text => this.updateLoginFieldState(key, text);
    this.loginAction = this.loginAction.bind(this);
  }

  updateLoginFieldState(key, value) {
    this.setState({ [key]: value }, this.checkEnabled);
  }

  checkEnabled() {
    const { email, password } = this.state;
    this.setState({ enabled: emailValidator(email) && password && password.length > 0 });
  }

  async loginAction() {
    const { email, password } = this.state;
    this.setState({ loading: true });

    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(({user}) => {
        AsyncStorage.setItem('userEmail', user.email);
        AsyncStorage.setItem('userName', user.displayName);
        AsyncStorage.setItem('userUid', user.uid);

        User.email = user.email;
        User.name = user.displayName;
        User.uid = user.uid;

        this.setState({loading: false});

        this.props.navigation.navigate('Explore');
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Failed',
          'Authentication Failed',
          [
            { text: 'OK', onPress: () => this.setState({ loading: false }) }
          ],
          { cancelable: false }
        );
      })
  }

  render() {
    const { email, password, loading, enabled } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextInput
            mode="outlined"
            style={{ marginBottom: 10 }}
            label="Email"
            placeholder="Enter your email"
            value={email}
            theme={{ colors: { primary: PRIMARY_COLOR } }}
            onChangeText={this.updateLoginField('email')}
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            ref={(input) => { this.emailInput = input; }}
            onSubmitEditing={() => { this.passwordInput.focus() }}
          />
          <TextInput
            mode="outlined"
            style={{ marginBottom: 10 }}
            label="Password"
            placeholder="Enter your password"
            value={password}
            theme={{ colors: { primary: PRIMARY_COLOR } }}
            onChangeText={this.updateLoginField('password')}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="done"
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            ref={(input) => { this.passwordInput = input; }}
            onSubmitEditing={enabled ? this.loginAction : undefined}
          />
          <Button
            title="Log in"
            titleStyle={{ fontSize: 18, fontFamily: 'AvenirLTStd-Heavy' }}
            containerStyle={{ marginTop: 20, marginBottom: 30 }}
            buttonStyle={{ height: 50, borderRadius: 10, backgroundColor: PRIMARY_COLOR }}
            activeOpacity={0.8}
            disabled={!enabled}
            loading={loading}
            onPress={this.loginAction}
          />

          <Text>Don't have an account ?</Text>
          <Button
            type="clear"
            title="Register"
            titleStyle={{ fontSize: 16, color: DARK_GRAY, fontFamily: 'AvenirLTStd-Medium' }}
            onPress={() => this.props.navigation.navigate('Register')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30
  }
});

export default LoginScreen;

