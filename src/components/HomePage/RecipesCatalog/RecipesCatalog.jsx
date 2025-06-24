// src/components/RecipesCatalog/RecipesCatalog.jsx
import React, { useState, useEffect, useContext } from "react";
import styles from "./RecipesCatalog.module.css";
import RecipeCard from "../RecipeCard/RecipeCard";
import api from "../../../axiosConfig";
import { ScrollContext } from "../../../context/ScrollContext";

export default function RecipesCatalog() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { catalogScroll, setCatalogScroll, catalogPage, setCatalogPage } =
    useContext(ScrollContext);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const savedPage = sessionStorage.getItem("catalogPage");
    if (savedPage) {
      setCatalogPage(Number(savedPage));
      sessionStorage.removeItem("catalogPage");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/api/recipes`, { params: { page: catalogPage, limit } })
      .then((res) => {
        setRecipes(res.data.recipes);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [catalogPage, limit]);

  useEffect(() => {
    if (!loading && catalogScroll) {
      window.scrollTo(0, catalogScroll);
      setCatalogScroll(0);
    }
  }, [loading]);

  const handlePrev = () => setCatalogPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCatalogPage((p) => Math.min(totalPages, p + 1));

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className={styles.catalog}>
      <div className={`${styles.catalogContent} container`}>
        <h2 className={styles.heading}>Recipe Catalog</h2>
        <div className={styles.grid}>
          {recipes.length === 0 ? (
            <p>No recipes to display.</p>
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
          <button onClick={handlePrev} disabled={catalogPage === 1}>
            Back
          </button>
          <span>
            Page {catalogPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={catalogPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
