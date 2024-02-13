import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

function PostsList({ navigation, posts }) {
  const handlePageDetail = (id) => {
    navigation.navigate("PostDetail", { id });
  };
  return (
    <>
      <View style={styles.container}>
        <FlatList
          // keyExtractor={(item) => {
          //   item._id;
          // }}
          numColumns={3}
          data={posts}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePageDetail(item._id)}
              style={styles.imageContainer}
            >
              <ImageBackground
                style={styles.image}
                source={{
                  uri: item.imgUrl,
                }}
              >
                <LinearGradient
                  // Background Linear Gradient
                  colors={[
                    "rgba(0,0,0,0.5)",
                    "transparent",
                    "transparent",
                    "rgba(0,0,0,0.5)",
                  ]}
                  key={(item) => item._id}
                  style={styles.gradientBackground}
                >
                  <Text style={styles.username}>@{item?.author?.username}</Text>
                  <Text style={styles.name}>{item?.author?.name}</Text>
                  <View style={styles.bottomContainer}>
                    <View style={styles.bottomText}>
                      <Ionicons name={"heart"} color={"white"} />
                      <Text style={{ color: "white" }}>
                        {item?.likes?.length}
                      </Text>
                    </View>

                    <View style={styles.bottomText}>
                      <Ionicons
                        name={"chatbubble-ellipses-sharp"}
                        color={"white"}
                      />
                      <Text style={{ color: "white" }}>
                        {item?.comments?.length}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  imageContainer: {
    width: "33.3%",
    aspectRatio: "9/16",
  },

  image: {
    height: "100%",
    width: "100%",
  },

  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  name: { color: "white", fontSize: 11 },

  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 10,
  },

  bottomText: {
    color: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  gradientBackground: {
    padding: 15,
    flex: 1,
  },
});

export default PostsList;
