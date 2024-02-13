const { GraphQLError } = require("graphql");
const { readUserById } = require("../models/user");
const { verifyToken } = require("../utils/jwt");

const authentication = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new GraphQLError("Invalid token");
  }

  const token = authorization.split(" ")[1];

  const userPayload = verifyToken(token);

  const user = await readUserById(userPayload._id);

  if (!user) {
    throw new GraphQLError("Invalid token");
  }

  return { userId: user._id, userUsername: user.username };
};

module.exports = authentication;
