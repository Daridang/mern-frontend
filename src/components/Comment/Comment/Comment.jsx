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
  const handleLikeToggle = async () => {
    try {
      await onLikeToggle();
    } catch (error) {
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
        <p>{text}</p>
        <small>{new Date(date).toLocaleDateString()}</small>
        <div className={styles.commentActions}>
          <button onClick={handleLikeToggle}>
            {isLikedByCurrentUser ? "Unlike" : "Like"}
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
