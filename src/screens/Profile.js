import React from 'react';
import { Image, Dimensions, StatusBar, AsyncStorage, StyleSheet, TextInput, View, Text, Alert, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';

import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get("window");

export default class ProfilScreen extends React.Component {
    static navigationOptions = { header: null }

    constructor(props){
        super(props);
        this.state = {
            name    : User.name,
            phone   : User.phone,
            avatar  : User.avatar,
            edit    : false,
            tempName    : User.name,
            tempPhone   : User.phone,
            tempAvatar  : User.avatar,
        }
    }
    

    handleChange = key => val => {
        this.setState({ [key]: val, btn: 'SAVE' })
    }

    changeData = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('Error', 'Please enter valid name');
        } else {
            firebase.database().ref('users').child(User.uid).update({ name: this.state.tempName, phone: this.state.tempPhone, avatar: this.state.tempAvatar});
            User.name   = this.state.tempName;
            User.phone  = this.state.tempPhone;
            User.avatar = this.state.tempAvatar;
            this.props.navigation.navigate('Home');
        }
    }

    toggleEdit = (bool) => {
        this.setState({
            edit : bool,
            tempName : this.state.name,
            tempAvatar : this.state.avatar,
            tempPhone : this.state.phone,

        });
    }

    logOut = async () => {
        await firebase.auth().signOut();
        await AsyncStorage.clear();
        await this.props.navigation.navigate('Auth');
    }

    render() {
        if (this.state.edit) {
        return (
            <LinearGradient colors={['#5f27cd', '#341f97']}   style={styles.container}>
                <StatusBar backgroundColor="#5f27cd" barStyle="light-content" hidden={false}/>
                <View style={styles.header}>
                    <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: '500', color: '#FFF', flex: 1 }}>PROFILE</Text>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={this.logOut}>
                        <Text style={{color:'#FFF'}}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <View style={{flexDirection:'row'}}>
                        <Image
                            source={{ uri: this.state.tempAvatar }}
                            style={styles.profile}
                            resizeMode="cover"
                        />
                        <View style={{margin:20, flex:1, justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{ backgroundColor:'#FFF', borderRadius:5, width:'30%', 
                            alignItems:'center', alignSelf:'flex-end'}} 
                            onPress={() => this.toggleEdit(!this.state.edit)}>
                                <Text style={{fontSize:10,fontWeight:'300', margin:4}}>EDIT</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={{color:'#FFF', fontSize:16}}
                                value={this.state.tempName}
                                onChangeText={this.handleChange('tempName')}
                            />
                            <Text style={{color:'#F1F1F1'}}>
                                {User.email}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop: 7}}>
                        <Text style={{color:'#FFF'}}> Phone: </Text>
                        <TextInput
                            style={{color:'#FFF'}}
                            value={this.state.tempPhone}
                            onChangeText={this.handleChange('tempPhone')}
                        />
                    </View>
                    <TouchableOpacity style={{ marginTop:50,backgroundColor:'#FFF', borderRadius:5, width:'100%', alignItems:'center'}} onPress={this.changeData}>
                        <Text style={{fontSize:16,fontWeight:'300', margin:10}}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        )
    } else {
        return (
            <LinearGradient colors={['#5f27cd', '#341f97']}   style={styles.container}>
            <StatusBar backgroundColor="#5f27cd" barStyle="light-content" hidden={false}/>
            <View style={styles.header}>
                <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: '500', color: '#FFF', flex: 1 }}>PROFILE</Text>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={this.logOut}>
                    <Text style={{color:'#FFF'}}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <View style={{flexDirection:'row'}}>
                    <Image
                        source={{ uri: this.state.tempAvatar }}
                        style={styles.profile}
                        resizeMode="cover"
                    />
                    <View style={{margin:20, flex:1, justifyContent:'flex-end'}}>
                        <TouchableOpacity style={{ backgroundColor:'#FFF', borderRadius:5, width:'30%',
                         alignItems:'center', alignSelf:'flex-end'}} 
                         onPress={() => this.toggleEdit(!this.state.edit)}>
                            <Text style={{fontSize:10,fontWeight:'300', margin:4}}>EDIT</Text>
                        </TouchableOpacity>
                        <Text style={{color:'#F1F1F1'}}>
                            {this.state.name}
                        </Text>
                        <Text style={{color:'#F1F1F1'}}>
                            {User.email}
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{color:'#FFF'}}> Phone: {this.state.phone}</Text>
                </View>
                <TouchableOpacity style={{ marginTop:50,backgroundColor:'#FFF', borderRadius:5, width:'100%', alignItems:'center'}} onPress={() => this.props.navigation.navigate('Home')}>
                    <Text style={{fontSize:16,fontWeight:'300', margin:10}}>BACK</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
        )
      }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    body: {
        flex: 8,
        margin: 20
    },
    profile:{
        width:width/4,
        height:width/4,
        borderColor:'#FFF',
        borderRadius:20,
        

    }
})