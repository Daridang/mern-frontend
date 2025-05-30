// src/components/RecipeCard/RecipeCard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import { ScrollContext } from "../../../context/ScrollContext";

export default function RecipeCard({ id, title, price, img }) {
  const navigate = useNavigate();
  const { setCatalogScroll, catalogPage } = useContext(ScrollContext);

  const handleClick = () => {
    setCatalogScroll(window.scrollY);
    sessionStorage.setItem("catalogPage", catalogPage);
    navigate(`/recipes/${id}`);
  };

  return (
    <div className={styles.cardLink} onClick={handleClick}>
      <div className={styles.card}>
        <img src={img} alt={title} className={styles.image} />
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.price}>{price}</div>
        </div>
      </div>
    </div>
  );
}
