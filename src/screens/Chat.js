import React from 'react';
import {
    View,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase';
import User from '../User';

export default class ChatScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            textMessage: '',
            person: {
                uid: props.navigation.getParam('uid'),
                name: props.navigation.getParam('name')
            },
            messagesList: [],
            isLoading: true
        }
    }

    componentDidMount() {
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
            this.setState({ isLoading: false });
        }
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
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
        updates['messages/' + User.uid + '/' + this.state.person.uid + '/' + msgId] = message;
        updates['messages/' + this.state.person.uid + '/' + User.uid + '/' + msgId] = message;
        firebase.database().ref().update(updates);

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
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