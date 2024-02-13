const {
  addUser,
  readUserById,
  login,
  readUserByNameOrUsername,
} = require("../models/user");

const typeDefs = `#graphql

type User {
  _id: ID
  name: String!
  username: String!
  email: String!
  imageUrl: String
  password: String
  followers: [User]
  followings: [User]
  isFollowedByLoggedUser: Boolean
}

input registerInput {
  name: String
  username: String!
  email: String!
  imageUrl: String
  password: String!
}

input loginInput {
  username: String!
  password: String!
}

type LoginResponse {
  token: String
  payload: User
}

type Query {
  readUserById(id: ID!): User
  readUserByNameOrUsername(input: String): [User]
}

type Mutation {
  register(inputRegister: registerInput): User
  login(inputLogin: loginInput): LoginResponse

}`;

const resolvers = {
  Query: {
    // READ USER BY ID
    readUserById: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { id } = args;

      const user = await readUserById(id);
      return user;
    },

    // READ USER BY NAME OR USERNAME
    readUserByNameOrUsername: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { userId } = userLogin;

      const { input } = args;

      const users = await readUserByNameOrUsername(userId, input);
      return users;
    },
  },
  Mutation: {
    // REGISTER
    register: async (_parents, args) => {
      const { name, imageUrl, username, email, password } = args.inputRegister;

      const newUser = await addUser(name, username, email, imageUrl, password);

      return newUser;
    },

    // LOGIN
    login: async (_parents, args) => {
      const { username, password } = args.inputLogin;

      const response = await login(username, password);

      return response;
    },
  },
};

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };
