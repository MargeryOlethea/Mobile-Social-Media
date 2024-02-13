if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { mongoConnect } = require("./config/mongoDB");
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const authentication = require("./middlewares/auth");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("@apollo/server/plugin/landingPage/default");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: process.env.APOLLO_GRAPH_REF,
          embed: true,
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

(async () => {
  mongoConnect();
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      return {
        authentication: () => {
          return authentication(req);
        },
      };
    },
    listen: {
      port: process.env.PORT || 3000,
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
