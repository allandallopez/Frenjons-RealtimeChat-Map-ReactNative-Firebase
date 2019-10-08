import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

export default class Splash extends Component {
    render (){
        return (
                <LinearGradient colors={['#00d2d3', '#01a3a4']} style={styles.linearGradient}>
                    <StatusBar backgroundColor="#00d2d3" barStyle="light-content" />
                    <Image source={require('../assets/images/Icons/key.png')} style={styles.logoSplash}/>
                    <Text style={{color:'#FFF', marginTop: 10, fontSize: 25, fontWeight: '500'}}>FrenJon's</Text>
                </LinearGradient>
        );
    }

};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    logoSplash: {
        width: 100,
        height: 100,
    }
});
