import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./RecipeDetail.module.css";

import TitleSection from "../../components/RecipeDetail/TitleSection/TitleSection";
import MetaInfo from "../../components/RecipeDetail/MetaInfo/MetaInfo";
import Ingredients from "../../components/RecipeDetail/Ingredients/Ingredients";
import Equipment from "../../components/RecipeDetail/Equipment/Equipment";
import Instructions from "../../components/RecipeDetail/Instructions/Instructions";
import Extras from "../../components/RecipeDetail/Extras/Extras";
import CommentList from "../../components/Comment/CommentList/CommentList";
import CommentForm from "../../components/Comment/CommentForm/CommentForm";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes/${id}`
        );
        if (!res.ok) throw new Error("Рецепт не найден");
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${
            /**process.env.REACT_APP_API_URL ||  */
            "http://localhost:5000"
          }/api/comments/${id}`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchRecipe();
    fetchComments();
  }, [id]);

  const addComment = async (commentText) => {
    try {
      const newComment = {
        recipeId: id,
        text: commentText,
        // Add other necessary fields like userId, username, etc.
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        newComment
      );
      setComments([...comments, res.data]);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) return <p>Загрузка…</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link> &gt; <span>{recipe.title}</span>
        </div>
        <TitleSection title={recipe.title} description={recipe.description} />
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.mainImage}
        />
        <MetaInfo
          category={recipe.category}
          yieldInfo={recipe.yield}
          servingSize={recipe.serving_size}
          prepTime={recipe.prep_time}
          temperature={recipe.temperature}
        />
        <Ingredients groups={recipe.ingredients.groups} />
        <Equipment items={recipe.equipment} />
        <Instructions groups={recipe.instructions.groups} />
        <Extras items={recipe.extras} />

        <h3>Comments</h3>
        <CommentList comments={comments} />
        <CommentForm onSubmit={addComment} />
      </div>
    </div>
  );
}
