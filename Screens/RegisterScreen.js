import { React, useState } from "react";
import axios from "axios";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [isValidEmail, setIsValidEmail] = useState(true);
  let [password, setPassword] = useState("");
  let [isValidPassword, setIsValidPassword] = useState(true);
  // /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/ <=== Regex  pattern for password

  // Functions
  let validateEmail = () => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = regex.test(email);
    if (valid) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  let validatePassword = () => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    let valid = regex.test(email);
    if (valid) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  };

  let register = () => {
    if (name.length < 1 && email.length < 1 && password.length < 8) {
      alert("Please properly fill out the required information");
      return;
    } else {
      axios
        .post("https://fake-vault-back-end.herokuapp.com/api/register", { name, email, password })
        .then((res) => {
          alert("Worked");
          navigation.navigate("Login");
        })
        .catch((err) => alert(err.data.message));
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.container}>
          <Text style={styles.title}>Register:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(input) => setName(input)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(input) => setEmail(input)}
            onEndEditing={() => validateEmail()}
          />
          {isValidEmail ? null : (
            <Text style={styles.errText}>Invalid email</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(input) => setPassword(input)}
            onEndEditing={() => validatePassword()}
          />
          {isValidPassword ? null : (
            <Text style={styles.errText}>
              Passwords must be between 8 and 16 characters and contain the
              following: uppercase letters, lowercase letters, numbers, and
              symbols
            </Text>
          )}
          <Pressable onPress={() => register()} style={styles.button}>
            <Text style={styles.butText}>Sign Up</Text>
          </Pressable>
          <Text style={styles.link}>
            By clicking Sign Up, you agree to our Terms.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: 20,
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

  errText: {
    fontSize: 16,
    color: "#b72424",
  },

  link: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default RegisterScreen;
