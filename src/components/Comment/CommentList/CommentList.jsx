import React from "react";
import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

const CommentList = ({
  comments,
  currentUserId,
  onLikeToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          avatar={comment.avatar || "/default-avatar.jpg"}
          username={comment.username}
          text={comment.text}
          date={comment.createdAt}
          likes={comment.likes || 0}
          isEditable={currentUserId === comment.userId}
          onLikeToggle={() => onLikeToggle(comment._id)}
          onEdit={() => onEdit(comment._id)}
          onDelete={() => onDelete(comment._id)}
        />
      ))}
    </div>
  );
};

export default CommentList;
