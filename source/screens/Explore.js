import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  FlatList,
  Button
} from "react-native";

import { ActivityIndicator } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import Modal from "react-native-modal";
import MapView from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';

import User from '../User';
import * as theme from '../constants/theme';
const { width, height } = Dimensions.get("window");

const PRIMARY_COLOR = '#39CA74';
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class screens extends Component {

  constructor(){
    super();
    this.state = {
      markers: [],
      selfMarker: {},
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.00264195044303443,
        longitudeDelta: 0.002142817690068,
      },
      active: null,
      activeModal: null,
    };
  }

  componentWillMount() {
    firebase.database().ref('users').on('value', data => {
      console.log(Object.entries(data.val()));

      let datadumy = Object.values(data.val()).filter(data => data.uid !== User.uid);
      let datadumy2 = Object.entries(data.val()).filter(data => data[0] !== User.uid);
      this.setState({markers: datadumy});
      navigator.geolocation.getCurrentPosition(({coords}) => {
        let userLocation = firebase.database().ref('users').child(User.uid).child('coordinate');
        userLocation.set({
          latitude: coords.latitude,
          longitude: coords.longitude
        }),

        this.setState(prevState => {
          return {
            region: {
              ...prevState.region,
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        })
      }, (error) => {
        console.log(error, "ERRORNYA DISINI")
      });

    });

  }

  componentWillUnmount() {
    this.setState({
      region: {
        latitude: null,
        longitude: null
      }
    })
  }

  renderUser = (item) => {

    return (
      <TouchableWithoutFeedback key={`parking-${item.id}`} onPress={() => this.setState({ active: item.uid })} >
        <View style={[styles.parking, styles.shadow]}>
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              
            </View>
          </View>
          <View style={styles.parkingInfoContainer}>
            <View style={styles.parkingInfo}>
              
            </View>

            <TouchableOpacity 
              style={styles.buy} 
              onPress={() => {
                console.log(item.coordinate)
                _mapView.animateToRegion({
                  latitude: item.coordinate.latitude,
                  longitude: item.coordinate.longitude,
                  latitudeDelta: this.state.region.latitudeDelta,
                  longitudeDelta: this.state.region.longitudeDelta
                }, 1000)
              }}
            >
              <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, marginHorizontal: 5}}>
                <Ionicons name="md-locate" color="white"/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeModal: item })}>
              <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, marginHorizontal: 5}}>
              <Ionicons name="md-return-left" color="white"/>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderUsersList = () => {
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        snapToAlignment="center"
        style={styles.usersList}
        data={this.state.markers}
        extraData={this.state}
        keyExtractor={(item, index) => `${item.name}`}
        renderItem={({ item }) => this.renderUser(item)}
      />
    )
  }

  renderModal() {
    const { activeModal } = this.state;

    if (!activeModal) return null;

    return (
      <Modal
        isVisible
        useNativeDriver
        style={styles.modalContainer}
        backdropColor={theme.COLORS.overlay}
        onBackButtonPress={() => this.setState({ activeModal: null })}
        onBackdropPress={() => this.setState({ activeModal: null })}
        onSwipeComplete={() => this.setState({ activeModal: null })}
      >
        <View style={styles.modal}>
          <View style={styles.modalInfo}>
            <Avatar
              size="xlarge"
              rounded
              source={{ uri: activeModal.photo }}
            />
          </View>

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={{ fontSize: theme.SIZES.font * 1.5, fontWeight: 'bold' }}>
              {activeModal.name}
            </Text>
          </View>
          <View style={{ paddingVertical: theme.SIZES.base, alignItems: 'center' }}>
            <Text style={{ color: theme.COLORS.gray, fontSize: theme.SIZES.font * 1.1 }}>
              {activeModal.gender}
            </Text>
          </View>
          
          <View>
            <TouchableOpacity 
              style={styles.payBtn} 
              onPress={() => {
                this.props.navigation.navigate('ChatScreen', { person: activeModal}) 
                this.setState({ activeModal: null })
              }}
            >
              <Text style={styles.payText}>
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.payBtn} onPress={() => this.setState({ activeModal: null })}>
              <Text style={styles.payText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }


  render() {
    if (this.state.region.latitude) {
      return (
        <View style={styles.container}>
          <MapView
            showsUserLocation
            showsMyLocationButton={true}
            ref = {(mapView) => { _mapView = mapView; }}
            initialRegion={this.state.region}
            style={styles.container}

          >
            {this.state.markers.map((marker, index) => {
              return (
                <MapView.Marker key={index} coordinate={marker.coordinate}>
                  <Animated.View >
                    <Animated.View />
                    <View />
                  </Animated.View>
                </MapView.Marker>
              );
            })}
          </MapView>
            
          {this.renderUsersList()}
            
          {this.renderModal()}
  
        </View>
      );
    }else {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginBottom: 20}}>Searching Your Location</Text>
          <ActivityIndicator animating={true} color={PRIMARY_COLOR} size="large"/>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buy: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.SIZES.base * 1.5,
    paddingVertical: theme.SIZES.base,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 6,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.SIZES.base,
    borderBottomWidth: 1,
    borderTopColor: theme.COLORS.overlay,
    borderBottomColor: theme.COLORS.overlay,
  },
  payText: {
    fontWeight: '600',
    fontSize: theme.SIZES.base * 1.5,
    color: theme.COLORS.white,
  },
  payBtn: {
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SIZES.base * 1.5,
    backgroundColor: PRIMARY_COLOR,
    marginVertical: 10
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  usersList: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    paddingBottom: theme.SIZES.base * 2,
  },
  // View
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  parking: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 6,
    padding: theme.SIZES.base,
    marginHorizontal: theme.SIZES.base * 2,
    width: width - (24 * 2),
  },
  shadow: {
    shadowColor: theme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hours: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: theme.SIZES.base / 2,
    justifyContent: 'space-evenly',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 2.5,
    paddingBottom: theme.SIZES.base * 1.5,
  },
  headerTitle: {
    color: theme.COLORS.gray,
  },
  headerLocation: {
    fontSize: theme.SIZES.font,
    fontWeight: '500',
    paddingVertical: theme.SIZES.base / 3,
  },
  map: {
    flex: 3,
  },
  parking: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 6,
    padding: theme.SIZES.base,
    marginHorizontal: theme.SIZES.base * 2,
    width: width - (24 * 2),
  },
  buyTotal: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  buyTotalPrice: {
    color: theme.COLORS.white,
    fontSize: theme.SIZES.base * 2,
    fontWeight: '600',
    paddingLeft: theme.SIZES.base / 4,
  },
  buyBtn: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  marker: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.base * 2,
    paddingVertical: 12,
    paddingHorizontal: theme.SIZES.base * 2,
    borderWidth: 1,
    borderColor: theme.COLORS.white,
  },
  markerPrice: { color: theme.COLORS.red, fontWeight: 'bold', },
  markerStatus: { color: theme.COLORS.gray },
  shadow: {
    shadowColor: theme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  active: {
    borderColor: theme.COLORS.red,
  },
  hours: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: theme.SIZES.base / 2,
    justifyContent: 'space-evenly',
  },
  hoursTitle: {
    fontSize: theme.SIZES.text,
    fontWeight: '500',
  },
  hoursDropdown: {
    borderRadius: theme.SIZES.base / 2,
    borderColor: theme.COLORS.overlay,
    borderWidth: 1,
    padding: theme.SIZES.base,
    marginRight: theme.SIZES.base / 2,
  },
  hoursDropdownOption: {
    padding: 5,
    fontSize: theme.SIZES.font * 0.8,
  },
  hoursDropdownStyle: {
    marginLeft: -theme.SIZES.base,
    paddingHorizontal: theme.SIZES.base / 2,
    marginVertical: -(theme.SIZES.base + 1),
  },
  parkingInfoContainer: { flex: 1.5, flexDirection: 'row' },
  parkingInfo: {
    justifyContent: 'space-evenly',
    marginHorizontal: theme.SIZES.base * 1.5,
  },
  parkingIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    flexDirection: 'column',
    height: height * 0.75,
    padding: theme.SIZES.base * 2,
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: theme.SIZES.base,
    borderTopRightRadius: theme.SIZES.base,
  },
  modalHours: {
    paddingVertical: height * 0.11,
  },
  modalHoursDropdown: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.SIZES.base,
  },
  
});

AppRegistry.registerComponent("mapfocus", () => screens);