const { getDatabase } = require("../config/mongoDB");
const { ObjectId } = require("mongodb");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { createToken } = require("../utils/jwt");
const { GraphQLError } = require("graphql");

// GET COLLECTION
const getCollection = () => {
  const db = getDatabase();
  const userCollection = db.collection("users");
  return userCollection;
};

// REGISTER
const addUser = async (name, username, email, imageUrl, password) => {
  // VALIDASI
  await validationRegister(name, username, email, password);

  // PROSES CREATE USER
  username = username.toLowerCase();
  const hashedPassword = hashPassword(password);

  const newUser = await getCollection().insertOne({
    name,
    username,
    imageUrl,
    email,
    password: hashedPassword,
  });

  const user = await getCollection().findOne(
    {
      _id: new ObjectId(newUser.insertedId),
    },
    { projection: { password: 0 } },
  );

  return user;
};

// LOGIN
const login = async (username, password) => {
  validationLogin(username, password);

  username = username.toLowerCase();
  const user = await getCollection().findOne({ username });

  if (!user) {
    throw new GraphQLError("Invalid email/username");
  }

  const isRightUser = comparePassword(password, user.password);

  if (!isRightUser) {
    throw new GraphQLError("Invalid email/username");
  }

  const payload = {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
  };

  const token = createToken(payload);

  return { token, payload };
};

// FIND USER BY ID
const readUserById = async (id) => {
  const agg = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followerId",
        as: "followingIds",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followingId",
        as: "followerIds",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followerIds.followerId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followingIds.followingId",
        foreignField: "_id",
        as: "followings",
      },
    },
    {
      $project: {
        followingIds: 0,
        followerIds: 0,
        password: 0,
        "followers.password": 0,
        "followings.password": 0,
      },
    },
  ];

  const user = await getCollection().aggregate(agg).toArray();

  if (!user) {
    throw new GraphQLError("User not found");
  }

  return user[0];
};

// FIND USER BY NAME OR USERNAME
const readUserByNameOrUsername = async (userId, input) => {
  if (!input) {
    input = "";
  }

  const agg = [
    {
      $match: {
        _id: {
          $ne: new ObjectId(userId),
        },
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followingId",
        as: "followerIds",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followerIds.followerId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $project: {
        followerIds: 0,
      },
    },
    {
      $unwind: {
        path: "$followers",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        isFollowedByLoggedUser: {
          $eq: ["$followers._id", new ObjectId(userId)],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        name: {
          $first: "$name",
        },
        username: {
          $first: "$username",
        },
        email: {
          $first: "$email",
        },
        imageUrl: {
          $first: "$imageUrl",
        },
        isFollowedByLoggedUser: {
          $max: "$isFollowedByLoggedUser",
        },
        followers: {
          $push: "$followers",
        },
      },
    },
    {
      $match: {
        $or: [
          {
            name: {
              $regex: `.*${input}.*`,
              $options: "i",
            },
          },
          {
            username: {
              $regex: `.*${input}.*`,
              $options: "i",
            },
          },
        ],
      },
    },
  ];

  const users = await getCollection().aggregate(agg).toArray();

  return users;
};

// VALIDATION
// VALIDASI REGISTER
const validationRegister = async (name, username, email, password) => {
  if (!username || username == "") {
    throw new GraphQLError("Username is required");
  }

  if (!email || email == "") {
    throw new GraphQLError("Email is required");
  }

  if (!password || password == "") {
    throw new GraphQLError("Password is required");
  }

  const foundEmail = await getCollection().findOne({ email });

  if (foundEmail) {
    throw new GraphQLError("Email is registered");
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!isValidEmail) {
    throw new GraphQLError("Invalid email format");
  }

  const foundUsername = await getCollection().findOne({ username });
  if (foundUsername) {
    throw new GraphQLError("Username is registered");
  }

  if (password.length < 5) {
    throw new GraphQLError("Password must be at least 5 character long");
  }
};

// VALIDASI LOGIN
const validationLogin = (username, password) => {
  if (!username || username == "") {
    throw new GraphQLError("Username is required");
  }

  if (!password || password == "") {
    throw new GraphQLError("Password is required");
  }
};

module.exports = {
  readUserById,
  addUser,
  login,
  readUserByNameOrUsername,
};
