import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./AdminRecipeDetail.module.css";

export default function AdminRecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/admin/recipes/${id}`);
        setRecipe(res.data);
        setEditableFields({
          title: res.data.title || "",
          description: res.data.description || "",
          category: res.data.category || "",
          yield: res.data.yield || "",
          serving_size: res.data.serving_size || "",
          prep_time: res.data.prep_time || "",
          temperature: res.data.temperature || "",
          // Note: Image will be handled by a separate component/logic if it involves file uploads
          // For now, only text fields are directly editable.
        });
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError("Не удалось загрузить данные рецепта.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, currentUser, navigate]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/admin/recipes/${id}`, editableFields);
      setRecipe(res.data.recipe);
      setIsEditing(false);
      alert("Рецепт успешно обновлен!");
    } catch (err) {
      console.error("Error updating recipe:", err);
      setError("Не удалось обновить рецепт.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этот рецепт и все связанные с ним данные (комментарии, лайки)?"
      )
    ) {
      try {
        await api.delete(`/api/admin/recipes/${id}`);
        alert("Рецепт успешно удален!");
        navigate("/admin?tab=recipes"); // Go back to recipe list after deletion
      } catch (err) {
        console.error("Error deleting recipe:", err);
        setError("Не удалось удалить рецепт.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка рецепта...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (!recipe) {
    return <div className={styles.empty}>Рецепт не найден.</div>;
  }

  return (
    <div className={styles.recipeDetailContainer}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Рецепт: {recipe.title}</h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            &larr; Назад к списку
          </button>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.imageWrapper}>
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.noImage}>Изображение отсутствует</div>
            )}
          </div>
          <div className={styles.details}>
            <div className={styles.infoItem}>
              <label className={styles.label}>ID:</label>
              <span className={styles.value}>{recipe._id}</span>
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Название:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editableFields.title}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.title}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Описание:</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editableFields.description}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.description}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Категория:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={editableFields.category}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.category}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Выход:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="yield"
                  value={editableFields.yield}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.yield}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Размер порции:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="serving_size"
                  value={editableFields.serving_size}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.serving_size}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Время подготовки:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="prep_time"
                  value={editableFields.prep_time}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.prep_time}</span>
              )}
            </div>
            <div className={styles.infoItem} onClick={() => setIsEditing(true)}>
              <label className={styles.label}>Температура:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="temperature"
                  value={editableFields.temperature}
                  onChange={handleFieldChange}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.value}>{recipe.temperature}</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Автор:</label>
              {recipe.author ? (
                <Link
                  to={`/admin/users/${recipe.author._id}`}
                  className={styles.authorLink}
                >
                  {recipe.author.name}
                </Link>
              ) : (
                <span className={styles.value}>N/A</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Дата создания:</label>
              <span className={styles.value}>
                {new Date(recipe.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Дата обновления:</label>
              <span className={styles.value}>
                {new Date(recipe.updated_at).toLocaleDateString()}
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
          <button onClick={handleDelete} className={styles.deleteButton}>
            Удалить рецепт
          </button>
        </div>

        {/* Optional: Display related comments or other data for the recipe */}
        <div className={styles.relatedContent}>
          <h3 className={styles.sectionHeading}>Комментарии к рецепту</h3>
          <p className={styles.noContent}>
            Список комментариев к этому рецепту будет здесь.
          </p>
        </div>
      </div>
    </div>
  );
}
