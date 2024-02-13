const { addFollow } = require("../models/follow");

const typeDefs = `#graphql

type Follow {
  _id: ID
  followingId: ID
  followerId: ID
  createdAt: String
  updatedAt: String
}

input createFollowInput {
  followingId: ID
}

type Query {
  readFollow: Follow
}

type Mutation {
  addFollow(inputCreateFollow: createFollowInput): Follow
}`;

const resolvers = {
  Query: {},
  Mutation: {
    // CREATE NEW FOLLOW
    addFollow: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();
      const { userId } = userLogin;

      const { followingId } = args.inputCreateFollow;
      const newFollow = await addFollow(followingId, userId);

      return newFollow;
    },
  },
};

module.exports = { followTypeDefs: typeDefs, followResolvers: resolvers };
