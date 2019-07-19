import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper';

export const PRIMARY_COLOR = '#39CA74';
export const DARK_GRAY = '#757575';
export const BLACK = '#000000';
export const WHITE = '#ffffff';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          
        </View>
        
        <View style={styles.body}>
          <Image
            resizeMode="cover"
            style={styles.photo}
            source={{uri: 'http://4.bp.blogspot.com/-b6vgmL_IwAU/TVsUCm98WNI/AAAAAAAAFOQ/h3-ZGw6F4lQ/s320/cute-girl-wallpaper%2B2.jpg'}}
          />
          <View style={styles.subtitle}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Dea</Text>
          </View>
          <View style={styles.listContainer}>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>Sekar Dea Putri</Text>
            </View>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>sekar.dhea@gmail.com</Text>
            </View>

            <View style={styles.listWrapper}>
                <Text style={{marginLeft: 10, fontSize: 16}}>082323989989</Text>
            </View>

          </View>

        </View>
        <FAB
          style={styles.fab}
          small
          icon="logout-variant"
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    flex: 3
  },
  photo: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: -60,
    left: 120,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    elevation: 10,
    backgroundColor: 'white'
  },
  body: {
    backgroundColor: WHITE,
    flex: 8,
    paddingTop: 60,
    paddingBottom: 30
  },
  subtitle: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    flex: 7,
    paddingHorizontal: 40,
    alignItems: 'center'
  },
  listWrapper: {
    backgroundColor: WHITE,
    elevation: 10,
    flexDirection: 'row',
    borderRadius: 10,
    width: 250,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }

})
