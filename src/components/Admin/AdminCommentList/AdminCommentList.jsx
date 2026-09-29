// #region AdminCommentList Component
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
  const [filterAuthorId, setFilterAuthorId] = useState("");
  const [filterRecipeId, setFilterRecipeId] = useState("");

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
        setError("Failed to load comment list.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchComments();
    } else {
      setLoading(false);
      setError("You do not have admin rights to access this page.");
    }
  }, [user, currentSearchTerm, filterAuthorId, filterRecipeId]);

  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.commentListContainer}>
      <h3 className={styles.subHeading}>Manage Comments</h3>

      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Search by text..."
          disabled={loading}
        />
      </div>

      <table className={styles.commentTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Text</th>
            <th>Author</th>
            <th>Recipe</th>
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
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <tr key={c._id}>
                <td data-label="ID:">{c._id}</td>
                <td data-label="Text:">
                  <Link to={`/admin/comments/${c._id}`}>
                    {c.text.length > 50
                      ? c.text.substring(0, 50) + "..."
                      : c.text}
                  </Link>
                </td>
                <td data-label="Author:">
                  {c.author ? (
                    <Link to={`/admin/users/${c.author._id}`}>
                      {c.author.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Recipe:">
                  {c.recipe ? (
                    <Link to={`/admin/recipes/${c.recipe._id}`}>
                      {c.recipe.title}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td data-label="Created At:">
                  {new Date(c.createdAt).toLocaleDateString()}
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
              <td colSpan="6" className={styles.loadingCell}>
                No comments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// #endregion
