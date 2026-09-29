import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./AdminCommentDetail.module.css";

export default function AdminCommentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchCommentDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/admin/comments/${id}`);
        setComment(res.data);
        setEditableText(res.data.text || "");
      } catch (err) {
        console.error("Error fetching comment details:", err);
        setError("Failed to load comment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommentDetails();
  }, [id, currentUser, navigate]);

  const handleTextChange = (e) => {
    setEditableText(e.target.value);
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/admin/comments/${id}`, {
        text: editableText,
      });
      setComment(res.data.comment);
      setIsEditing(false);
      alert("Comment updated successfully!");
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/api/admin/comments/${id}`);
        alert("Comment deleted successfully!");
        navigate("/admin?tab=comments"); // Go back to comment list after deletion
      } catch (err) {
        console.error("Error deleting comment:", err);
        setError("Failed to delete comment.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading comment...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!comment) {
    return <div className={styles.empty}>Comment not found.</div>;
  }

  return (
    <div className={styles.commentDetailContainer}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Comment ID: {comment._id}</h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            &larr; Back to list
          </button>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoItem}>
            <label className={styles.label}>ID:</label>
            <span className={styles.value}>{comment._id}</span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Author:</label>
            {comment.author ? (
              <Link
                to={`/admin/users/${comment.author._id}`}
                className={styles.authorLink}
              >
                {comment.author.name}
              </Link>
            ) : (
              <span className={styles.value}>N/A</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Recipe:</label>
            {comment.recipe ? (
              <Link
                to={`/admin/recipes/${comment.recipe._id}`}
                className={styles.recipeLink}
              >
                {comment.recipe.title}
              </Link>
            ) : (
              <span className={styles.value}>N/A</span>
            )}
          </div>
          <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
            <label className={styles.label}>Text:</label>
            {isEditing ? (
              <textarea
                name="text"
                value={editableText}
                onChange={handleTextChange}
                className={styles.editInput}
              />
            ) : (
              <span className={styles.value}>{comment.text}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Likes:</label>
            <span className={styles.value}>{comment.likesCount}</span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Created At:</label>
            <span className={styles.value}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Updated At:</label>
            <span className={styles.value}>
              {new Date(comment.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit
            </button>
          )}
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete Comment
          </button>
        </div>
      </div>
    </div>
  );
}
