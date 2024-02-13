import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Pressable,
  Modal,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import CommentModal from "../components/CommentModal";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_LIKE,
  GET_POSTS,
  GET_POSTS_BY_USER,
  GET_POST_BY_ID,
} from "../queries/queries";
import Loading from "../components/Loading";
import BoxAlert from "../components/BoxAlert";

function PostDetailPage({ route }) {
  // FETCH DATA
  const { id } = route.params;
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      readPostByIdId: id,
    },
  });

  const postData = data?.readPostById;

  //MODAL COMMENT
  const [commentVisible, setCommentVisible] = useState(false);

  const openComment = () => {
    setCommentVisible(true);
  };

  const closeComment = () => {
    setCommentVisible(false);
  };

  //HANDLE SHARE
  const [shareCount, setShareCount] = useState(0);
  const [shareStatus, setShareStatus] = useState(false);
  const handleShare = () => {
    if (!shareStatus) {
      setShareCount(shareCount + 1);
    }
    setShareStatus(!shareStatus);
  };

  // HANDLE SAVE
  const [saveCount, setSaveCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState(false);
  const handleSave = () => {
    if (!saveStatus) {
      setSaveCount(saveCount + 1);
    }
    setSaveStatus(!saveStatus);
  };

  // HANDLE LIKE
  const [likeStatus, setLikeStatus] = useState(false);
  const [addLike, { data: dataLike }] = useMutation(ADD_LIKE, {
    refetchQueries: [
      { query: GET_POSTS },
      { query: GET_POSTS_BY_USER },
      { query: GET_POST_BY_ID, variables: { readPostByIdId: id } },
    ],
  });

  const handleLike = async () => {
    try {
      if (!likeStatus) {
        await addLike({
          variables: {
            postId: id,
          },
        });
      }
      setLikeStatus(!likeStatus);
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  const window = Dimensions.get("window");

  if (loading) {
    return <Loading />;
  }

  if (postData) {
    return (
      <>
        <ImageBackground
          style={(styles.image, { height: window.height - 80 })}
          source={{
            uri: postData?.imgUrl,
          }}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={[
              "rgba(0,0,0,0.3)",
              "transparent",
              "transparent",
              "rgba(0,0,0,0.6)",
            ]}
            style={styles.gradientBackground}
          >
            <View style={styles.bottomContainer}>
              <Text style={styles.username}>@{postData?.author?.username}</Text>
              <Text style={styles.description}>
                {postData?.content}

                {postData.tags.length > 0 &&
                  postData?.tags?.map((tag) => {
                    return <Text style={styles.hashtag}>{`#${tag}`} </Text>;
                  })}
              </Text>
              <Text style={styles.translation}>See translation</Text>
              <View style={styles.musicContainer}>
                <Ionicons name={"musical-notes"} size={15} color={"white"} />
                <Text style={styles.description}>
                  @{postData.author.username} Original Sound
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <CommentModal
          closeComment={closeComment}
          commentVisible={commentVisible}
          comments={postData?.comments}
          id={id}
        />
        <View style={styles.sideContainer}>
          <Image
            source={{
              uri: postData.author.imageUrl,
            }}
            style={{
              height: 55,
              borderRadius: 100,
              aspectRatio: "1/1",
              borderColor: "white",
              borderWidth: 1,
            }}
          />

          <View style={styles.iconWrapper}>
            <Pressable onPress={handleLike}>
              <Ionicons
                name={"heart"}
                color={likeStatus ? "#D10000" : "white"}
                size={40}
              />
            </Pressable>
            <Text style={styles.sideText}>{postData.likes.length}</Text>
          </View>

          <View style={styles.iconWrapper}>
            <Pressable onPress={openComment}>
              <Ionicons
                name={"chatbubble-ellipses-sharp"}
                color={"white"}
                size={35}
              />
            </Pressable>
            <Text style={styles.sideText}>{postData.comments.length}</Text>
          </View>

          <View style={styles.iconWrapper}>
            <Pressable onPress={handleSave}>
              <Ionicons
                name={"bookmark"}
                color={saveStatus ? "#FFEA00" : "white"}
                size={38}
              />
              <Text style={styles.sideText}>{saveCount}</Text>
            </Pressable>
          </View>

          <View style={styles.iconWrapper}>
            <Pressable onPress={handleShare}>
              <Ionicons
                name={"arrow-redo"}
                color={shareStatus ? "#FE2C55" : "white"}
                size={40}
              />
              <Text style={styles.sideText}>{shareCount}</Text>
            </Pressable>
          </View>

          <Ionicons name={"disc"} color={"white"} size={40} />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  // POST
  sideContainer: {
    position: "absolute",
    right: "2%",
    bottom: "2%",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  iconWrapper: {
    alignItems: "center",
    flexDirection: "column",
  },
  sideText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  gradientBackground: {
    padding: 15,
    flex: 1,
  },
  bottomContainer: {
    width: "80%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 10,
  },

  description: {
    color: "white",
    fontSize: 17,
  },

  hashtag: {
    fontWeight: "bold",
  },

  translation: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
  },

  musicContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default PostDetailPage;
