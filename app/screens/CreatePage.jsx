import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import Loading from "../components/Loading";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS, GET_POSTS_BY_USER } from "../queries/queries";
import BoxAlert from "../components/BoxAlert";

function CreatePage({ navigation }) {
  // INPUT DATA
  const [createData, setCreateData] = useState({
    content: "",
    imgUrl: "",
    tags: "",
  });

  const updateData = (key, value) => {
    setCreateData({ ...createData, [key]: value });
  };

  // CREATE NEW POST
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }, { query: GET_POSTS_BY_USER }],
    onCompleted: () => {
      navigation.navigate("Profile");
      BoxAlert("Success!", "Post successfully created.");
    },
  });
  const handleCreate = async () => {
    try {
      await createPost({
        variables: {
          inputCreatePost: {
            tags: createData.tags,
            imgUrl: createData.imgUrl,
            content: createData.content,
          },
        },
      });
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
      <View style={styles.container}>
        <View>
          <Text style={styles.mainText}>Create New Post</Text>
          <Text style={styles.subText}>
            Post pics, find your squad, and have some fun while you're at it.
            Time to shine!
          </Text>

          <View style={styles.formWrapper}>
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  height: 100,
                  flexDirection: "column",
                  flexWrap: "wrap",
                },
              ]}
              onChangeText={(e) => {
                updateData("content", e);
              }}
              placeholder="Caption"
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              onChangeText={(e) => {
                updateData("imgUrl", e);
              }}
              placeholder="Image URL"
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              onChangeText={(e) => {
                updateData("tags", e);
              }}
              placeholder="Tags*"
              onSubmitEditing={handleCreate}
            />
            <Text style={styles.note}>*Separate tags using a comma (,)</Text>
            <Pressable style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createText}>Create</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  mainText: {
    fontWeight: "700",
    fontSize: 21,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    textAlign: "center",
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 10,
    marginVertical: 8,
  },
  formWrapper: {
    marginTop: 30,
    maxWidth: 320,
    minWidth: 320,
  },
  note: {
    color: "gray",
    fontSize: 12,
  },
  createButton: {
    marginTop: 30,
    backgroundColor: "#FE2C55",
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});

export default CreatePage;
