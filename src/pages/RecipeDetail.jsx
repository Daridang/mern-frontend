import React from "react";
import { useParams } from "react-router-dom";

export default function RecipeDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Recipe Detail</h1>
      <p>Вы выбрали рецепт с ID = {id}</p>
      {/* Здесь вы будете делать fetch(`/api/recipes/${id}`) и рендерить карточку */}
    </div>
  );
}
