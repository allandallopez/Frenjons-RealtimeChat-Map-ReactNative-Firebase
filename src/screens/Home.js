import React, { Component } from 'react';
import { StyleSheet, StatusBar,Text, AsyncStorage, Modal, ActivityIndicator,TouchableOpacity, View, Animated, Image, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import firebase from 'firebase';
import User from '../User';
import stylingMap from '../assets/StylingMap';
import UserModal from '../components/UserModal';
const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width / 6;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0152;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      avatar:'',
      tempUser: null,
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
      _ModalVisible: false,
    }
  }

  static navigationOptions = { header: null }

  setModal = (bool, item) => {
    this.setState({ tempUser: item })
    this.setState({ _ModalVisible: bool });
  }

  closeModal = (bool) => {
    this.setState({ _ModalVisible: bool });
  }

  sendLocation = async (position) => {
    await AsyncStorage.getItem('uid').then(response => firebase.database().ref('users/' + response)
      .update({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }))
  }

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
        this.sendLocation(position);
      }
    );
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.users.length) {
        index = this.state.users.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const coords = this.state.users[index];
          this.map.animateToRegion(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
    let dbRef = firebase.database().ref('users');
    dbRef.on("child_added", (val) => {
      let person = val.val();
      person.uid = val.key;
      if (person.uid === firebase.auth().currentUser.uid) {
        User.uid = person.uid;
        User.name = person.name;
        User.email = person.email;
        User.phone = person.phone;
        User.avatar = person.avatar;
        this.setState({avatar : person.avatar});
      } else {
        this.setState((prevState) => {
          return {
            users: [...prevState.users, person],
          }
        })
      }
    })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const interpolations = this.state.users.map((user, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    if (this.state.region.longitude) {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#FFF" barStyle="dark-content"/>
          <MapView
            ref={map => this.map = map}
            initialRegion={this.state.region}
            customMapStyle={stylingMap}
            style={styles.container}
          >
            <MapView.Marker
              coordinate={this.state.region}
            />
            {/* START of Render Friends Markers */}
            {this.state.users.map((user, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity,
              };

              return (
                <MapView.Marker key={index} coordinate={{ latitude: Number(user.latitude), longitude: Number(user.longitude) }}>
                  <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.ring, scaleStyle]} />
                    <View style={styles.marker} />
                  </Animated.View>
                </MapView.Marker>
              );
            })}
            {/* END of Render Friends Markers */}

          </MapView>


          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          >

            {/* START of Render Friend List */}
            {this.state.users.map((user, index) => (
              <TouchableOpacity onPress={() => this.setModal(!this.state._ModalVisible, user)} style={styles.card} key={index}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            {/* END of Render Friend List */}

          </Animated.ScrollView>
          <Modal transparent={true} visible={this.state._ModalVisible} onRequestClose={() => this.closeModal(false)}>
            <UserModal navigation={this.props.navigation} user={this.state.tempUser} setModal={this.setModal} />
          </Modal>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.greeting}>Hi! {User.name}</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                <Image
                  source={{ uri: this.state.avatar }}
                  style={styles.profile}
                  resizeMode="cover"
                />
              </TouchableOpacity>
          </View>

        </View>
      );
    } else {
      return (
        <View style={styles.loading}>
          <StatusBar backgroundColor="#FFF" barStyle="dark-content"/>
          <ActivityIndicator/>
          <Text>Search your location...</Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    padding:5,
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center',
    margin:20,
    alignSelf:'center',
    position:'absolute',
    backgroundColor:'#FFF',
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    overflow: "hidden",
  },
  greeting:{
    flex:1,
    padding: 10
  },
  profile: {
    width:40,
    height:40,
    borderRadius:20
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingLeft: (width / 2) - (width / 12),
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    margin: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_WIDTH,
    width: CARD_WIDTH,
    borderWidth: 5,
    borderColor: '#FFF',
    borderRadius: CARD_WIDTH / 2,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    alignSelf: "center",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  marker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
  },
});