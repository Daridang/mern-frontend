import React, { useState, useEffect, useContext } from "react";
import api from "../../../axiosConfig";
import styles from "./AdminRecipeList.module.css";
import { AuthContext } from "../../../context/AuthContext";
import SearchInput from "../../Common/SearchInput/SearchInput";
import { Link } from "react-router-dom";

export default function AdminRecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAuthorId, setFilterAuthorId] = useState(""); // Optional: filter by author ID

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (currentSearchTerm) {
          params.append("search", currentSearchTerm);
        }
        if (filterCategory) {
          params.append("category", filterCategory);
        }
        if (filterAuthorId) {
          params.append("authorId", filterAuthorId);
        }
        const res = await api.get(`/api/admin/recipes?${params.toString()}`);
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Не удалось загрузить список рецептов.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchRecipes();
    } else {
      setLoading(false);
      setError("У вас нет прав администратора для доступа к этой странице.");
    }
  }, [user, currentSearchTerm, filterCategory, filterAuthorId]);

  // Dummy list of categories for filter (can be fetched from API later)
  const categories = ["", "Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"];

  if (error) return <p className={styles.error}>Ошибка: {error}</p>;

  return (
    <div className={styles.recipeListContainer}>
      <h3 className={styles.subHeading}>Управление рецептами</h3>

      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Поиск по названию..."
          disabled={loading}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.selectInput}
          disabled={loading}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "" ? "Все категории" : cat}
            </option>
          ))}
        </select>
        {/* Optionally, add a filter for authorId if needed */}
      </div>

      <table className={styles.recipeTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Автор</th>
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
          ) : recipes.length > 0 ? (
            recipes.map((r) => (
              <tr key={r._id}>
                <td data-label="ID:">{r._id}</td>
                <td data-label="Название:">
                  <Link to={`/admin/recipes/${r._id}`}>{r.title}</Link>
                </td>
                <td data-label="Категория:">{r.category}</td>
                <td data-label="Автор:">
                  {r.author ? (
                    <Link to={`/admin/users/${r.author._id}`}>
                      {r.author.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Дата создания:">
                  {new Date(r.created_at).toLocaleDateString()}
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
                Рецепты не найдены.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
