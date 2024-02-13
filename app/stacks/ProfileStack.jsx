import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetailPage from "../screens/PostDetailPage";
import ProfilePage from "../screens/ProfilePage";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="PostDetail" component={PostDetailPage} />
    </Stack.Navigator>
  );
}
