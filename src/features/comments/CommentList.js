import React from "react";
import { PostAuthor } from ".././posts/PostAuthor";

const CommentList = ({ post }) => {
  let content = "";

  const allComments = post.comments.slice();
  if (allComments.length === 0) {
    content = <div>There are no comments yet, you can be the first!</div>;
  } else {
    content = allComments.map((comment) => (
      <div>
        {comment.content} -{" "}
        <b>
          <PostAuthor userId={comment.user} />
        </b>
        <hr />
        <br />
      </div>
    ));
  }

  return (
    <section>
      <h4>Comments: </h4>
      {content}
    </section>
  );
};

export default CommentList;
