import { React, useContext} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Token } from "../Context/TokenContext";

// Stack Screens
import WelcomeScreen from "../Screens/WelcomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";

// Drawer Screens
import HomeScreen from "../Screens/HomeScreen";
import FilesSharedWithScreen from "../Screens/FilesSharedWith";
import MyFilesScreen from "../Screens/MyFilesScreen";
import MySharedFilesScreen from "../Screens/MySharedFilesScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator 
      screenOptions={{ 
        headerShown: false,
        drawerActiveBackgroundColor: "#9BBEC7",
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#fff",
        drawerContentContainerStyle: {
          backgroundColor: "#4E95C3",
          flex: 1,
        },
        drawerLabelStyle:{
          fontSize: 17
        } 
        }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Files shared with" component={FilesSharedWithScreen} />
      <Drawer.Screen name="My files" component={MyFilesScreen} />
      <Drawer.Screen name="My shared files" component={MySharedFilesScreen} />
    </Drawer.Navigator>
  );
}
const MainNavigator =  () => {
  const { token } = useContext(Token);
  if (token.length < 1) {
    return <StackNavigator />;
   
  } else {
    return <DrawerNavigator />;
  }
};

export default MainNavigator;
