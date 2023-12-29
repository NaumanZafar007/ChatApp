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
    //--------------------------------------------------
  }, []);
  useFocusEffect(() => {
    getDocumentIdsFromCollectionGroup()
      .then(async documentIds => {
        const userID = await AsyncStorage.getItem('userUID');
        setCurrentUserid(userID);
        if(documentIds){
          const sender = documentIds.map(item => item.sentBy);
          const filterUser = sender.filter(item => item !== userID);
          const uniqueValues = [...new Set(filterUser)];
          setUniqueUsers(uniqueValues);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  // Check User Token
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

  useEffect(() => {
    if (uniqueUsers.length != 0) {
      getUsersByUIDs()
        .then(users => {
          setUsers(users);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [uniqueUsers]);

  //Get Users data by ID
  const getUsersByUIDs = async () => {
    try {
      const usersCollection = firestore().collection('users');
      const querySnapshot2 = await usersCollection
        .where('uid', 'in', uniqueUsers)
        .get();

      const users = [];

      querySnapshot2.forEach(doc => {
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
  //----------------------------------------------------------------

  const getMess = async () => {};

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
                user: {
                  name: item.name,
                  uid: item.uid,
                  currentUserid: currentUserid,
                },
              })
            }>
            <View style={styles.card}>
              <Image style={[styles.userImageST]} source={ImagesPath.Users} />
              <View style={styles.txtArea}>
                <Text style={styles.nameText}>{item.name}</Text>
                {/* <Text style={styles.msgContent}>{item}</Text> */}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('UsersStack', {screen: 'Users'})}
        style={styles.usersBtn}>
        <Text style={styles.usersText}>+</Text>
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
    marginHorizontal: 26,
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
