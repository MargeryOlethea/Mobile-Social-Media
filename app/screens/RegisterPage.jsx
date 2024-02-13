import { useMutation } from "@apollo/client";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import { DO_REGISTER } from "../queries/queries";
import Loading from "../components/Loading";
import BoxAlert from "../components/BoxAlert";

function RegisterPage({ navigation }) {
  // HANDLE REGISTER
  // INPUT DATA
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    name: "",
    imageUrl: "",
    password: "",
  });

  const inputData = (field, e) => {
    setRegisterData({ ...registerData, [field]: e });
  };

  // PROSES REGISTER
  const [register, { data, loading, error }] = useMutation(DO_REGISTER, {
    onCompleted: () => {
      navigation.navigate("login");

      BoxAlert("Success!", "Please log in.");
    },
  });

  const handleRegister = async () => {
    try {
      await register({
        variables: {
          inputRegister: {
            name: registerData.name,
            username: registerData.username,
            email: registerData.email,
            imageUrl: registerData.imageUrl,
            password: registerData.password,
          },
        },
      });
    } catch (error) {
      console.log(error);
      BoxAlert("Error", error.message);
    }
  };

  const directToLogin = () => {
    navigation.navigate("login");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.mainText}>Sign Up to KnickKnock</Text>
          <Text style={styles.subText}>
            Create a profile, follow other accounts, make your own videos, and
            more.
          </Text>

          <View style={styles.formWrapper}>
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              placeholder="Email"
              onChangeText={(e) => {
                inputData("email", e);
              }}
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              placeholder="Username"
              onChangeText={(e) => {
                inputData("username", e);
              }}
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              placeholder="Name"
              onChangeText={(e) => {
                inputData("name", e);
              }}
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              placeholder="Profile Picture URL"
              onChangeText={(e) => {
                inputData("imageUrl", e);
              }}
            />
            <TextInput
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(e) => {
                inputData("password", e);
              }}
              onSubmitEditing={handleRegister}
            />
            <Pressable style={styles.signupButton} onPress={handleRegister}>
              <Text style={styles.signupText}>Sign Up</Text>
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
            marginHorizontal: 30,
          }}
        >
          By signing up, you agree to our{" "}
          <Text style={{ fontWeight: "600", color: "black" }}>
            Terms of Service
          </Text>{" "}
          and acknowledge that you have read our{" "}
          <Text style={{ fontWeight: "600", color: "black" }}>
            Privacy Policy
          </Text>{" "}
          to learn how we collect, use, and share your data and our{" "}
          <Text style={{ fontWeight: "600", color: "black" }}>
            Cookies Policy
          </Text>{" "}
          to learn how we use cookies.
        </Text>
        <View style={styles.Login}>
          <Text>Already have an account? </Text>
          <Pressable onPress={directToLogin}>
            <Text style={{ color: "#FE2C55" }}>Log in</Text>
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
  signupButton: {
    marginTop: 30,
    backgroundColor: "#FE2C55",
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
  signupText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },

  // FOOTER
  Login: {
    paddingVertical: 20,
    height: 80,
    backgroundColor: "#f4f4f4",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default RegisterPage;
