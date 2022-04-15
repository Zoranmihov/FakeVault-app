import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { React, useState } from "react";
import ProgressBar from "react-native-progress/Bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";

import { TokenHook } from "../Context/TokenContext";
import axios from "axios";



const HomeScreen = ({ navigation }) => {
  let formData = new FormData();
  FormData.prototype[Symbol.toStringTag] = "FormData";
  let { token } = TokenHook();
  let [doc, setDocument] = useState(false);
  let [description, setDescription] = useState(null);
  let [progress, setProgress] = useState(false);

  let choseFile = () => {
    DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    }).then(async (result) => {
      setDocument(result);
     let location = await FileSystem.getInfoAsync(result.uri);
     console.log(location);
    });
  };

  let uploadFile = () => {
    formData.append("description", description);
    formData.append("document", {
      uri: doc.uri,
      type: doc.mimeType,
      name: doc.name,
    });
    axios
      .post("https://fake-vault-back-end.herokuapp.com/api/fileupload", formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },

        onUploadProgress: function (progressEvent) {
          let value = Number((progressEvent.loaded / progressEvent.total).toFixed(1));
          setProgress(value);
        },
      })
      .then((res) => {
        alert("File uploaded succesfully");
        setProgress(false)
      })
      .catch((err) => {
        alert("Something went wrong please try again");
        setProgress(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload a file:</Text>
        <TextInput
          onChangeText={(input) => setDescription(input)}
          style={styles.input}
          placeholder="Enter a description"
        />

        {doc ? (
          <TextInput editable={false} style={styles.input} value={doc.name} />
        ) : null}

        <Pressable onPress={() => choseFile()} style={styles.button}>
          <Text style={styles.butText}>Chose a file</Text>
        </Pressable>
        <Pressable onPress={() => uploadFile()} style={styles.button}>
          <Text style={styles.butText}>Upload</Text>
        </Pressable>
        {progress ? (
          <ProgressBar
            color={"rgb(102, 51, 153)"}
            progress={progress}
            style={styles.test}
          />
        ) : null}
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

  test: {
    marginTop: 15,
    height: 8,
    width: "90%",
  },

  input: {
    padding: 5,
    margin: 10,
    width: "90%",
    color: "#000",
    backgroundColor: "#9BBEC7",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    padding: 7,
    backgroundColor: "#9BBEC7",
    marginTop: 12,
  },

  butText: {
    fontSize: 18,
  },
});

export default HomeScreen;
