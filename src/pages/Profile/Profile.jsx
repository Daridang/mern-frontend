import React, { useContext, useState, useEffect } from "react";
import api from "../../axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Profile.module.css";
import CommentList from "../../components/Comment/CommentList/CommentList";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Profile() {
  const { user, updateUser, deleteUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userComments, setUserComments] = useState([]);
  const [activeTab, setActiveTab] = useState("my");
  const [likedComments, setLikedComments] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const res = await api.get(`/api/comments/user/${user.id}`);
        setUserComments(res.data);
      } catch (error) {
        console.error("Error fetching user comments:", error);
      }
    };

    if (user?.id) {
      fetchUserComments();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "liked" && likedComments.length === 0) {
      api
        .get(`/api/comments/liked`)
        .then((res) => setLikedComments(res.data))
        .catch((err) =>
          console.error("Ошибка при загрузке понравившихся:", err)
        );
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "recipes" && userRecipes.length === 0) {
      api
        .get(`/api/recipes/user/${user.id}`)
        .then((res) => setUserRecipes(res.data))
        .catch((err) => console.error("Error fetching user recipes:", err));
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    try {
      const result = await updateUser(formData);

      if (result.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setFormError(result.error || "Failed to update profile");
      }
    } catch (error) {
      setFormError("An unexpected error occurred");
      console.error("Profile update error:", error);
    }
  };

  const handleLikeToggle = async (commentId) => {
    try {
      const res = await api.patch(`/api/comments/${commentId}/like`);
      setUserComments((prev) =>
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
      const res = await api.put(`/api/comments/${commentId}`, {
        text: newText,
      });
      setUserComments((prev) =>
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
      const res = await api.get(`/api/comments/user/${user.id}`);
      setUserComments(res.data);
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleDeleteProfile = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setFormError("");
      setSuccessMessage("");
      const result = await deleteUser();
      if (result.success) {
        setSuccessMessage("Profile deleted successfully!");
        navigate("/");
      } else {
        setFormError(result.error || "Failed to delete profile.");
      }
    } catch (error) {
      setFormError("An unexpected error occurred during profile deletion.");
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Your Profile</h2>

      {formError && <div className={styles.error}>{formError}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {!isEditing ? (
        <div className={styles.profileInfo}>
          <img
            src={`https://robohash.org/${user.id}`}
            alt="User Avatar"
            className={styles.profileAvatar}
          />
          <div className={styles.infoItem}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{user?.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user?.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Account Created:</span>
            <span className={styles.value}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className={styles.deleteProfileButton}
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user?.name || "",
                  email: user?.email || "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className={styles.tabs}>
        <button
          className={activeTab === "my" ? styles.activeTab : ""}
          onClick={() => handleTabChange("my")}
        >
          Мои комментарии
        </button>
        <button
          className={activeTab === "liked" ? styles.activeTab : ""}
          onClick={() => handleTabChange("liked")}
        >
          Понравившиеся
        </button>
        <button
          className={activeTab === "recipes" ? styles.activeTab : ""}
          onClick={() => handleTabChange("recipes")}
        >
          Мои рецепты
        </button>
      </div>
      {activeTab === "my" && (
        <CommentList
          comments={userComments}
          currentUserId={user.id}
          onLikeToggle={handleLikeToggle}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      )}
      {activeTab === "liked" && (
        <CommentList
          comments={likedComments}
          currentUserId={user.id}
          onLikeToggle={handleLikeToggle}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      )}
      {activeTab === "recipes" && (
        <div className={styles.recipeList}>
          {userRecipes.length === 0 ? (
            <p>You have no recipes yet.</p>
          ) : (
            userRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className={styles.recipeCard}
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className={styles.recipeImage}
                />
                <div>
                  <h4>{recipe.title}</h4>
                  <p>{recipe.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
