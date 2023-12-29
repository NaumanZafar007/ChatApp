import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import ChatScreen from '../screens/ChatScreen';
import Users from '../screens/Users';
import ChatScreen2 from '../screens/ChatScreen2';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Logout from '../components/Logout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Image} from 'react-native';
import {ImagesPath} from '../assets/ImagesPath';
import ChatScreen3 from '../screens/ChatScreen3';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const ChatsStack = () => (
  <Stack.Navigator initialRouteName="ChatUsers">
    <Stack.Screen
      name="ChatUsers"
      component={Home}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ChatScreen"
      component={ChatScreen}
      options={{headerTitle: 'ChatBox'}}
    />
  </Stack.Navigator>
);

const UsersStack = () => (
  <Stack.Navigator initialRouteName="Users">
    <Stack.Screen
      name="Users"
      component={Users}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ChatScreen3"
      component={ChatScreen3}
      options={{headerTitle: 'ChatBox'}}
    />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      component={Login}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignUp"
      component={Signup}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={() => ({
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#58ceb2',
      tabBarStyle: {
        paddingVertical: 5,
        backgroundColor: '#fb5b5a',
        height: 50,
      },
      tabBarLabelStyle: {paddingBottom: 3, fontSize: 12, fontWeight: '600'},
    })} initialRouteName='ChatsStack'>
    <Tab.Screen
      name="ChatsStack"
      component={ChatsStack}
      options={{
        headerShown: false,
        tabBarLabel: 'Chats',
        tabBarIcon: () => (
          <Image source={ImagesPath.Messages} style={{height: 28, width: 32}} />
        ),
      }}
    />
    <Tab.Screen
      name="UsersStack"
      component={UsersStack}
      options={{
        headerShown: false,
        tabBarLabel: 'Users',
        tabBarIcon: () => (
          <Image source={ImagesPath.UsersTab} style={{height: 22, width: 28}} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Root = () => {
  return (
    <Drawer.Navigator drawerContent={props => <Logout {...props} />} initialRouteName='Home'>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          title: 'Chats App',
          headerStyle: {
            backgroundColor: '#fb5b5a',
          },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          component={Root}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
