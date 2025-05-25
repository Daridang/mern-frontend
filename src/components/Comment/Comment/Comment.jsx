import React, { useState } from "react";

const Comment = ({
  avatar,
  username,
  text,
  date,
  likes: initialLikes,
  onEdit,
  onDelete,
  isEditable,
  onLikeToggle,
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onLikeToggle();
  };

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
        <div className="comment-actions">
          <button onClick={handleLikeToggle}>
            {liked ? "Unlike" : "Like"}
          </button>
          <span>{likes} likes</span>
          {isEditable && (
            <>
              <button onClick={onEdit}>Edit</button>
              <button onClick={onDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
