// src/components/RecipesCatalog/RecipesCatalog.jsx
import React, { useState, useEffect } from "react";
import styles from "./RecipesCatalog.module.css";
import RecipeCard from "../RecipeCard/RecipeCard";
import api from "../../../axiosConfig";

export default function RecipesCatalog() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/api/recipes`, { params: { page, limit } })
      .then((res) => {
        setRecipes(res.data.recipes);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) return <p>Загрузка рецептов…</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <section className={styles.catalog}>
      <div className="container">
        <h2 className={styles.heading}>Recipe Catalog</h2>
        <div className={styles.grid}>
          {recipes.length === 0 ? (
            <p>Нет рецептов для отображения.</p>
          ) : (
            recipes.map((r) => (
              <RecipeCard
                key={r._id}
                id={r._id}
                title={r.title}
                price={r.price || "$–"}
                img={r.image}
              />
            ))
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={page === 1}>
            Назад
          </button>
          <span>
            Страница {page} из {totalPages}
          </span>
          <button onClick={handleNext} disabled={page === totalPages}>
            Вперёд
          </button>
        </div>
      </div>
    </section>
  );
}
