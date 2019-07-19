import React from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  AsyncStorage,
  StyleSheet,
  Image
} from 'react-native';
import firebase from 'firebase';
import { ActivityIndicator } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import User from '../User';
// import styles from '../constants/styles';

const PRIMARY_COLOR = '#39CA74';

export default class Homescreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Chats',
    }
  }

  state = {
    users: [],
    isLoading: true
  }

  componentDidMount(){
    
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', (val) => {
      let person = val.val();
      person.uid = val.key;
      if (person.uid === User.uid) {
        User.name = person.name
      }else {
        this.setState((prevState) => {
          return {
            users: [...prevState.users, person],
            isLoading: false
          }
        });
      }
    })
  }

  goToChatRoom = (item) => {
    this.props.navigation.navigate('Chat', { person: item});
  };
  
  keyExtractor = (item, index) => index.toString();
  
  renderItem = ({ item }) => (
    <ListItem
      containerStyle={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#eaeaea'}}
      title={item.name}
      titleStyle={{fontSize: 14, fontWeight: 'bold'}}
      subtitle={
        <View style={styles.subtitleView}>
          <Text 
            style={styles.ratingText}
            numberOfLines={1}
          >
            Ayo Kesini sekarang, asdsa dasdas da dsad sadsadasd sdasad asdsadsa dasdas
          </Text>
          <Text style={styles.smallSize}>5 min ago</Text>
        </View>
      }
      leftAvatar={{
        source: item.avatar_url && { uri: item.avatar_url },
        title: item.name[0],
        size: 30
      }}
      onPress={() => this.goToChatRoom(item)}
    />
  )

  render(){

    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color={PRIMARY_COLOR} />
        </View>
      )
    }

    return(
      <SafeAreaView>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.users}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingText: {
    flex: 5,
    color: 'grey',
    fontSize: 12,
    paddingRight: 15
  },
  smallSize: {
    flex: 1,
    fontSize: 9,
  }
})