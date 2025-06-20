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
        setError("Не удалось загрузить данные комментария.");
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
      alert("Комментарий успешно обновлен!");
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Не удалось обновить комментарий.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот комментарий?")) {
      try {
        await api.delete(`/api/admin/comments/${id}`);
        alert("Комментарий успешно удален!");
        navigate("/admin?tab=comments"); // Go back to comment list after deletion
      } catch (err) {
        console.error("Error deleting comment:", err);
        setError("Не удалось удалить комментарий.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка комментария...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (!comment) {
    return <div className={styles.empty}>Комментарий не найден.</div>;
  }

  return (
    <div className={styles.commentDetailContainer}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Комментарий ID: {comment._id}</h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            &larr; Назад к списку
          </button>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoItem}>
            <label className={styles.label}>ID:</label>
            <span className={styles.value}>{comment._id}</span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Автор:</label>
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
            <label className={styles.label}>Рецепт:</label>
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
            <label className={styles.label}>Текст:</label>
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
            <label className={styles.label}>Лайки:</label>
            <span className={styles.value}>{comment.likesCount}</span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Дата создания:</label>
            <span className={styles.value}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>Дата обновления:</label>
            <span className={styles.value}>
              {new Date(comment.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                Сохранить
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Редактировать
            </button>
          )}
          <button onClick={handleDelete} className={styles.deleteButton}>
            Удалить комментарий
          </button>
        </div>
      </div>
    </div>
  );
}
