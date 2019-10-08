import React,{ Component } from 'react';
import { PermissionsAndroid, StyleSheet, StatusBar, AsyncStorage, Text, Alert, TouchableOpacity, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';

import User from '../User';

export default class LoginScreen extends Component {
  static navigationOptions = {
      header : null,
  }

  state = {
    email: '',
    password: '',
    errorMessage: null
  }

  handleChange = (key) => val => {
    this.setState({ [key]: val });
  }

  handleLogin = async() => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then( async (response) => {
      await AsyncStorage.setItem('uid', response.user.uid)
      User.uid = response.user.uid
      this.props.navigation.navigate('App');
    })
    .catch(()=>{
      Alert.alert('Error','Please check again your email and password !')
    })

  }

  componentDidMount = async() => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  } 


  render() {
    return (
      <LinearGradient colors={['#55efc4', '#a29bfe']} style={styles.container}>
        <StatusBar backgroundColor="#55efc4" barStyle="light-content" />
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>
        }
        <Text style={styles.title}>Welcome FrenJon's</Text>
        <Icon 
        style={styles.searchIcon} 
        name="ios-mail" 
        size={25} 
        color="#000"
        />
         <TextInput
        placeholder='email'
        style={styles.input}
        value={this.state.email}
        onChangeText={this.handleChange('email')}
        />
        <Icon 
        style={styles.searchIcon2} 
        name="ios-key" 
        size={25} 
        color="#000"
        />
        <TextInput
        placeholder='Password'
        style={styles.input}
        value={this.state.password}
        secureTextEntry={true}
        onChangeText={this.handleChange('password')}
        />
        <TouchableOpacity style={styles.btnForm} onPress={this.handleLogin}>
          <Text style={{fontSize:15, fontWeight: '700', paddingTop: 4}}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Register')}>
          
          <Text style={{color:'#FFF'}}>Don't have an account ? Register Here </Text>
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFF',
    // position: 'relative'
  },
  title:{
    margin:20,
    fontSize:35,
    fontWeight:'500',
    color:'#FFF'
  },
  input:{
    padding:10,
    borderWidth:1,
    borderColor:'#F1F1F1',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width:'90%',
    marginBottom:10,
    borderRadius:20,
    paddingLeft: 47
  },
  btnForm:{
    padding:10,
    borderWidth:1,
    borderColor:'#74b9ff',
    backgroundColor:'#0984e3',
    width:'80%',
    height: '7%',
    alignItems:'center',
    marginBottom:10,
    borderRadius:25
  },
  searchIcon: {
    padding: 10,
    position: 'absolute',
    paddingBottom: 78,
    paddingRight : 340
  },
    searchIcon2: {
      padding: 10,
      position: 'absolute',
      // paddingBottom: -1,
      paddingTop: 60,
      paddingRight : 340
  }
})