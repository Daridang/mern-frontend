import { useState } from "react";
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
  onDelete,
  isEditable,
  onLikeToggle,
  replies,
  onAddReply,
  currentUserId,
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
      setError("Комментарий не может быть пустым");
      return;
    }
    if (editedText !== text) {
      try {
        await onEdit(editedText);
      } catch (e) {
        setError("Ошибка при сохранении");
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
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className={styles.commentAvatar}
      />
      <div className={styles.commentContent}>
        <h4>{username}</h4>
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
              <button onClick={handleEditSave}>Сохранить</button>
              <button onClick={handleEditCancel}>Отмена</button>
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
                  <button onClick={onDelete}>Delete</button>
                </>
              )}
              <button onClick={handleReplyClick}>
                {showReplyForm ? "Отменить ответ" : "Ответить"}
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
              onDelete={onDelete}
              onAddReply={onAddReply}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
