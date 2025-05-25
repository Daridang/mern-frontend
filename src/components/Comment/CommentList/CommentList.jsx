import React from "react";
import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

const CommentList = ({ comments }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatar={comment.avatar}
          username={comment.username}
          text={comment.text}
          date={comment.date}
          likes={comment.likes}
        />
      ))}
    </div>
  );
};

export default CommentList;
