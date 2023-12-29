import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ImagesPath} from '../assets/ImagesPath';

const Users = ({navigation}) => {
  const [users, setUsers] = useState(null);
  const [currentUserid, setCurrentUserid] = useState();

  useFocusEffect(() => {
    getUsers();
  });

  const getUsers = async () => {
    const userID = await AsyncStorage.getItem('userUID');
    console.log('current use is: ' + userID);
    if (userID) {
      setCurrentUserid(userID);
      const querySnap = await firestore()
        .collection('users')
        .where('uid', '!=', userID)
        .get();
      const allUsers = querySnap.docs.map(docSnap => docSnap.data());
      console.log(allUsers);
      setUsers(allUsers);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        style={styles.Mlist}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatScreen3', {
                user: {
                  name: item.name,
                  uid: item.uid,
                  currentUserid: currentUserid,
                },
              })
            }>
            <View style={styles.card}>
              <Image
                style={[styles.userImageST]}
                source={ImagesPath.Users}></Image>
              <View style={styles.txtArea}>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatsStack', { screen: 'ChatUsers' })}
        style={styles.logoutBtn}>
        <Text style={styles.loginText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
  },
  title: {
    fontWeight: '700',
    fontSize: 32,
    color: '#fb5b5a',
    marginBottom: 10,
  },
  logoutBtn: {
    width: '30%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 28,
    marginVertical: 10,
    flexDirection: 'row',
  },
  txtArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 280,
    backgroundColor: 'transparent',
  },
  userImageST: {
    width: 52,
    height: 52,
    borderRadius: 25,
  },
  userText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Verdana',
    color: 'white',
  },
  msgTime: {
    textAlign: 'right',
    fontSize: 11,
    marginTop: -20,
  },
  msgContent: {
    paddingTop: 5,
    color: 'white',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Users;
