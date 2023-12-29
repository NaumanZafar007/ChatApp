import {View, Text} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

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
    navigation.setOptions({headerTitle: route.params.user.name});
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
    <View style={{flex: 1, backgroundColor: '#000', paddingBottom: 10}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: currentUserid,
        }}
        messagesContainerStyle={{paddingVertical: 5, marginLeft: 5}}
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
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: 'white',
                borderRadius: 25,
                paddingHorizontal: 10,
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatScreen3;
