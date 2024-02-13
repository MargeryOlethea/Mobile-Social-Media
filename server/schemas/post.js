const {
  addPost,
  readPosts,
  readPostById,
  addComment,
  addLike,
  readPostByAuthor,
  readPostByUser,
} = require("../models/post");
const { verifyToken } = require("../utils/jwt");

const typeDefs = `#graphql

type Post {
  _id: ID
  content: String!
  tags: [String]
  imgUrl: String
  authorId: ID!
  comments: [Comment]
  likes: [Like]
  author: User
  createdAt: String
  updatedAt: String
}

type Comment {
  content: String!
  username: String!
  createdAt: String
  updatedAt: String
}

type Like {
  username: String!
  createdAt: String
  updatedAt: String
}

input createPostInput {
  content: String!
  tags: String
  imgUrl: String
}

type Query {
  readPosts: [Post]
  readPostById(id: ID!): Post
  readPostByUser:[Post]
}

type Mutation {
  createPost (inputCreatePost: createPostInput): Post
  addComment(postId: ID!, content: String! ): Post
  addLike(postId: ID!): Post
}`;

const resolvers = {
  Query: {
    // READ POSTS
    readPosts: async (_parents, _args, contextValue) => {
      try {
        const userLogin = await contextValue.authentication();

        const posts = await readPosts();

        return posts;
      } catch (error) {
        console.log(error);
      }
    },

    // READ POST BY ID
    readPostById: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { id } = args;

      const post = await readPostById(id);

      return post;
    },

    //READ POST BY AUTHOR
    readPostByUser: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { userId } = userLogin;

      const posts = await readPostByUser(userId);

      return posts;
    },
  },
  Mutation: {
    // CREATE POST
    createPost: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { userId } = userLogin;
      const { content, tags, imgUrl } = args.inputCreatePost;

      const newPost = await addPost(content, tags, imgUrl, userId);
      return newPost;
    },

    // ADD COMMENT
    addComment: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { userUsername } = userLogin;
      const { postId, content } = args;

      const updatedPost = await addComment(postId, userUsername, content);
      return updatedPost;
    },

    // ADD LIKE
    addLike: async (_parents, args, contextValue) => {
      const userLogin = await contextValue.authentication();

      const { userUsername } = userLogin;

      const { postId } = args;

      const updatedPost = await addLike(postId, userUsername);
      return updatedPost;
    },
  },
};

module.exports = { postTypeDefs: typeDefs, postResolvers: resolvers };
