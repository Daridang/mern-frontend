import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../axiosConfig";
import { AuthContext } from "../../context/AuthContext";
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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await api.get(`/api/recipes/${id}`);
        setRecipe(recipeRes.data);

        const commentRes = await api.get(`/api/comments/recipe/${id}`);
        setComments(commentRes.data);
      } catch (err) {
        setError("Ошибка загрузки данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (text) => {
    try {
      const res = await api.post("/api/comments", {
        recipeId: id,
        text,
      });
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Ошибка при добавлении комментария:", err);
    }
  };

  const handleLikeToggle = async (commentId) => {
    try {
      const res = await api.patch(`/api/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((comment) => (comment._id === commentId ? res.data : comment))
      );
    } catch (err) {
      console.error("Ошибка при лайке:", err);
      throw new Error(
        err.response?.data?.message || "Нельзя лайкнуть свой комментарий"
      );
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const res = await api.patch(`/api/comments/${commentId}`, {
        text: newText,
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, text: res.data.text }
            : comment
        )
      );
    } catch (err) {
      console.error("Ошибка при редактировании:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Ошибка при удалении:", err);
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
        <CommentList
          comments={comments}
          currentUserId={user?.id || null}
          onLikeToggle={handleLikeToggle}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
        <CommentForm onSubmit={handleAddComment} />
      </div>
    </div>
  );
}
