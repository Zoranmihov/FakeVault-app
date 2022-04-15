import "react-native-gesture-handler";
import { React, useState } from "react";
import { StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { Token } from "./Context/TokenContext";


// Navgiators
import MainNavigator from "./Navigators/MainNavigator";


export default function App() {
  let [token, setToken] = useState("");
  return (
    <Token.Provider value={{ token, setToken }}>
      <NavigationContainer>
      <StatusBar backgroundColor={'black'} barStyle="light-content" />
        <MainNavigator />
      </NavigationContainer>
    </Token.Provider>
  );
}
