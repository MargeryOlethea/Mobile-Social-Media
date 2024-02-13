import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import dateConverter from "../helpers/dateConverter";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT, GET_POSTS, GET_POSTS_BY_USER } from "../queries/queries";
import Loading from "./Loading";
import BoxAlert from "./BoxAlert";

function CommentModal({ closeComment, commentVisible, comments, id }) {
  // FETCH FOTO USER
  const [image, setImage] = useState();
  const fetchImage = async () => {
    try {
      const loggedImage = await SecureStore.getItemAsync("userImage");
      setImage(loggedImage);
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [comments]);

  // INPUT COMMENT DATA
  const [comment, setComment] = useState("");

  // HANDLE COMMENT
  const [addComment, { data, loading, error }] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_POSTS }, { query: GET_POSTS_BY_USER }],
  });

  const handleComment = async () => {
    try {
      await addComment({ variables: { postId: id, content: comment } });
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* COMMENT MODAL */}
      <Modal animationType="slide" transparent={true} visible={commentVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ justifyContent: "flex-end", height: "100%" }}>
            <Pressable
              style={{ height: "40%" }}
              onPress={closeComment}
            ></Pressable>
            <View style={{ backgroundColor: "white", height: "60%" }}>
              {/* HEADER */}
              <View style={styles.commentHeaderContainer}>
                <Text style={{ textAlign: "center", width: "95%" }}>
                  {comments.length === 0
                    ? "0 comment"
                    : `${comments.length} comments`}
                </Text>
                <Pressable onPress={closeComment}>
                  <Ionicons name={"close"} size={20} />
                </Pressable>
              </View>

              {comments.length === 0 ? (
                <>
                  <View
                    style={{
                      height: "73%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Be the first to comment!</Text>
                  </View>
                </>
              ) : (
                <FlatList
                  data={comments}
                  // keyExtractor={(_item, index) => {
                  //   index;
                  // }}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.commentContainer}>
                        <Ionicons
                          name={"person-circle"}
                          size={40}
                          color="#ff8fa5"
                        />
                        <View style={styles.textContainer}>
                          <Text
                            style={{
                              color: "gray",
                              fontSize: 15,
                              marginBottom: 3,
                            }}
                          >
                            {item.username}
                          </Text>
                          <Text style={styles.commentInput}>
                            {item.content}
                          </Text>
                          <Text style={{ fontSize: 12, color: "gray" }}>
                            {dateConverter(item.createdAt)}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              )}

              {/* COMMENT FORM */}
              <View
                style={{
                  height: "16%",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 25,
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{ aspectRatio: "1/1", height: 40, borderRadius: 100 }}
                  source={{
                    uri: image,
                  }}
                />
                <TextInput
                  autoComplete="off"
                  autoCorrect={false}
                  style={{
                    backgroundColor: "#e6e6e6",
                    width: "85%",
                    borderRadius: 100,
                    height: 40,
                    paddingHorizontal: 20,
                  }}
                  onChangeText={(e) => {
                    setComment(e);
                  }}
                  value={comment}
                  onSubmitEditing={() => {
                    handleComment(), setComment("");
                  }}
                  placeholder="Add comment..."
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // COMMENT
  commentHeaderContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  commentContainer: {
    flexDirection: "row",
    padding: 15,
  },
  textContainer: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  commentInput: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 10,
    maxWidth: "95%",
  },
});

export default CommentModal;
