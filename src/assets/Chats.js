import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import firebase from 'firebase';

import User from '../User';

export default class ChatsScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return{
      title : 'Chats',
      headerRight: (
        <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
          <Image style={{width:32,height:32,marginRight:10}}
          source={require('../assets/images/Icons/yeeh.png')}/>
        </TouchableOpacity>
      )
    }
  }

  constructor(props){
      super(props);
      this.state = {
          users:[]
      }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  componentWillMount(){
    let dbRef = firebase.database().ref('users');
    dbRef.on("child_added",(val)=>{
      let person = val.val();
      person.uid = val.key;
      if(person.uid === firebase.auth().currentUser.uid) {
        User.uid = person.uid;
        User.name = person.name;
        User.email = person.email;
        User.phone = person.phone;
      } else {
        this.setState((prevState)=>{
          return {
            users : [...prevState.users, person],
          }
        })
      }
    })
  }

  renderRow = ({item}) => {
    return(
      <TouchableOpacity
      onPress={()=> this.props.navigation.navigate('Chat', item)}
      style={{padding:10, borderBottomColor:'#ccc', borderBottomWidth:1}}
      >
        <Text style={{fontSize:20}}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  render() { 
    return (
      <SafeAreaView>
        <FlatList
        data={this.state.users}
        renderItem={this.renderRow}
        keyExtractor={(item)=>item.uid}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
})