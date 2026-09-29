import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./AdminUserProfile.module.css";

import RecipeCard from "../../HomePage/RecipeCard/RecipeCard";
import Comment from "../../Comment/Comment/Comment";
import CommentList from "../../Comment/CommentList/CommentList";

export default function AdminUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({
    name: "",
    email: "",
    role: "",
    isActive: false,
  });
  const [userRecipes, setUserRecipes] = useState([]);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/admin/users/${id}`);
        setUserProfile(res.data.user);
        setUserRecipes(res.data.recipes);
        setUserComments(res.data.comments);
        setEditableFields({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          isActive: res.data.user.isActive,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id, currentUser, navigate]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/admin/users/${id}`, editableFields);
      setUserProfile(res.data.user);
      setIsEditing(false);
      alert("User profile updated successfully!");
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError("Failed to update user profile.");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = !userProfile.isActive;
      const res = await api.patch(`/api/admin/users/${id}/status`, {
        isActive: newStatus,
      });
      setUserProfile(res.data.user);
      setEditableFields((prev) => ({ ...prev, isActive: newStatus }));
      alert(`User ${newStatus ? "unblocked" : "blocked"}!`);
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Failed to change user status.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user and all related data (recipes, comments)?"
      )
    ) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        alert("User deleted successfully!");
        navigate("/admin");
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className={styles.empty}>User profile not found.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className="container">
        <div className={styles.profileHeader}>
          <h2 className={styles.heading}>User Profile: {userProfile.name}</h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            &larr; Back to list
          </button>
        </div>

        <div className={styles.profileInfo}>
          <img
            src={
              userProfile.avatar ||
              (userProfile._id
                ? `https://robohash.org/${userProfile._id}`
                : `https://robohash.org/default`)
            }
            alt={userProfile.name}
            className={styles.profileAvatar}
          />
          <div className={styles.infoDetails}>
            <div className={styles.infoItem}>
              <label className={styles.label}>ID:</label>
              <span className={styles.value}>{userProfile._id}</span>
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableFields.name}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{userProfile.name}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableFields.email}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{userProfile.email}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Role:</label>
              {isEditing ? (
                <select
                  name="role"
                  value={editableFields.role}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span className={styles.value}>{userProfile.role}</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Active:</label>
              {isEditing ? (
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editableFields.isActive}
                  onChange={handleFieldChange}
                  className={styles.checkboxInput}
                />
              ) : (
                <span className={styles.value}>
                  {userProfile.isActive ? "Yes" : "No"}
                </span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Registration Date:</label>
              <span className={styles.value}>
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit
            </button>
          )}
          <button
            onClick={handleToggleStatus}
            className={
              userProfile.isActive ? styles.blockButton : styles.unblockButton
            }
          >
            {userProfile.isActive ? "Block" : "Unblock"}
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete User
          </button>
        </div>

        {/* Placeholder for user's recipes and comments */}
        <div className={styles.userContentSections}>
          <h3 className={styles.sectionHeading}>User Recipes</h3>
          {userRecipes.length > 0 ? (
            <div className={styles.recipeGrid}>
              {userRecipes.map((recipe) => (
                <Link to={`/admin/recipes/${recipe._id}`} key={recipe._id}>
                  <RecipeCard
                    id={recipe._id}
                    title={recipe.title}
                    price={recipe.price || "$–"}
                    img={recipe.image}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.noContent}>
              This user has not published any recipes yet.
            </p>
          )}

          <h3 className={styles.sectionHeading}>User Comments</h3>
          {userComments.length > 0 ? (
            <CommentList
              comments={userComments}
              currentUserId={currentUser?.id || null}
              onLikeToggle={(commentId) =>
                console.log(`Toggle like for comment ${commentId}`)
              }
              onEdit={(commentId, newText) =>
                console.log(`Edit comment ${commentId}: ${newText}`)
              }
              onDelete={(commentId) =>
                console.log(`Delete comment ${commentId}`)
              }
              onAddReply={(replyText, parentId) =>
                console.log(`Add reply to ${parentId}: ${replyText}`)
              }
            />
          ) : (
            <p className={styles.noContent}>
              This user has not left any comments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
