import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ImagesPath} from '../assets/ImagesPath';

const Home = ({navigation}) => {
  const [users, setUsers] = useState(null);
  const [currentUserid, setCurrentUserid] = useState();
  const [oldMessages, setOldMessages] = useState();
  const [uniqueUsers, setUniqueUsers] = useState([]);
  //Auto Call Functions
  useEffect(() => {
    checkUserToken();
    getMess();
  }, []);
  // Check User
  const checkUserToken = async () => {
    try {
      const Token = await AsyncStorage.getItem('userToken');
      console.log('Available Token: ' + Token);
      if (!Token) {
        navigation.navigate('AuthStack', {screen: 'Login'});
      }
    } catch (error) {
      console.error('Error checking user token:', error.message);
    }
  };

  //Get recent users id
  const getDocumentIdsFromCollectionGroup = async () => {
    try {
      const querySnapshot = await firestore().collectionGroup('thread').get();

      const documentIds = querySnapshot.docs.map(doc => doc.data());

      return documentIds;
    } catch (error) {
      console.error('Error fetching document IDs:', error.message);
      throw error;
    }
  };

  //Get Users data by ID
  const getUsersByUIDs = async () => {
    try {
      const usersCollection = firestore().collection('users');

      // Use the "whereIn" query to filter documents based on UID array
      const querySnapshot2 = await usersCollection
        .where('uid', 'in', uniqueUsers)
        .get();

      const users = [];

      querySnapshot2.forEach(doc => {
        // Access the user data using doc.data()
        const user = doc.data();
        users.push(user);
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };
  //----------------------------------------------------------------
  useEffect(() => {
    getDocumentIdsFromCollectionGroup()
      .then(async documentIds => {
        const userID = await AsyncStorage.getItem('userUID');
        console.log('current use is: ' + userID);
        setCurrentUserid(userID);
        const u = documentIds.map(item => item.sentBy);
        const v = u.filter(item => item !== currentUserid);
        const uniqueValues = [...new Set(v)];
        setUniqueUsers(uniqueValues);
        const z = documentIds.map(item => item.text);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    //----------------------------------------------------------------

    getUsersByUIDs()
      .then(users => {
        setUsers(users);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const logout = async () => {
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
            navigation.navigate('AuthStack', {screen: 'Login'});
            ToastAndroid.show('Successfully Signed Out', ToastAndroid.SHORT);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userUID');
          } catch (error) {
            console.error('Error logging out:', error.message);
          }
        },
      },
    ]);
  };

  const getMess = async () => {
    const getLastMessageFromCollectionGroup = async () => {
      try {
        const collectionGroup = firestore().collectionGroup('thread');
    
        const querySnapshot = await collectionGroup.orderBy('createdAt', 'desc').limit(1).get();
        console.log("we are "+ querySnapshot)
        if (!querySnapshot.empty) {
          const lastMessage = querySnapshot.docs[0].data();
          return lastMessage;
        } else {
          return null; // No messages found
        }
      } catch (error) {
        console.error('Error fetching last message:', error.message);
        throw error;
      }
    };
    
    try {
      const lastMessage = await getLastMessageFromCollectionGroup();
      if (lastMessage) {
        console.log('Last Message:', lastMessage.text);
      } else {
        console.log('No messages found in the collection group.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={users}
        style={styles.Mlist}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatScreen', {
                name: item.name,
                uid: item.uid,
                currentUserid: currentUserid,
              })
            }>
            <View style={styles.card}>
              <Image style={[styles.userImageST]} source={ImagesPath.Users} />
              <View style={styles.txtArea}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.msgContent}>{item.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('UsersStack', {screen: 'Users'})}
        style={styles.usersBtn}>
        <Text style={styles.usersText}>+</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
        <Text style={styles.loginText}>LOGOUT</Text>
      </TouchableOpacity> */}
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
  usersBtn: {
    width: 50,
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  usersText: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '400',
  },
  logoutBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 24,
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
    fontSize: 15,
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

export default Home;
