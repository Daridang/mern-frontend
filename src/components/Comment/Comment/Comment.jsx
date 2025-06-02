import { useState } from "react";
import styles from "./Comment.module.css";

const Comment = ({
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [error, setError] = useState("");

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
      // Можно показать ошибку пользователю
      // setError("Ошибка при лайке");
      console.log(`Error: ${error}`);
    }
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
              <button onClick={handleLikeToggle}>
                {isLikedByCurrentUser ? "Unlike" : "Like"}
              </button>
              <span>{likes} likes</span>
              {isEditable && (
                <>
                  <button onClick={handleEditClick}>Edit</button>
                  <button onClick={onDelete}>Delete</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
