import React,{ Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './src/screens/Home';
import ChatScreen from './src/screens/Chat';
import ProfileScreen from './src/screens/Profile';

import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';

import AuthLoadingScreen from './src/screens/AuthLoading';

const AppStack = createStackNavigator({ 
  Home: HomeScreen,
   Chat: ChatScreen, 
   Profile: ProfileScreen});
const AuthStack = createStackNavigator({ 
  Login: LoginScreen, 
  Register: RegisterScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
)); 