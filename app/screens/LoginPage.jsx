import { useContext, useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import {
  DO_LOGIN,
  GET_POSTS_BY_USER,
  GET_POSTS,
  SEARCH_USER,
} from "../queries/queries";
import { useMutation, gql } from "@apollo/client";
import { LoginContext } from "../contexts/LoginContext";
import * as SecureStore from "expo-secure-store";
import Loading from "../components/Loading";
import client, { clientSetLink } from "../config/apollo";
import BoxAlert from "../components/BoxAlert";

function LoginPage({ navigation }) {
  // handle form change
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // handle login
  const { setIsLoggedIn } = useContext(LoginContext);

  const [Login, { data, loading, error }] = useMutation(DO_LOGIN, {
    onCompleted: async (res) => {
      let token;
      let payload;
      if (res && res.login) {
        token = res.login.token;
        payload = res.login.payload;
      }
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("userId", payload._id);
      await SecureStore.setItemAsync("userUsername", payload.username);
      await SecureStore.setItemAsync("userImage", payload.imageUrl);
      clientSetLink();
      await refetchQueries();
      setIsLoggedIn(true);
    },
  });

  const refetchQueries = async () => {
    await client.refetchQueries({
      include: [
        { query: GET_POSTS },
        { query: GET_POSTS_BY_USER },
        { query: SEARCH_USER, variables: { input: "" } },
      ],
    });
  };
  const handleLogin = async () => {
    try {
      const res = await Login({
        variables: {
          inputLogin: {
            username,
            password,
          },
        },
      });
    } catch (error) {
      console.log(error);
      BoxAlert("Error!", error.message);
    }
  };

  const directToRegister = () => {
    navigation.navigate("register");
  };

  if (loading) return <Loading />;
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.mainText}>Log in to KnickKnock</Text>
          <Text style={styles.subText}>
            Manage your account, check notifications, comment on videos, and
            more.
          </Text>

          <View style={styles.formWrapper}>
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              placeholder="Username"
              onChangeText={(e) => setUsername(e)}
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(e) => setPassword(e)}
              onSubmitEditing={handleLogin}
            />
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: "white" }}>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: "gray",
            marginBottom: 20,
            marginHorizontal: 40,
          }}
        >
          By continuing, you agree to our{" "}
          <Text style={{ fontWeight: "600", color: "black" }}>
            Terms of Service
          </Text>{" "}
          and acknowledge that you have read our{" "}
          <Text style={{ fontWeight: "600", color: "black" }}>
            Privacy Policy
          </Text>{" "}
          to learn how we collect, use, and share your data.
        </Text>
        <View style={styles.signUp}>
          <Text>Don't have an account? </Text>
          <Pressable onPress={directToRegister}>
            <Text style={{ color: "#FE2C55" }}>Sign up</Text>
          </Pressable>
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
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: "#FE2C55",
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },

  // FOOTER
  signUp: {
    paddingVertical: 20,
    height: 80,
    backgroundColor: "#f4f4f4",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default LoginPage;
