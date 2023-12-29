import {View, Text, Image} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import { ImagesPath } from '../assets/ImagesPath';

const CustomSendButton = props => {
  return (
    <Send {...props} containerStyle={{justifyContent: 'center', marginHorizontal: 5}}>
      <Image
        source={ImagesPath.SendButton}
        style={{alignSelf: 'center',height: 30, width: 30}}
      />
    </Send>
  );
};

const ChatScreen3 = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  //const [currentUserid, setCurrentUserid] = useState();
  const {uid, currentUserid} = route.params.user;

  console.log('Current Params ' + uid, 'Current user ' + currentUserid);

  const allMessages = async () => {
    const docid =
      uid > currentUserid
        ? currentUserid + '-' + uid
        : uid + '-' + currentUserid;

    console.log('Docid is ' + docid);
    const messRes = await firestore()
      .collection('messages')
      .doc(docid)
      .collection('thread')
      .orderBy('createdAt', 'desc')
      .get();
    const allMessages = messRes.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allMessages);
  };

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.user.name,
      tabBarVisible: false,
    });
    allMessages();
  });

  const onSend = msgArray => {
    const msg = msgArray[0];
    const usermsg = {
      ...msg,
      sentBy: currentUserid,
      sentTo: uid,
      createdAt: new Date(),
    };
    console.log(usermsg.sentBy, usermsg.sentTo, usermsg.createdAt);

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, usermsg),
    );
    const chatid =
      uid > currentUserid
        ? currentUserid + '-' + uid
        : uid + '-' + currentUserid;

    firestore()
      .collection('messages')
      .doc(chatid)
      .collection('thread')
      .add({...usermsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000', paddingBottom: 20}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: currentUserid,
        }}
        messagesContainerStyle={{paddingVertical: 5}}
        imageStyle={{margin: 5}}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#fb5b5a',
                  marginVertical: 2,
                  marginRight: 5,
                },
              }}
            />
          );
        }}
        renderSend={props => <CustomSendButton {...props} />}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: 'white',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingTop: 3,
                width: '90%',
                marginHorizontal: '5%'
              }}
              textInputStyle={{
                fontSize: 15,
                color: '#000',
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatScreen3;
