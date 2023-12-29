import React, {useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswaord, setShowPassword] = useState(true);
  console.log(email, password);

  const onPressLogin = async () => {
    if (email == null || email == '') {
      ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
    } else if (password == null || password == '') {
      ToastAndroid.show('Please Enter Password', ToastAndroid.SHORT);
    } else {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          console.log('Successfully Signed In', res.user.email);
          ToastAndroid.show('Successfully Signed In', ToastAndroid.SHORT);
          navigation.navigate('Root', { screen: 'Home' });
          AsyncStorage.setItem(
            'userToken',
            JSON.stringify(res.user.getIdToken()),
          );
          AsyncStorage.setItem('userUID', res.user.uid);
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            ToastAndroid.show('Email address is invalid', ToastAndroid.SHORT);
          }
          if (error.code === 'auth/invalid-credential') {
            console.log('Email or Password is Incorrect!');
            ToastAndroid.show(
              'Email or Password is Incorrect!',
              ToastAndroid.SHORT,
            );
          }
          console.error(error);
        });
    }
  };

  const clearValues = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login Screen</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmail(text.trim())}
          value={email}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
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
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.passwordbtn}
          onPress={() => setShowPassword(!showPasswaord)}>
          <Image
            source={require('../assets/EyeBall.png')}
            style={styles.passwordimg}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          onPressLogin(), Keyboard.dismiss();
        }}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.SignupBT}
        onPress={() => {
          navigation.navigate('SignUp'), Keyboard.dismiss(), clearValues();
        }}>
        <Text style={styles.forgotAndSignUpText}>Signup</Text>
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
    paddingBottom: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
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
  inputText: {
    height: 50,
    color: 'white',
    width: '90%',
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

export default Login;
