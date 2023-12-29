import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ImagesPath} from '../assets/ImagesPath';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [showPasswaord, setShowPassword] = useState(true);
  console.log(email, password);

  const onPressSignUp = async () => {
    if (name == null || name == '') {
      ToastAndroid.show('Please Enter Name', ToastAndroid.SHORT);
    } else if (email == null || email == '') {
      ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
    } else if (password == null || password == '') {
      ToastAndroid.show('Please Enter Password', ToastAndroid.SHORT);
    } else {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.log('Successfully Account Created');
          firestore().collection('users').doc(response.user.uid).set({
            name: name,
            email: response.user.email,
            uid: response.user.uid,
          });
          ToastAndroid.show('Successfully Account Created', ToastAndroid.SHORT);
          navigation.navigate('Login');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            ToastAndroid.show(
              'That email address is already in use',
              ToastAndroid.SHORT,
            );
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            ToastAndroid.show('Email address is invalid', ToastAndroid.SHORT);
            console.log('That email address is invalid!');
          }
          if (error.code === 'auth/weak-password') {
            ToastAndroid.show(
              'Password should be at least 6 characters',
              ToastAndroid.SHORT,
            );
            console.log('Password should be at least 6 characters');
          }
          console.error(error);
        });
    }
  };

  const clearValues = useCallback(() => {
    setEmail('');
    setPassword('');
    setName('');
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}> SignUp Screen</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name"
          placeholderTextColor="#003f5c"
          onChangeText={text => {
            const validatedName = text.replace(/\s+/g, ' ');
            setName(validatedName);
          }}
          value={name}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmail(text.trim())}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputViewPass}>
        <TextInput
          style={styles.inputText}
          secureTextEntry={showPasswaord}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={text => setPassword(text.trim())}
          value={password}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.passwordbtn}
          onPress={() => setShowPassword(!showPasswaord)}>
          <Image source={ImagesPath.EyeBall} style={styles.passwordimg} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          onPressSignUp(), Keyboard.dismiss();
        }}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.SignupBT}
        onPress={() => {
          navigation.navigate('Login'), Keyboard.dismiss(), clearValues();
        }}>
        <Text style={styles.forgotAndSignUpText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 38,
    color: '#fb5b5a',
    marginBottom: 50,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#3AB4BA',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputViewPass: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#3AB4BA',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  passwordbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  passwordimg: {
    height: 25,
    width: 25,
  },
  inputText: {
    height: 50,
    color: 'white',
    width: '90%',
  },
  SignupBT: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
    marginTop: 20,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: 15,
    textDecorationLine: 'underline',
    paddingHorizontal: 20,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default Signup;
