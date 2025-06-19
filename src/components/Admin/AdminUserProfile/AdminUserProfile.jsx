import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./AdminUserProfile.module.css";

import RecipeCard from "../../HomePage/RecipeCard/RecipeCard";
import Comment from "../../Comment/Comment/Comment";

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
        setUserProfile(res.data);
        setEditableFields({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          isActive: res.data.isActive,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Не удалось загрузить профиль пользователя.");
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
      alert("Профиль пользователя успешно обновлен!");
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError("Не удалось обновить профиль пользователя.");
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
      alert(`Пользователь ${newStatus ? "разблокирован" : "заблокирован"}!`);
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Не удалось изменить статус пользователя.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этого пользователя и все связанные с ним данные (рецепты, комментарии)?"
      )
    ) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        alert("Пользователь успешно удален!");
        navigate("/admin"); // Go back to user list after deletion
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Не удалось удалить пользователя.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (!userProfile) {
    return <div className={styles.empty}>Профиль пользователя не найден.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className="container">
        <div className={styles.profileHeader}>
          <h2 className={styles.heading}>
            Профиль пользователя: {userProfile.name}
          </h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            &larr; Назад к списку
          </button>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.avatarPlaceholder}></div>{" "}
          {/* Placeholder for avatar */}
          <div className={styles.infoDetails}>
            <div className={styles.infoItem}>
              <label className={styles.label}>ID:</label>
              <span className={styles.value}>{userProfile._id}</span>
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Имя:</label>
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
              <label className={styles.label}>Роль:</label>
              {isEditing ? (
                <select
                  name="role"
                  value={editableFields.role}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              ) : (
                <span className={styles.value}>{userProfile.role}</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Активен:</label>
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
                  {userProfile.isActive ? "Да" : "Нет"}
                </span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Дата регистрации:</label>
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
                Сохранить
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Редактировать
            </button>
          )}
          <button
            onClick={handleToggleStatus}
            className={
              userProfile.isActive ? styles.blockButton : styles.unblockButton
            }
          >
            {userProfile.isActive ? "Заблокировать" : "Разблокировать"}
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Удалить пользователя
          </button>
        </div>

        {/* Placeholder for user's recipes and comments */}
        <div className={styles.userContentSections}>
          <h3 className={styles.sectionHeading}>Рецепты пользователя</h3>
          {/* Render user's recipes here */}
          <p>Список рецептов этого пользователя будет здесь.</p>

          <h3 className={styles.sectionHeading}>Комментарии пользователя</h3>
          {/* Render user's comments here */}
          <p>Список комментариев этого пользователя будет здесь.</p>
        </div>
      </div>
    </div>
  );
}
