import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_FOLLOW, GET_USER_BY_ID, SEARCH_USER } from "../queries/queries";
import { useState } from "react";
import Loading from "../components/Loading";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import BoxAlert from "../components/BoxAlert";

function SearchPage() {
  // FETCH DATA
  const [search, setSearch] = useState("");

  const { data, loading, error } = useQuery(SEARCH_USER, {
    variables: { input: search },
  });

  const dataUser = data?.readUserByNameOrUsername;

  // FETCH DATA ID BUAT NANTI REFETCH
  const [userId, setUserId] = useState("");

  const fetchId = async () => {
    try {
      const loggedId = await SecureStore.getItemAsync("userId");
      setUserId(loggedId);
    } catch (error) {
      BoxAlert("Error!", error.message);
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchId();
    }, []),
  );

  // HANDLE FOLLOW
  const [
    addFollow,
    { data: dataFollow, loading: loadingFollow, error: errorFollow },
  ] = useMutation(ADD_FOLLOW, {
    onCompleted: () => {
      BoxAlert("Success!", `Following success.`);
    },
    refetchQueries: [
      { query: SEARCH_USER, variables: { input: "" } },
      {
        query: GET_USER_BY_ID,
        variables: {
          readUserByIdId: userId,
        },
      },
    ],
  });

  const handleFollow = async (id) => {
    try {
      await addFollow({
        variables: {
          inputCreateFollow: {
            followingId: id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  if (loading || loadingFollow) {
    return <Loading />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            autoComplete="off"
            autoCorrect={false}
            style={styles.input}
            placeholder="Search by username/name"
            onChangeText={(e) => setSearch(e)}
            value={search}
          />
        </View>

        <FlatList
          style={{ margin: 0, width: "100%" }}
          data={dataUser}
          // keyExtractor={(item) => {
          //   item._id;
          // }}
          renderItem={({ item }) => {
            return (
              <View style={styles.userContainer}>
                <Image
                  style={styles.userImage}
                  source={{
                    uri: item.imageUrl,
                  }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.userUsername}>@{item.username}</Text>
                  <Text style={styles.userFullname}>{item.name}</Text>
                </View>
                <View style={styles.followersContainer}>
                  <Text style={{ color: "gray" }}> Followers</Text>
                  <Text style={{ fontSize: 20, fontWeight: "700" }}>
                    {" "}
                    {item.followers.length}
                  </Text>
                </View>
                <Pressable
                  style={
                    item.isFollowedByLoggedUser
                      ? styles.followedButton
                      : styles.followButton
                  }
                  onPress={() => handleFollow(item._id)}
                  disabled={item.isFollowedByLoggedUser ? true : false}
                >
                  <Text style={styles.followText}>
                    {item.isFollowedByLoggedUser ? "followed" : "follow"}
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  // USER
  userContainer: {
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
    width: "100%",
    paddingVertical: 15,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  userImage: {
    aspectRatio: "1/1",
    height: 60,
    borderRadius: 100,
  },
  userUsername: {
    fontWeight: "700",
    fontSize: 15,
  },
  userFullname: {
    color: "gray",
    marginTop: 2,
    fontSize: 11,
  },
  followButton: {
    backgroundColor: "#FE2C55",
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    height: 40,
    marginHorizontal: 10,
    minWidth: "22%",
    maxWidth: "22%",
  },
  followText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 11,
  },
  followersContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  //
  followedButton: {
    backgroundColor: "#ff7b95",
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    height: 40,
    marginHorizontal: 10,
    minWidth: "22%",
    maxWidth: "22%",
  },

  // SEARCH
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});

export default SearchPage;
