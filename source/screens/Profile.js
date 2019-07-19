import React from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { FAB } from 'react-native-paper';
import User from '../User';

export const PRIMARY_COLOR = '#39CA74';
export const DARK_GRAY = '#757575';
export const BLACK = '#000000';
export const WHITE = '#ffffff';

const { width, height } = Dimensions.get('window');
export default class App extends React.Component {

  state = {
    photo: '',
    gender: '',
    phone: '',
    isLoading: true,
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

  _logOut = async () => {

    User.uid = null;
    User.email = null;
    User.name = null;
    
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          
        </View>
        
        <View style={styles.body}>
          <Image
            resizeMode="cover"
            style={styles.photo}
            source={{uri: this.state.photo}}
          />
          <View style={styles.subtitle}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{ User.name }</Text>
          </View>
          <View style={styles.listContainer}>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>{this.state.gender}</Text>
            </View>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>{User.email}</Text>
            </View>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>{this.state.phone}</Text>
            </View>

          </View>

        </View>
        <FAB
          style={styles.fab}
          small
          icon="arrow-forward"
          onPress={this._logOut}
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
  photo: {
    width: width / 3,
    height: width / 3,
    position: 'absolute',
    top: -60,
    left: width / 3,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
  },
  body: {
    backgroundColor: WHITE,
    flex: 8,
    paddingTop: 60,
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
    backgroundColor: 'red',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }

})
