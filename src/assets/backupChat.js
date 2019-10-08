// import React from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     TextInput,
// } from 'react-native';
// import firebase from 'firebase';

// import User from '../User';

// export default class ChatScreen extends React.Component {
//     static navigationOptions = ({navigation}) => {
//         return{
//             title : navigation.getParam('name', null)
//         }
//     }

//     constructor(props){
//         super(props);
//         this.state = {
//             person : {
//                 name: props.navigation.getParam('name'),
//                 uid: props.navigation.getParam('uid'),
//             },
//             textMessage: '',
//             messageList: []
//         }
//     }

//     componentWillMount(){
//         firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).on('child_added', (value)=>{
//             this.setState((prevState)=>{
//                 return{
//                     messageList:[...prevState.messageList, value.val()]
//                 }
//             })
//         })
//     }

//     handleChange = (key) => val => {
//         this.setState({ [key]: val });
//     }

//     sendMessage = async() => {
//         if(this.state.textMessage.length > 0){
//             let msgId = firebase.database().ref('message').child(User.uid).child(this.state.person.uid).push().key;
//             let updates = {};
//             let message = {
//                 message : this.state.textMessage,
//                 time : firebase.database.ServerValue.TIMESTAMP,
//                 from : User.uid,
//             }
//             updates['messages/' + User.uid + '/' + this.state.person.uid + '/' + msgId ] = message;
//             updates['messages/' + this.state.person.uid + '/' + User.uid + '/' + msgId ] = message;
//             firebase.database().ref().update(updates);
//             this.setState({ textMessage : ''});
//         }
//     }
    
//     convertTime = (time) => {
//         let d = new Date(time);
//         let c = new Date();
//         let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
//         result += (d.getMinutes() < 10 ? 0 : '') + d.getMinutes();
//         if(c.getDay() !== d.getDay()){
//             result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
//         }
//         return result;
//     }

//     renderRow = ({item}) => {
//         return(
//             <View style={{
//                 flexDirection:'row',
//                 width:'60%',
//                 alignSelf: item.from === User.uid ? 'flex-end' : 'flex-start',
//                 backgroundColor: item.from === User.uid ? '#00897B' : '#7CB342',
//                 borderRadius:5,
//                 marginBottom:10,

//             }}>
//                 <Text style={{
//                     color:'#FFF',
//                     paddinf:7,
//                     fontSize:16,
//                 }}>
//                     {item.message}
//                 </Text>
//                 <Text style={{
//                     color:'#EEE',
//                     padding:3,
//                     fontSize:16
//                 }}>
//                     {this.convertTime(item.time)}
//                 </Text>
//             </View>
//         )
//     }

//     render(){
//         return(
//             <SafeAreaView>
//                 <FlatList
//                 data={this.state.messageList}
//                 renderItem={this.renderRow}
//                 keyExtractor={(item, index) => index.toString()}
//                 />
//                 <View style={{flexDirection:'row', alignItems:'center'}}>
//                     <TextInput
//                     value={this.state.textMessage}
//                     placeholder='Type message...'
//                     onChangeText={this.handleChange('textMessage')}
//                     />
//                     <TouchableOpacity onPress={this.sendMessage}>
//                         <Text>SEND</Text>
//                     </TouchableOpacity>
//                 </View>
//             </SafeAreaView>
//         )
//     }
// }