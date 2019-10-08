import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default class UserModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,
        };
    }

    closeModal = () => {
        this.props.setModal(false);
    }

    goToChat() {
        this.closeModal();
        this.props.navigation.navigate('Chat', this.props.user);

    }
    render() {
        return (
            <View style={styles.contentContainer}>
                <TouchableOpacity activeOpacity={1} style={styles.contentSide} onPress={() => this.closeModal()} ></TouchableOpacity>
                <View style={styles.modal}>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={styles.cardImage}>
                            <Image
                                source={{ uri: this.props.user.avatar }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        <View onPress={() => console.warn(width)} style={styles.profileView}>
                            <Text numberOfLines={1} style={styles.text}> {this.props.user.name} </Text>
                            <TouchableOpacity onPress={() => this.goToChat()} style={{ margin: 10 }}>
                                <Image source={require('../assets/images/Icons/chat.png')} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.biodata}>
                        <Text style={styles.textBio} numberOfLines={1}>Email : {this.props.user.email} </Text>
                        <Text style={styles.textBio} numberOfLines={1}>Phone: {this.props.user.phone} </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    contentSide: {
        flex: 1,
        backgroundColor: 'black',
        opacity: 0.3,
    },
    modal: {
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    biodata:{
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
        marginRight:20,
        marginLeft:(width / 10) + 20,
        padding:10,
        alignItems: 'flex-start'
    },
    text: {
        fontSize: 15,
        color: '#000',
        marginLeft:30
    },
    textBio: {
        fontSize: 15,
        color: '#000',
        marginLeft:30
    },
    profileView: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginLeft:(width / 10)+20,
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    cardImage: {
        flex: 1,
        width: width / 5,
        height: width / 5,
        position: 'absolute',
        elevation: 2,
        backgroundColor: "#FFF",
        margin: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        borderRadius: (width / 6) / 2,
        borderWidth: 5,
        borderColor: '#FFF',
        overflow: "hidden",
    },
    image: {
        flex: 3,
        width: "100%",
        alignSelf: "center",
    },

});