import React from "react";

const Comment = ({
  avatar,
  username,
  text,
  date,
  likes,
  onEdit,
  onDelete,
  isEditable,
}) => {
  return (
    <div className="comment">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="comment-avatar"
      />
      <div className="comment-content">
        <h4>{username}</h4>
        <p>{text}</p>
        <small>{new Date(date).toLocaleDateString()}</small>
        <span>{likes} likes</span>
        {isEditable && (
          <div className="comment-actions">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
