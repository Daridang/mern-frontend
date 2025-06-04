import React, { useContext, useState, useEffect } from "react";
import api from "../../axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Profile.module.css";
import CommentList from "../../components/Comment/CommentList/CommentList";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
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

  useEffect(() => {
    console.log(`ID ${user.id}`);
    const fetchUserComments = async () => {
      try {
        const res = await api.get(`/api/comments/user/${user.id}`);
        console.log(`res.data:`, res.data);

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

  // feat(profile): added tabs for own and liked comments of the user

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
      setUserComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Your Profile</h2>

      {formError && <div className={styles.error}>{formError}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {!isEditing ? (
        <div className={styles.profileInfo}>
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
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
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
          onClick={() => setActiveTab("my")}
        >
          Мои комментарии
        </button>
        <button
          className={activeTab === "liked" ? styles.activeTab : ""}
          onClick={() => setActiveTab("liked")}
        >
          Понравившиеся
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
    </div>
  );
}
