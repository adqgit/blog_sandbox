import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

// import { CommentsList } from "./CommentList";

import { addNewComment } from ".././posts/postsSlice";

const AddCommentForm = ({ post }) => {
  const [userId, setUserId] = useState("");
  const [content, setContent] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const onAuthorChanged = (e) => setUserId(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const canSave =
    [content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSaveCommentClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(
          addNewComment({ actualPost: post.id, content, user: userId })
        );

        unwrapResult(resultAction);

        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      {/* <CommentsList /> */}
      {/* <p>tutaj beda komentarze</p> */}
      <form>
        <label htmlFor="commentTitle">Add new comment</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>

        {/* <button type="button"> */}
        <button
          type="button"
          onClick={onSaveCommentClicked}
          disabled={!canSave}
        >
          Add comment
        </button>
      </form>
    </section>
  );
};

export default AddCommentForm;
