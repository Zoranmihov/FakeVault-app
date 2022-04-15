import { React, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => navigation.replace("Login"), 1700);
  });

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={{
          uri: "https://media.istockphoto.com/vectors/open-vault-vector-id1049662238?k=20&m=1049662238&s=612x612&w=0&h=4VU9Z4_B2SmxPLOpKwY33VA8dRtDg4Bj-EbpiXyqeXU=",
        }}
      />
      <Text style={styles.txt}>
        Welcome to your own personal vault. A free online storage space for your
        files.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4E95C3",
  },

  img: {
    width: 235,
    height: 235,
    resizeMode: "center",
  },

  txt: {
    fontSize: 16,
  },
});

export default WelcomeScreen;
