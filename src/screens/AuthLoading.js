import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  View,
} from 'react-native';
import { 
  API_KEY_FIREBASE,
  AUTH_DOMAIN_KEY,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MSG_SENDER_ID,
  APP_ID,
  MSMR_ID
} from 'react-native-dotenv';
import firebase from 'firebase';

import User from'../User';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      uid:''
    }
    this._bootstrapAsync();
  }
 componentDidMount(){
    var firebaseConfig = {
      apiKey: API_KEY_FIREBASE,
      authDomain: AUTH_DOMAIN_KEY,
      databaseURL: DATABASE_URL,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MSG_SENDER_ID,
      appId: APP_ID,
      measurementId: MSMR_ID
    };
    
    if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    }
 }
 _bootstrapAsync =  async () => {
  await AsyncStorage.getItem('uid').then(response => 
    this.state.uid = response);
    this.props.navigation.navigate(this.state.uid ? 'App' : 'Auth');
};

  render() {
    return (
      <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
        <ActivityIndicator styl={{alignSelf:'center'}}/>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}