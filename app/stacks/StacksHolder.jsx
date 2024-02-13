import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import BottomBar from "./BottomBar";
import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

const Stack = createNativeStackNavigator();

const StacksHolder = () => {
  const { isLoggedIn } = useContext(LoginContext);
  // const isLoggedIn = true;
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="authenticatedScreen" component={BottomBar} />
            </>
          ) : (
            <>
              <Stack.Screen name="login" component={LoginPage} />
              <Stack.Screen name="register" component={RegisterPage} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default StacksHolder;
