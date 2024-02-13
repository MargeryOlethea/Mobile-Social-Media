import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetailPage from "../screens/PostDetailPage";
import HomePage from "../screens/HomePage";

const Stack = createNativeStackNavigator();

export default function PostStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostList"
        component={HomePage}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
