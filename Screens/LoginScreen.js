import { React, useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import axios from "axios";

import { Token, TokenHook } from "../Context/TokenContext";
const LoginScreen = ({ navigation }) => {
  let { token, setToken } = TokenHook();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let login = () => {
    console.log("Ran");
    axios
      .post("https://fake-vault-back-end.herokuapp.com/api/login", {
        email,
        password,
        mobile: true,
      })
      .then((res) => {
        setToken(res.data.token);
        navigation.navigate("Login");
      })
      .catch((err) => {
        alert(err.data.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>Login:</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={(input) => setEmail(input)}
        />
        <TextInput
          onChangeText={(input) => setPassword(input)}
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
        />
        <Pressable onPress={() => login()} style={styles.button}>
          <Text style={styles.butText}>Login</Text>
        </Pressable>
        <Text
          style={styles.link}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          Don't have an account? Click here to register
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#4E95C3",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    backgroundColor: "#4E95C3",
  },

  title: {
    fontSize: 20,
  },

  input: {
    padding: 5,
    margin: 10,
    width: "90%",
    backgroundColor: "#9BBEC7",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    padding: 7,
    backgroundColor: "#9BBEC7",
    marginTop: 8,
  },

  butText: {
    fontSize: 18,
  },

  link: {
    marginTop: 30,
    fontSize: 18,
  },
});

export default LoginScreen;
