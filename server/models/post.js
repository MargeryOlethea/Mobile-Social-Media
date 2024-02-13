const { getDatabase } = require("../config/mongoDB");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const redis = require("../utils/redis");

const getCollection = () => {
  const db = getDatabase();
  const postCollection = db.collection("posts");
  return postCollection;
};

// READ POSTS
const readPosts = async () => {
  const postCache = await redis.get("posts");

  if (postCache) {
    return JSON.parse(postCache);
  }

  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const posts = await getCollection().aggregate(agg).toArray();

  redis.set("posts", JSON.stringify(posts));

  return posts;
};

// READ POST BY ID
const readPostById = async (id) => {
  const post = await getCollection().findOne({ _id: new ObjectId(id) });

  if (!post) {
    throw new GraphQLError("Post not found");
  }

  const agg = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
  ];

  const foundPost = await getCollection().aggregate(agg).toArray();
  return foundPost[0];
};

// READ POST BY AUTHOR
const readPostByUser = async (authorId) => {
  const agg = [
    {
      $match: {
        authorId: new ObjectId(authorId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const posts = await getCollection().aggregate(agg).toArray();

  return posts;
};

// CREATE POST
const addPost = async (content, tags, imgUrl, authorId) => {
  //VALIDATION
  if (!content) {
    throw new GraphQLError("Content is required");
  }

  let cleanTags = [];
  if (tags && tags.trim() !== "") {
    const splittedTags = tags.split(",");
    cleanTags = splittedTags.map((word) => word.trim());
  }

  // CREATE
  const newPost = await getCollection().insertOne({
    content,
    tags: cleanTags,
    imgUrl,
    comments: [],
    likes: [],
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const post = await getCollection().findOne({
    _id: new ObjectId(newPost.insertedId),
  });
  redis.del("posts");
  return post;
};

//CREATE COMMENT
const addComment = async (postId, username, content) => {
  // VALIDATION
  if (!content) {
    throw new GraphQLError("Content is required");
  }

  // ADD
  const post = await readPostById(postId);

  if (!post) {
    throw new GraphQLError("Post not found!");
  }

  redis.del("posts");

  const newComment = await getCollection().updateOne(
    { _id: new ObjectId(postId) },
    {
      $push: {
        comments: {
          content,
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  );

  const updatedPost = await readPostById(postId);

  return updatedPost;
};

//CREATE COMMENT
const addLike = async (postId, username) => {
  const post = await readPostById(postId);

  if (!post) {
    throw new GraphQLError("Post not found!");
  }

  redis.del("posts");

  const newLike = await getCollection().updateOne(
    { _id: new ObjectId(postId) },
    {
      $push: {
        likes: {
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  );

  const updatedPost = await readPostById(postId);

  return updatedPost;
};

module.exports = {
  readPostByUser,
  readPosts,
  addPost,
  readPostById,
  addComment,
  addLike,
};
