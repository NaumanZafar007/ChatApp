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
  const [currentUserid, setCurrentUserid] = useState(null);
  const [oldMessages, setOldMessages] = useState();
  const [uniqueUsers, setUniqueUsers] = useState([]);
  //Auto Call Functions
  useEffect(() => {
    checkUserToken();
    //--------------------------------------------------
  }, []);
  // Check User Token
  const checkUserToken = async () => {
    try {
      const Token = await AsyncStorage.getItem('userToken');
      console.log('Available Token: ' + Token);
      const current_User = await AsyncStorage.getItem('userUID');
      setCurrentUserid(current_User);
      if (!Token) {
        navigation.navigate('AuthStack', {screen: 'Login'});
      }
    } catch (error) {
      console.error('Error checking user token:', error.message);
    }
  };

  useEffect(() => {
    // Create a reference to the collection of user documents
    const usersCollectionRef = firestore().collection('messages');

    // Subscribe to real-time updates on the user collection
    const unsubscribe = usersCollectionRef.onSnapshot(querySnapshot => {
      if (!querySnapshot.empty) {
        const usersData = [];

        // Iterate through the user documents in the collection
        querySnapshot.forEach(userDoc => {
          const userData = userDoc.data();
          // Check if the user ID is not the current user's ID
          const fsuser = auth().currentUser.uid;
          console.log('fsuser is ' + JSON.stringify(fsuser));
          if (currentUserid == fsuser) {
            usersData.push({
              userId: userData.lastMessage.user._id,
              lastMessage: userData.lastMessage.text,
              receiver: userData.lastMessage.user.sendto,
              receiverName: userData.lastMessage.user.sendtoName,
            });
          }
        });

        // Get the last message from the array of users
        const lastMessageFromOthers =
          usersData.length > 0 ? usersData[0].lastMessage : null;
        const IdFromOthers = usersData.length > 0 ? usersData[0].userId : null;
        console.log(lastMessageFromOthers, IdFromOthers);
        setUsers(usersData);
      } else {
        // Handle the case where no user documents exist in the collection
        console.log('No user documents found.');
      }
    });
    //console.log(' Yse ', userMessages);
    return () => unsubscribe();
  }, [currentUserid]);

  //----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={users}
        style={styles.Mlist}
        keyExtractor={item => item.receiver}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatScreen', {
                user: {
                  name: item.receiverName,
                  uid: item.receiver,
                  currentUserid: currentUserid,
                },
              })
            }>
            <View style={styles.card}>
              <Image style={[styles.userImageST]} source={ImagesPath.Users} />
              <View style={styles.txtArea}>
                <Text style={styles.nameText}>{item.receiverName}</Text>
                <Text style={styles.msgContent}>{item.lastMessage}</Text>
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
