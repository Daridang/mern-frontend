import React, { useState, useEffect, useContext } from "react";
import api from "../../../axiosConfig";
import styles from "./AdminCommentList.module.css";
import { AuthContext } from "../../../context/AuthContext";
import SearchInput from "../../Common/SearchInput/SearchInput";
import { Link } from "react-router-dom";

export default function AdminCommentList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [filterAuthorId, setFilterAuthorId] = useState(""); // Optional: filter by author ID
  const [filterRecipeId, setFilterRecipeId] = useState(""); // Optional: filter by recipe ID

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (currentSearchTerm) {
          params.append("search", currentSearchTerm);
        }
        if (filterAuthorId) {
          params.append("authorId", filterAuthorId);
        }
        if (filterRecipeId) {
          params.append("recipeId", filterRecipeId);
        }
        const res = await api.get(`/api/admin/comments?${params.toString()}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Не удалось загрузить список комментариев.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchComments();
    } else {
      setLoading(false);
      setError("У вас нет прав администратора для доступа к этой странице.");
    }
  }, [user, currentSearchTerm, filterAuthorId, filterRecipeId]);

  if (error) return <p className={styles.error}>Ошибка: {error}</p>;

  return (
    <div className={styles.commentListContainer}>
      <h3 className={styles.subHeading}>Управление комментариями</h3>

      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Поиск по тексту..."
          disabled={loading}
        />
        {/* Optional: Add filters for authorId and recipeId if needed */}
      </div>

      <table className={styles.commentTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Текст</th>
            <th>Автор</th>
            <th>Рецепт</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className={styles.loadingCell}>
                Загрузка данных...
              </td>
            </tr>
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <tr key={c._id}>
                <td data-label="ID:">{c._id}</td>
                <td data-label="Текст:">
                  <Link to={`/admin/comments/${c._id}`}>
                    {c.text.length > 50
                      ? c.text.substring(0, 50) + "..."
                      : c.text}
                  </Link>
                </td>
                <td data-label="Автор:">
                  {c.author ? (
                    <Link to={`/admin/users/${c.author._id}`}>
                      {c.author.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Рецепт:">
                  {c.recipe ? (
                    <Link to={`/admin/recipes/${c.recipe._id}`}>
                      {c.recipe.title}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Дата создания:">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td data-label="Действия:">
                  <button className={styles.actionButton}>Редактировать</button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.emptyCell}>
                Комментарии не найдены.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
