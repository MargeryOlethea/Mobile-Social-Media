import { StyleSheet, View, Text, Image } from "react-native";

function InboxPage() {
  return (
    <>
      <View style={styles.container}>
        <Text>Sorry, this page is not working (yet!)</Text>
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/e7/55/6a/e7556a45028d52bc88666bae24bfe0ce.jpg",
          }}
          style={{ height: 300, aspectRatio: "1/1" }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InboxPage;
