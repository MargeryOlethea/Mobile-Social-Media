import { gql } from "@apollo/client";

export const DO_LOGIN = gql`
  mutation Login($inputLogin: loginInput) {
    login(inputLogin: $inputLogin) {
      token
      payload {
        _id
        name
        username
        email
        imageUrl
      }
    }
  }
`;

export const GET_POSTS_BY_USER = gql`
  query ReadPostByUser {
    readPostByUser {
      _id
      content
      tags
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        username
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query ReadUserById($readUserByIdId: ID!) {
    readUserById(id: $readUserByIdId) {
      _id
      name
      username
      email
      imageUrl
      followers {
        name
        username
      }
      followings {
        name
        username
      }
    }
  }
`;

export const DO_REGISTER = gql`
  mutation Register($inputRegister: registerInput) {
    register(inputRegister: $inputRegister) {
      _id
      name
      username
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($inputCreatePost: createPostInput) {
    createPost(inputCreatePost: $inputCreatePost) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        username
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_FOLLOW = gql`
  mutation AddFollow($inputCreateFollow: createFollowInput) {
    addFollow(inputCreateFollow: $inputCreateFollow) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_USER = gql`
  query ReadUserByNameOrUsername($input: String!) {
    readUserByNameOrUsername(input: $input) {
      _id
      name
      username
      email
      imageUrl
      followers {
        username
        name
      }
      isFollowedByLoggedUser
    }
  }
`;

export const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId) {
      _id
      content
      tags
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query ReadPostById($readPostByIdId: ID!) {
    readPostById(id: $readPostByIdId) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        username
        name
        imageUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POSTS = gql`
  query ReadPosts {
    readPosts {
      _id
      content
      tags
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        _id
        name
        username
        email
        imageUrl
        password
      }
      createdAt
      updatedAt
    }
  }
`;
