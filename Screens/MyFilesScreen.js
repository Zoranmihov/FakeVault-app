import { React, useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Linking from "expo-linking";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from "react-native";

import { TokenHook } from "../Context/TokenContext";
import axios from "axios";

const MyFilesScreen = () => {
  const isFocused = useIsFocused();
  let { token } = TokenHook();

  let [loaded, setLoad] = useState(false);
  let [files, setFiles] = useState(false);
  let [doc, setDoc] = useState();
  let [reload, setReload] = useState(false);
  let [isVisible, setIsVisible] = useState(false);
  let [email, setEmail] = useState();

  useEffect(() => {
    axios
      .get("https://fake-vault-back-end.herokuapp.com/api/myuploadedfiles", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if(res.data.files.length < 1){
          setFiles(false);
          setLoad(true);
          return
        }
        setFiles(res.data.files);
        setLoad(true);
      })
      .catch((err) => setLoad(true));
  }, [isFocused, reload]);

  const wait = () => {
    if (email.length < 1) {
      setEmail("");
      alert("Please enter a vaild email adress");
      setIsVisible(false);
      return;
    }
    doc.email = email;
    console.log("It got here");
    axios
      .post("https://fake-vault-back-end.herokuapp.com/api/sharefile", doc, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Tried to share");
        alert("This file is shared with the user");
        setEmail("");
        setIsVisible(false);
      })
      .catch((err) => {
        alert("Something went wrong please try again");
        console.log(err.data);
        setEmail("");
        setIsVisible(false);
      });
  };

  const MyFilesActions = (name, description, action) => {
    let requestedFile = {
      name: name,
      description: description,
    };
    switch (action) {
      case "download":
        requestedFile.mobile = true;
        axios
          .post("https://fake-vault-back-end.herokuapp.com/api/downloadfile", requestedFile, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async (res) => {
            if (res.data.type.includes("application")) {
              possible = await Linking.canOpenURL(res.data.url);
              if (possible) {
                Linking.openURL(res.data.url);
              } else {
                alert("Link failed to open");
              }
            } else {
              let downloadedFile = await FileSystem.downloadAsync(
                res.data.url,
                `${FileSystem.documentDirectory}${res.data.name}`
              );
              MediaLibrary.requestPermissionsAsync()
                .then(async (res) => {
                  const asset = await MediaLibrary.createAssetAsync(
                    downloadedFile.uri
                  );
                  alert(
                    "Due to the incompetence of the developer, your file is saved in your DCIM folder"
                  );
                  FileSystem.deleteAsync(downloadedFile.uri);
                })
                .catch((err) => console.log("Error: ", err));
            }
          })
          .catch((err) => {
            console.log("Failed", err);
            alert("Response failed something is up with the server");
          });

        break;

      case "delete":
        axios
          .post("https://fake-vault-back-end.herokuapp.com/api/deletefile", requestedFile, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            alert("File was deleted");
            setReload(!reload);
          })
          .catch((err) => {
            alert("Something went wrong please try again later");
          });
        break;

      case "share":
        setIsVisible(true);
        setDoc(requestedFile);
        break;
    }
  };

  return (
    <>
      {loaded ? 
      (
        <>
        {files ? (
          <ScrollView>
          <View style={styles.container}>
            {files
              ? files.map((file, index) => {
                  return (
                    <View key={index} style={styles.Fcontainer}>
                      <Text style={styles.FdText}>Name:</Text>
                      <Text style={styles.Ftext}>{file.name.slice(11)}</Text>
                      <Text style={styles.FdText}>Description:</Text>
                      <Text style={styles.Ftext}>{file.description}</Text>
                      <Text style={styles.FdText}>Type:</Text>
                      <Text style={styles.Ftext}>{file.type}</Text>
                      <View style={styles.Factions}>
                        <Pressable
                          onPressIn={() =>
                            MyFilesActions(
                              file.name,
                              file.description,
                              "download"
                            )
                          }
                          style={styles.Fbutton}
                        >
                          <Text style={styles.FbutText}>Download</Text>
                        </Pressable>
                        <Pressable
                          onPressIn={() =>
                            MyFilesActions(
                              file.name,
                              file.description,
                              "delete"
                            )
                          }
                          style={styles.Fbutton}
                        >
                          <Text style={styles.FbutText}>Delete</Text>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            MyFilesActions(file.name, file.description, "share")
                          }
                          style={styles.Fbutton}
                        >
                          <Text style={styles.FbutText}>Share</Text>
                        </Pressable>
                      </View>
                      <Modal
                        style={styles.modal}
                        transparent={true}
                        animationType="fade"
                        visible={isVisible}
                      >
                        <View style={styles.modal}>
                          <View style={styles.mView}>
                            <TextInput
                              style={styles.input}
                              placeholder="Email"
                              value={email}
                              onChangeText={(input) => setEmail(input)}
                            />
                            <View style={styles.mActions}>
                              <Pressable
                                onPressIn={() => wait()}
                                style={styles.Mbutton}
                              >
                                <Text style={styles.FbutText}>Share</Text>
                              </Pressable>
                              <Pressable
                                onPressIn={() => {
                                  setDoc(""), setEmail(""), setIsVisible(false);
                                }}
                                style={styles.Mbutton}
                              >
                                <Text style={styles.FbutText}>Cancel</Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
        ) : <View style={styles.container}>
            <Text style={styles.Ftext}>No files were found</Text>
          </View>}
        </>
      ) : <View style={styles.container}>
            <Text style={styles.Ftext}>Loading...</Text>
          </View>}
    </>
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

  butText: {
    position: "relative",
    top: 0,
    left: 0,
    fontSize: 18,
  },

  Fcontainer: {
    width: "95%",
    backgroundColor: "#9BBEC7",
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },

  FdText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },

  Ftext: {
    fontSize: 16,
  },

  Factions: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },

  Fbutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    backgroundColor: "#4E95C3",
    borderRadius: 10,
    width: "32%",
  },

  FbutText: {
    fontSize: 16,
  },

  modal: {
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  mView: {
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    width: "95%",

    backgroundColor: "#4E95C3",
  },

  mActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  Mbutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    marginTop: 10,
    backgroundColor: "#9BBEC7",
    borderRadius: 6,
    width: "32%",
  },

  input: {
    padding: 5,
    margin: 10,
    width: "90%",
    backgroundColor: "#9BBEC7",
  },
});

export default MyFilesScreen;
