// #region Comment Component
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Comment.module.css";
import CommentForm from "../CommentForm/CommentForm";
import CommentList from "../CommentList/CommentList";

const Comment = ({
  commentId,
  avatar,
  username,
  text,
  date,
  likes,
  isLikedByCurrentUser,
  onEdit,
  onDeleteComment,
  isEditable,
  onLikeToggle,
  replies,
  onAddReply,
  currentUserId,
  authorId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [error, setError] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedText(text);
    setError("");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedText(text);
    setError("");
  };

  const handleEditSave = async () => {
    if (!editedText.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    if (editedText !== text) {
      try {
        await onEdit(editedText);
      } catch (e) {
        setError("Error while saving");
        return;
      }
    }
    setIsEditing(false);
  };

  const handleLikeToggle = async () => {
    try {
      await onLikeToggle();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm((prev) => !prev);
  };

  const handleReplySubmit = async (replyText) => {
    await onAddReply(replyText, commentId);
    setShowReplyForm(false);
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  return (
    <div className={styles.comment}>
      <Link to={`/users/${authorId}`}>
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className={styles.commentAvatar}
        />
      </Link>
      <div className={styles.commentContent}>
        <Link to={`/users/${authorId}`}>
          <h4>{username}</h4>
        </Link>
        {isEditing ? (
          <>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              maxLength={500}
              className={styles.textarea}
              autoFocus
            />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.commentActions}>
              <button onClick={handleEditSave}>Save</button>
              <button onClick={handleEditCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>{text}</p>
            <small>{new Date(date).toLocaleDateString()}</small>
            <div className={styles.commentActions}>
              {!isEditable && (
                <button onClick={handleLikeToggle}>
                  {isLikedByCurrentUser ? "Unlike" : "Like"}
                </button>
              )}
              <span>{likes} likes</span>
              {isEditable && (
                <>
                  <button onClick={handleEditClick}>Edit</button>
                  <button
                    onClick={() => {
                      onDeleteComment(commentId);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
              <button onClick={handleReplyClick}>
                {showReplyForm ? "Cancel reply" : "Reply"}
              </button>
            </div>
          </>
        )}

        {showReplyForm &&
          (currentUserId || typeof onAddReply === "function") && (
            <div className={styles.replyFormContainer}>
              <CommentForm
                onSubmit={handleReplySubmit}
                onCancel={handleReplyCancel}
              />
            </div>
          )}

        {replies && replies.length > 0 && (
          <div className={styles.replies}>
            <CommentList
              comments={replies}
              currentUserId={currentUserId}
              onLikeToggle={onLikeToggle}
              onEdit={onEdit}
              onDelete={onDeleteComment}
              onAddReply={onAddReply}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
// #endregion
