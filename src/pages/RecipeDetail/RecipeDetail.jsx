import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import styles from "./RecipeDetail.module.css";
import RegisterModal from "../../components/Modal/RegisterModal/RegisterModal";

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
  const [liked, setLiked] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await api.get(`/api/recipes/${id}`);
        setRecipe(recipeRes.data);

        if (user && recipeRes.data.likes) {
          setLiked(recipeRes.data.likes.includes(user.id));
        }

        const commentRes = await api.get(`/api/comments/recipe/${id}`);
        setComments(commentRes.data);
      } catch (err) {
        setError("Data loading error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

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
    if (!user) {
      setShowRegisterModal(true);
      return;
    }
    try {
      const res = await api.patch(`/api/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((comment) => (comment._id === commentId ? res.data : comment))
      );
    } catch (err) {
      console.error("Error when liking:", err);
      throw new Error(err.response?.data?.message || "Can't like your comment");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    console.log(commentId, newText);
    try {
      const res = await api.put(`/api/comments/${commentId}`, {
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
      console.error("Error when editing:", err);
      throw new Error(err.response?.data?.message || "Can't edit your comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Error when deleting:", err);
      throw new Error(
        err.response?.data?.message || "Can't delete your comment"
      );
    }
  };

  const handleRecipeLike = async () => {
    if (!user) {
      setShowRegisterModal(true);
      return;
    }

    try {
      const res = await api.post(`/api/recipes/${id}/like`);
      setLiked(res.data.liked);
      setRecipe((prev) => ({
        ...prev,
        likesCount: res.data.likesCount,
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        setShowRegisterModal(true);
      } else {
        console.error("Error when liking recipe:", err);
      }
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await api.delete(`/api/recipes/${id}`);
      navigate("/#catalog");
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const isAuthor = user && recipe && user.id === recipe.author.id;
  const isGuest = !user || user.id !== recipe?.author?.id;

  // Хук useAuthAction
  function useAuthAction(user, openModal) {
    return useCallback(
      (action) =>
        (...args) => {
          if (!user) {
            openModal(true);
            return;
          }
          return action(...args);
        },
      [user, openModal]
    );
  }

  const withAuth = useAuthAction(user, setShowRegisterModal);
  const handleAddCommentAuth = withAuth(handleAddComment);
  const handleLikeToggleAuth = withAuth(handleLikeToggle);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link> &gt; <span>{recipe.title}</span>
        </div>

        {/* Заголовок и описание */}
        <TitleSection title={recipe.title} description={recipe.description} />

        {/* Блок: картинка + ингредиенты + автор */}
        <div className={styles.topBlock}>
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.mainImage}
          />
          <div className={styles.sideInfo}>
            {/* Автор */}
            <div className={styles.author}>
              <img
                src={
                  recipe.author.avatar ||
                  `https://robohash.org/${recipe.author._id}`
                }
                alt={recipe.author.name}
                className={styles.avatar}
              />
              <a href="/profile" className={styles.authorName}>
                {recipe.author.name}
              </a>
            </div>
            {/* Ингредиенты */}
            <Ingredients groups={recipe.ingredients.groups} />
            {/* Кнопки */}
            <div className={styles.actions}>
              {isAuthor && (
                <>
                  <button className={styles.editBtn}>Edit</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={handleDeleteRecipe}
                  >
                    Delete
                  </button>
                </>
              )}
              {isGuest && (
                <button
                  className={styles.likeBtn}
                  onClick={handleRecipeLike}
                  aria-pressed={liked}
                  style={liked ? { color: "#e74c3c" } : {}}
                >
                  ♥
                </button>
              )}
              <span className={styles.likesCount}>
                {recipe.likesCount} likes
              </span>
            </div>
          </div>
        </div>

        {/* Описание и остальное */}
        <MetaInfo
          category={recipe.category}
          yieldInfo={recipe.yield}
          servingSize={recipe.serving_size}
          prepTime={recipe.prep_time}
          temperature={recipe.temperature}
        />
        <Equipment items={recipe.equipment} />
        <Instructions groups={recipe.instructions.groups} />
        <Extras items={recipe.extras} />

        {/* Комментарии */}
        <h3>Комментарии</h3>
        <CommentList
          comments={comments}
          currentUserId={user?.id || null}
          onLikeToggle={handleLikeToggleAuth}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
        {user && <CommentForm onSubmit={handleAddCommentAuth} />}
        {!user && (
          <div className={styles.loginPrompt}>
            <p>
              To leave a comment,{" "}
              <button
                type="button"
                className={styles.loginBtn}
                onClick={() => setShowRegisterModal(true)}
              >
                Log in or sign up
              </button>
              .
            </p>
          </div>
        )}

        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          from={location.pathname}
        />
      </div>
    </div>
  );
}
