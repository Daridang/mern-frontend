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
        setError("Failed to load recipe list.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchRecipes();
    } else {
      setLoading(false);
      setError("You do not have admin rights to access this page.");
    }
  }, [user, currentSearchTerm, filterCategory, filterAuthorId]);

  // Dummy list of categories for filter (can be fetched from API later)
  const categories = ["", "Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"];

  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.recipeListContainer}>
      <h3 className={styles.subHeading}>Manage Recipes</h3>

      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Search by title..."
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
              {cat === "" ? "All Categories" : cat}
            </option>
          ))}
        </select>
        {/* Optionally, add a filter for authorId if needed */}
      </div>

      <table className={styles.recipeTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className={styles.loadingCell}>
                Loading data...
              </td>
            </tr>
          ) : recipes.length > 0 ? (
            recipes.map((r) => (
              <tr key={r._id}>
                <td data-label="ID:">{r._id}</td>
                <td data-label="Title:">
                  <Link to={`/admin/recipes/${r._id}`}>{r.title}</Link>
                </td>
                <td data-label="Category:">{r.category}</td>
                <td data-label="Author:">
                  {r.author ? (
                    <Link to={`/admin/users/${r.author._id}`}>
                      {r.author.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Created At:">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td data-label="Actions:">
                  <button className={styles.actionButton}>Edit</button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.emptyCell}>
                No recipes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
