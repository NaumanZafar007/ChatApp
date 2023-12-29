import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';

const ChatScreen2 = ({route}) => {
  const {user} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  console.log('Users 2 is ' + JSON.stringify(user.uid));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('messages')
          .doc(user.uid)
          .collection('thread')
          .orderBy('createdAt', 'desc')
          .get();
          console.log("MEssages is : "+querySnapshot)
        const loadedMessages = querySnapshot.docs.map((doc) => doc.data());
        console.log("MEssages is : "+loadedMessages)
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };

    fetchMessages();
  }, [user.uid]);


  const onSend = async (newMessages = []) => {
    // Send the message to Firestore
    await firestore()
      .collection('messages')
      .doc(user.uid)
      .collection('thread')
      .add(newMessages[0]);

    // Update the state to include the sent message
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Simulate receiving a message from the other side
    const responseMessage = {
      _id: Math.random().toString(),
      text: `You received: ${newMessages[0].text}`,
      createdAt: new Date(),
      user: {
        _id: user.uid,
        name: user.name, // Use the display name of the sender
      },
    };

    // Save the received message to Firestore
    await firestore()
      .collection('messages')
      .doc(user.currentUserid) // Replace with actual current user ID
      .collection('thread')
      .add(responseMessage);

    // Update the state to include the received message
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [responseMessage])
    );
  };

  // const handleSend = async () => {
  //   try {
  //     await firestore()
  //       .collection('messages')
  //       .add({
  //         text: newMessage,
  //         timestamp: firestore.FieldValue.serverTimestamp(),
  //         sentBy: await AsyncStorage.getItem('userUID'), // Replace with actual current user ID
  //         roomId: user.uid,
  //       });
  //     setNewMessage('');
  //   } catch (error) {
  //     console.error('Error sending message:', error.message);
  //   }
  // };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {/* <FlatList
        data={messages}
        keyExtractor={message => message.id}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: 'white',
              width: '40%',
              borderRadius: 20,
              margin: 20,
              borderWidth: 1,
              borderColor: 'gray',
            }}>
            <Text style={{color: 'black', margin: 10}}>{item.text}</Text>
          </View>
        )}
        style={{}}
      /> */}

      {/* New COde Start */}

      
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: AsyncStorage.getItem('userUID'),
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

      {/* End Code */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 14,
          marginBottom: 20,
        }}>
        <TextInput
          placeholder="Type your message"
          placeholderTextColor="#000"
          value={newMessage}
          style={{
            backgroundColor: 'white',
            width: '78%',
            borderRadius: 25,
            paddingHorizontal: 18,
            color: 'black',
          }}
          onChangeText={text => setNewMessage(text)}
        />
        <TouchableOpacity onPress={{}} style={styles.usersBtn}>
          <Text style={styles.usersText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen2;

const styles = StyleSheet.create({
  usersBtn: {
    width: '18%',
    backgroundColor: '#fb5b5a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usersText: {
    fontSize: 14,
    color: 'black',
  },
});
