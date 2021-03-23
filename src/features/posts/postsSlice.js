import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const initialState = {
  posts: [],
  status: "idle",
  error: null
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakeApi/posts");
  return response.posts;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    const response = await client.post("/fakeApi/posts", { post: initialPost });
    return response.post;
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async () => {
    const response = await client.get("/fakeApi/posts/:postId/comments");
    return response.comments;
  }
);

export const addNewComment = createAsyncThunk(
  "comments/addNewComment",
  async (initialComment) => {
    const response = await client.post("/fakeApi/posts/:postId/comments", {
      comment: initialComment
    });

    return response.comment;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      console.log(action.payload);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    }
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      state.posts = state.posts.concat(action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addNewPost.fulfilled]: (state, action) => {
      state.posts.push(action.payload);
    },
    [fetchComments.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.status = "succeeded";
      const { postId } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.comments.concat(action.payload);
      }
    },
    [fetchComments.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addNewComment.fulfilled]: (state, action) => {
      const { actualPost } = action.payload;
      const existingPost = state.posts.find((post) => post.id === actualPost);
      if (existingPost) {
        existingPost.comments.push(action.payload);
      }
    }
  }
});

export const {
  postAdded,
  postUpdated,
  reactionAdded,
  addComment
} = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
