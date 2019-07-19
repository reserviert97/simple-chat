import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Alert, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput, Checkbox } from 'react-native-paper';
import firebase from 'firebase';

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

class Register extends Component {
  static navigationOptions = () => {
    return {
      title: 'Register',
      headerBackTitle: ' ',
      headerTintColor: BLACK,
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: WHITE
      },
      headerTitleStyle: {
        fontSize: 20,
        color: BLACK,
        fontFamily: 'AvenirLTStd-Heavy'
      }
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
      password: undefined,
      name: undefined,
      enabled: false,
      loading: false,
      checked: false
    }

    this.updateLoginField = key => text => this.updateLoginFieldState(key, text);
    this.registerAction = this.registerAction.bind(this);
  }

  updateLoginFieldState(key, value) {
    this.setState({ [key]: value }, this.checkEnabled);
  }

  checkEnabled() {
    const { email, password, name, checked } = this.state;
    this.setState({ enabled: emailValidator(email) && name && password && password.length > 0 });
  }

  async registerAction() {
    const { email, password, name } = this.state;
    this.setState({ loading: true });

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        firebase.database().ref('users/'+ user.uid ).set({name : name})
        user.updateProfile({ displayName: name})
          .then(() => {
            this.setState({loading: false});
            firebase.database().ref('users/'+ user.uid ).set({name : name});
            Alert.alert(
              'Success',
              "User " + name + " was created successfully. Please login.",
              [
                { text: 'OK', onPress: () => {
                  this.setState({ loading: false });
                  this.props.navigation.navigate('Login');
                } }
              ],
              { cancelable: false }
            );
          }, (error) => {
            console.log("Error update displayName.");
          });
      }, function(error) {
        console.error("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });
  }

  render() {
    const { email, password, name, loading, enabled, checked } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center' }}>

        <TextInput
          mode="outlined"
          style={{ marginBottom: 10 }}
          label="Name"
          placeholder="Name"
          value={name}
          theme={{ colors: { primary: PRIMARY_COLOR } }}
          onChangeText={this.updateLoginField('name')}
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          blurOnSubmit={false}
          underlineColorAndroid="transparent"
          ref={(input) => { this.nameInput = input; }}
          onSubmitEditing={() => { this.passwordInput.focus() }}
        />

        <TextInput
            mode="outlined"
            style={{ marginBottom: 10 }}
            label="Email"
            placeholder="Enter your email"
            value={email}
            theme={{ colors: { primary: PRIMARY_COLOR } }}
            onChangeText={this.updateLoginField('email')}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
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
            onSubmitEditing={enabled ? this.registerAction : undefined}
          />

          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={ () => { this.setState({ checked: !checked })}}
            />
            <Text style={{marginTop: 8}}>I Agree with terms and policy</Text>
          </View>

          <Button
            title="Sign Up"
            titleStyle={{ fontSize: 18, fontFamily: 'AvenirLTStd-Heavy' }}
            containerStyle={{ marginTop: 20, marginBottom: 30 }}
            buttonStyle={{ height: 50, borderRadius: 10, backgroundColor: PRIMARY_COLOR }}
            activeOpacity={0.8}
            disabled={!enabled}
            loading={loading}
            onPress={this.registerAction}
          />
          <Button
            type="clear"
            title="Already Have an account ? Login"
            titleStyle={{ fontSize: 16, color: DARK_GRAY, fontFamily: 'AvenirLTStd-Medium' }}
            onPress={() => console.log('Reset Password')}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 200
  }
});

export default Register;

