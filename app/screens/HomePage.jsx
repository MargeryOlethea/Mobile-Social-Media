import { StyleSheet, View, Text } from "react-native";
import PostsList from "../components/PostsList";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../queries/queries";
import Loading from "../components/Loading";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import BoxAlert from "../components/BoxAlert";

function HomePage({ navigation }) {
  // FETCHING NAMA USER
  const [username, setUsername] = useState("");

  const fetchUsername = async () => {
    try {
      const loggedUsername = await SecureStore.getItemAsync("userUsername");
      setUsername(loggedUsername);
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsername();
    }, []),
  );

  // FETCHING DATA POST
  const { data, loading, error } = useQuery(GET_POSTS);
  const posts = data?.readPosts;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    BoxAlert("Error!", error.message);
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.username}>Hello @{username}!</Text>
        <Text style={styles.subtext}>Welcome to your feeds.</Text>
        <PostsList navigation={navigation} posts={posts} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  username: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 20,
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 19,
  },

  subtext: {
    marginLeft: 19,
    marginBottom: 19,
  },
});

export default HomePage;
