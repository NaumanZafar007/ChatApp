import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Alert, ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = props => {
  const handleLogout = () => {
    // Confirm with the user before logging out
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            // Perform Firebase logout
            await auth().signOut();
            props.navigation.navigate('AuthStack', {screen: 'Login'});
            ToastAndroid.show('Successfully Signed Out', ToastAndroid.SHORT);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userUID');
            // After logout, you can navigate to the login screen or perform any other necessary actions
          } catch (error) {
            console.error('Error logging out:', error.message);
          }
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Include default drawer items */}
      <DrawerItemList {...props} />

      {/* Add custom items or components */}
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

export default Logout;
