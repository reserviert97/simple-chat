import React from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { FAB, TextInput, ActivityIndicator } from 'react-native-paper';
import User from '../User';

export const PRIMARY_COLOR = '#39CA74';
export const DARK_GRAY = '#757575';
export const BLACK = '#000000';
export const WHITE = '#ffffff';

const { width, height } = Dimensions.get('window');
export default class App extends React.Component {

  constructor(){
    super();

    this.state = {
      photo: '',
      gender: '',
      phone: '',
      isLoading: true,
    };

    this.updateLoginField = key => text => this.updateLoginFieldState(key, text);
    // this.registerAction = this.registerAction.bind(this);
  }


  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    }
  } 

  async componentDidMount(){
    
    await firebase.database().ref('users').child(User.uid).once('value', data => {
      this.setState({
        name: data.val().name,
        gender: data.val().gender,
        phone: data.val().phone,
        photo: data.val().photo,
        isLoading: false
      });
    })
  }

  updateLoginFieldState(key, value) {
    this.setState({ [key]: value });
  }

  async registerAction() {
    const { gender, photo, phone } = this.state;
    this.setState({ isLoading: true });

    const data = firebase.database().ref('users').child(User.uid);
    data.update({
      gender, phone, photo
    });

    this.setState({ isLoading: false });
    this.props.navigation.navigate('Profile');
  }


  render() {
    console.log(this.state);

    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color={PRIMARY_COLOR} size="large"/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}/>
        
        <View style={styles.body}>
          <View style={styles.subtitle}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{ User.name }</Text>
          </View>
          <View style={styles.listContainer}>

            <View style={styles.listWrapper}>
                {/* <Text style={{marginLeft: 10, fontSize: 16}}>{User.email}</Text> */}
                <TextInput
                  style={{flex: 1}}
                  value={this.state.photo}
                  onChangeText={this.updateLoginField('photo')}
                />
            </View>

            <View style={styles.listWrapper}>
                {/* <Text style={{marginLeft: 10, fontSize: 16}}>{this.state.gender}</Text> */}
                <TextInput
                  style={{flex: 1}}
                  value={this.state.gender}
                  placeholder='Insert you gender'
                  onChangeText={this.updateLoginField('gender')}
                />
            </View>

            <View style={styles.listWrapper}>
                {/* <Text style={{marginLeft: 10, fontSize: 16}}>{this.state.phone}</Text> */}
                <TextInput 
                  style={{flex: 1}}
                  value={this.state.phone}
                  placeholder='Insert phone number'
                  onChangeText={this.updateLoginField('phone')}
                />
            </View>

          </View>

        </View>
        <FAB
          style={styles.fab2}
          small
          icon="arrow-back"
          onPress={() => this.props.navigation.navigate('Profile', { loading: true })}
        >
        </FAB>

        <FAB
          style={styles.fab}
          small
          icon="done"
          onPress={() => this.registerAction()}
        >
        </FAB>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    flex: 3
  },
  body: {
    backgroundColor: WHITE,
    flex: 8,
    paddingTop: 20,
    paddingBottom: 30
  },
  subtitle: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    flex: 7,
    paddingHorizontal: width / 6,
    alignItems: 'center'
  },
  listWrapper: {
    backgroundColor: WHITE,
    elevation: 10,
    flexDirection: 'row',
    borderRadius: 10,
    width: (width / 6) * 4,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  fab: {
    backgroundColor: PRIMARY_COLOR,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab2: {
    backgroundColor: PRIMARY_COLOR,
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
  }

})
