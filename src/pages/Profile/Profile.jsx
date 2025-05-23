import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
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
    </div>
  );
}