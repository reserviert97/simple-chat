import React from 'react'; 
import { 
  View, 
  Dimensions
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import styles from '../constants/styles';
import firebase from 'firebase';
import User from '../User';

export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      person: props.navigation.getParam('person'),
      messagesList: []
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('person', null).name
    }
  }

  componentWillMount(){
    firebase.database().ref('messages')
      .child(User.uid)
      .child(this.state.person.uid)
      .on('child_added', (value) => {
        console.log("HASIL VALUE", value)
        console.log("value val", value.val());
        
        this.setState(previousState => ({
          messagesList: GiftedChat.append(previousState.messagesList, value.val()),
        }))
      })
  }

  handleChange = key => val => {
    this.setState({[key] : val})
  }

  // sendMessage = async () => {
  //   if (this.state.textMessage.length > 0) {
  //     let msgId = firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).push().key;
  //     let updates = {};

  //     let message = {
  //       _id: msgId,
  //       text: this.state.textMessage,
  //       createdAt: firebase.database.ServerValue.TIMESTAMP,
  //       user: {
  //         _id: this.state.person.uid,
  //         name: this.state.person.uid
  //       }
  //     };

  //     updates['messages/'+User.uid+'/'+this.state.person.uid+'/'+msgId] = message;
  //     updates['messages/'+ this.state.person.uid +'/'+ User.uid+ '/'+ msgId] = message;
  //     firebase.database().ref().update(updates);
  //     this.setState({textMessage: ''});
  //   }
  // }

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
    );
  }
}