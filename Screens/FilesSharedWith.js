import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Linking from "expo-linking";

import axios from "axios";
import { TokenHook } from "../Context/TokenContext";
import { useIsFocused } from "@react-navigation/native";

const FilesSharedWithScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  let { token } = TokenHook();

  let [loaded, setLoad] = useState(false);
  let [files, setFiles] = useState(false);
  let [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get("https://fake-vault-back-end.herokuapp.com/api/filessharedwith", {
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

  let downloadFile = (name, description) => {
    let requestedFile = {
      name,
      description,
      mobile: true,
      shared_file: true
    };
    
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
  };

  let Unfollow = (name, description, by_user) => {
    let requestedFile = {
      name,
      description,
      by_user,
    };
    axios
    .post("https://fake-vault-back-end.herokuapp.com/api/unfollow", requestedFile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      alert(`You've unfollwed the file: ${name.slice(11)}`)
      setReload(!reload)
    }).catch(err => alert("Something went wrong please try again"))
  }

  return (
    <>
      {loaded ? (
        <>
          {files ? (
              <View style={styles.container}>
            <ScrollView >
                {files.map((file, index) => {
                  return (
                    <View key={index} style={styles.Fcontainer}>
                      <Text style={styles.FdText}>Name:</Text>
                      <Text style={styles.Ftext}>{file.name.slice(11)}</Text>
                      <Text style={styles.FdText}>Description:</Text>
                      <Text style={styles.Ftext}>{file.description}</Text>
                      <Text style={styles.FdText}>Type:</Text>
                      <Text style={styles.Ftext}>{file.type}</Text>
                      <Text style={styles.FdText}>Uploaded by:</Text>
                      <Text style={styles.Ftext}>{file.by_user}</Text>
                      <View style={styles.Factions}>
                        <Pressable
                          onPressIn={() => downloadFile(file.name, file.description)}
                          style={styles.Fbutton}
                        >
                          <Text style={styles.FbutText}>Download</Text>
                        </Pressable>

                        <Pressable
                          onPressIn={() => Unfollow(file.name, file.description, file.by_user)}
                          style={styles.Fbutton}
                        >
                          <Text style={styles.FbutText}>Unfollow</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
              </View>
          ) : (
            <View style={styles.container}>
              <Text style={styles.Ftext}>No files were found</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.container}>
          <Text style={styles.Ftext}>Loading...</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    backgroundColor: "#4E95C3",
  },

  Fcontainer: {
    width: "95%",
    backgroundColor: "#9BBEC7",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    flex: 1
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
    padding: 5,
  },

  Factions: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },

  Fbutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "#4E95C3",
    borderRadius: 10,
    width: "32%",
    height: "40%",
  },

  FbutText: {
    fontSize: 16,
  },
});

export default FilesSharedWithScreen;
