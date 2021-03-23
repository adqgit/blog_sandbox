import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const initialState = {
  comments: [],
  status: "idle",
  error: null
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
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

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    //.........
  },
  extraReducers: {
    [fetchComments.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      state.comments = state.comments.concat(action.payload);
    },
    [fetchComments.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addNewComment.fulfilled]: (state, action) => {
      state.comments.push(action.payload);
    }
  }
});

// export const { commentAdded } = commentsSlice.actions;

export default commentsSlice.reducer;

export const selectAllComments = (state) => state.comments;

// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);
