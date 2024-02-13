import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

// const httpLink = createHttpLink({
//   uri: process.env.EXPO_PUBLIC_API_URL,
// });

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const clientSetLink = () => {
  client.setLink(authLink.concat(httpLink));
};

export default client;
