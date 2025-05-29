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
    <div className={styles.list}>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          avatar={`https://robohash.org/${comment.author._id}`}
          username={comment.author.name}
          text={comment.text}
          date={comment.createdAt}
          likes={comment.likesCount || 0}
          isEditable={currentUserId === comment.author._id}
          isLikedByCurrentUser={comment.likes.includes(currentUserId) || false}
          onLikeToggle={() => onLikeToggle(comment._id)}
          onEdit={() => onEdit(comment._id)}
          onDelete={() => onDelete(comment._id)}
        />
      ))}
    </div>
  );
};

export default CommentList;
