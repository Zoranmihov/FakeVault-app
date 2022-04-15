import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import axios from "axios";
import { TokenHook } from "../Context/TokenContext";
import { useIsFocused } from "@react-navigation/native";

const MySharedFilesScreen = () => {
  const isFocused = useIsFocused();
  let { token } = TokenHook();

  let [loaded, setLoad] = useState(false);
  let [files, setFiles] = useState(false);
  let [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get("https://fake-vault-back-end.herokuapp.com/api/mysharedfiles", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.files.length < 1) {
          setFiles(false);
          setLoad(true);
          return;
        }
        setFiles(res.data.files);
        setLoad(true);
      })
      .catch((err) => setLoad(true));
  }, [isFocused, reload]);

  let unShare = (name, type, email) => {
    let requestedFile = {
      name,
      type,
      email,
    };
    axios
      .post("https://fake-vault-back-end.herokuapp.com/api/unsharefile", requestedFile, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert(`You've stopped sharing this file with ${email}`);
        setReload(!reload);
      })
      .catch((err) => alert("Something went wrong please try again"));
  };

  return (
    <>
      {loaded ? (
        <>
          {files ? (
            <ScrollView >
              <View style={styles.container}>
                {files.map((file, index) => {
                  return (
                    <View key={index} style={styles.Fcontainer}>
                      <Text style={styles.FdText}>Name:</Text>
                      <Text style={styles.Ftext}>{file.name.slice(11)}</Text>
                      <Text style={styles.FdText}>Type:</Text>
                      <Text style={styles.Ftext}>{file.type}</Text>
                      <Text style={styles.FdText}>Shared with:</Text>
                      <ScrollView>
                        {file.shared_with.map((user, value) => {
                          return (
                            <View key={value * 100} style={styles.Factions}>
                              <Text style={styles.Ftext}>{user}</Text>
                              <Pressable
                                onPressIn={() =>
                                  unShare(file.name, file.type, user)
                                }
                                style={styles.Fbutton}
                              >
                                <Text style={styles.FbutText}>Unshare</Text>
                              </Pressable>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
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
    padding: 5,
  },

  Factions: {
    marginTop: 15,
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    flex: 1,
  },

  Fbutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "#4E95C3",
    borderRadius: 10,
    width: "32%",
  
  },

  FbutText: {
    fontSize: 16,
  },
});

export default MySharedFilesScreen;
