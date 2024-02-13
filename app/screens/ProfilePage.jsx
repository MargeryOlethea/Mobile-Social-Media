import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import PostsList from "../components/PostsList";
import { FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER, GET_USER_BY_ID } from "../queries/queries";
import Loading from "../components/Loading";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import BoxAlert from "../components/BoxAlert";

function ProfilePage({ navigation }) {
  // HANDLE LOGOUT
  const { setIsLoggedIn } = useContext(LoginContext);
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("userUsername");
      await SecureStore.deleteItemAsync("userImage");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH DATA HEADER
  const [id, setId] = useState("");

  const fetchId = async () => {
    try {
      const loggedId = await SecureStore.getItemAsync("userId");
      setId(loggedId);
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  const {
    data: dataUser,
    loading: loadingUser,
    error: errorUser,
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      readUserByIdId: id,
    },
  });

  if (errorUser) {
    BoxAlert("Error!", errorUser.message);
  }

  const dataHeader = dataUser?.readUserById;

  useFocusEffect(
    React.useCallback(() => {
      fetchId();
    }, []),
  );

  // FETCH DATA POSTS
  const { data, loading, error } = useQuery(GET_POSTS_BY_USER);
  const posts = data?.readPostByUser;

  if (loadingUser || loading) {
    return <Loading />;
  }

  if (error) {
    BoxAlert("Error!", error.message);
  }
  return (
    <>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerName}>{dataHeader?.name}</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* PROFILE */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: dataHeader?.imageUrl,
          }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>@{dataHeader?.username}</Text>

        {/* FOLLOW INFO */}
        <View style={styles.followInfoWrapper}>
          <View style={styles.followInfo}>
            <Text style={styles.followNumber}>
              {dataHeader?.followings?.length}
            </Text>
            <Text style={styles.followText}>Following</Text>
          </View>
          <View style={styles.verticleLine}></View>
          <View style={styles.followInfo}>
            <Text style={styles.followNumber}>
              {dataHeader?.followers?.length}
            </Text>
            <Text style={styles.followText}>Followers</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <FontAwesome name={"bars"} size={18} style={styles.icon} />
          <FontAwesome name={"chevron-right"} size={10} style={styles.icon} />
        </View>
      </View>

      {posts?.length > 0 ? (
        <PostsList posts={posts} navigation={navigation} />
      ) : (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              backgroundColor: "white",
              borderTopColor: "#e3e3e3",
              borderTopWidth: 1,
            }}
          >
            <Text>No post yet!</Text>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  //header
  headerContainer: {
    backgroundColor: "white",
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 40,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#FE2C55",
    padding: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
  },

  //user
  profileContainer: {
    backgroundColor: "white",
    padding: 15,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
  },
  followInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  followInfo: {
    alignItems: "center",
  },
  followText: {
    color: "gray",
    fontSize: 12,
  },
  followNumber: {
    fontWeight: "700",
    fontSize: 18,
  },
  verticleLine: {
    height: 25,
    width: 1,
    backgroundColor: "#d4d4d4",
    marginHorizontal: 15,
  },
  profilePic: {
    aspectRatio: "1/1",
    height: 80,
    borderRadius: 100,
    marginBottom: 15,
  },
  icon: { transform: [{ rotate: "90deg" }], marginTop: 10 },
});

export default ProfilePage;
