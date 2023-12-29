import {View, Text} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  //const [currentUserid, setCurrentUserid] = useState();
  const {uid, currentUserid} = route.params;

  console.log('Current Params ' + uid, 'Current user ' + currentUserid);

  const allMessages = async () => {
    const docid =
      uid > currentUserid
        ? currentUserid + '-' + uid
        : uid + '-' + currentUserid;

    console.log('Docid is ' + docid);
    const messRes = await firestore()
      .collection('Chats')
      .doc(docid)
      .collection('messages')
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

  useEffect(() => {
    navigation.setOptions({headerTitle: route.params.name});
    allMessages();
  }, [messages]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),

  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar:
  //           'https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg',
  //       },
  //       image:
  //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRAMkUpED3WOWbmK7e0mU9L5j8weSF6gKRId7S4-LhTw&s',
  //       audio:
  //       'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  //     },
  //   ])
  // }, []);

  // // const onSend = useCallback((messages = []) => {
  // //   setMessages(previousMessages =>
  // //     GiftedChat.append(previousMessages, messages),
  // //   );
  // // }, []);

  const onSend = useCallback(msgArray => {
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
      .collection('Chats')
      .doc(chatid)
      .collection('messages')
      .add({...usermsg, createdAt: firestore.FieldValue.serverTimestamp()});
  });

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: currentUserid,
        }}
        messagesContainerStyle={{paddingVertical: 7, marginLeft: 5}}
        imageStyle={{margin: 5}}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#009387',
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
                borderWidth: 1.5,
                borderRightColor: '#009387',
                borderLeftColor: '#009387',
                backgroundColor: '#0000',
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatScreen;
