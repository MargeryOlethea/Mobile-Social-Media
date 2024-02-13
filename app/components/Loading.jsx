import { View, ActivityIndicator } from "react-native";
function Loading() {
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color="#FE2C55" />
      </View>
    </>
  );
}

export default Loading;
