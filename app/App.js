import { StyleSheet } from "react-native";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import StacksHolder from "./stacks/StacksHolder";
import { LoginProvider } from "./contexts/LoginContext";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <LoginProvider>
          <StacksHolder />
        </LoginProvider>
      </ApolloProvider>
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
