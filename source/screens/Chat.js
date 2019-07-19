import React from 'react'; 
import { 
  View, 
  Dimensions
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActivityIndicator } from 'react-native-paper';
import styles from '../constants/styles';
import firebase from 'firebase';
import User from '../User';

const PRIMARY_COLOR = '#39CA74';

export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      person: props.navigation.getParam('person'),
      messagesList: [],
      isLoading: true
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('person', null).name,
      tabBarVisible: false
    }
  }

  componentDidMount(){
    try {
      firebase.database().ref('messages')
      .child(User.uid)
      .child(this.state.person.uid)
      .on('child_added', (value) => {
        this.setState(previousState => ({
          messagesList: GiftedChat.append(previousState.messagesList, value.val()),
          isLoading: false
        }))
      })
    } catch (err) {
      this.setState({isLoading: false});
    }
  }

  handleChange = key => val => {
    this.setState({[key] : val})
  }

  onSend(messages = []) {

    let msgId = firebase.database().ref('messages')
                  .child(User.uid)
                  .child(this.state.person.uid)
                  .push().key;

    let updates = {};

    let message = {
      _id: msgId,
      text: messages[0].text,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      user: {
        _id: User.uid,
        name: User.name
      }
    };
    updates['messages/'+User.uid+'/'+this.state.person.uid+'/'+msgId] = message;
    updates['messages/'+ this.state.person.uid +'/'+ User.uid+ '/'+ msgId] = message;
    firebase.database().ref().update(updates);
    
  }

  render() {
    
    let { height, width } = Dimensions.get('window');

    if (this.state.isLoading) {
      return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={PRIMARY_COLOR} />
      </View>
      )
    }

    return(
      <View style={{flex: 1}}>
          <GiftedChat
            messages={this.state.messagesList}
            onSend={messagesList => this.onSend(messagesList)}
            user={{
              _id: User.uid,
              name: User.name
            }}
          />
      </View>
    )
  }
}