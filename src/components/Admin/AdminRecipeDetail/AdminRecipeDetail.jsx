import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [editableFields, setEditableFields] = useState({
    title: "",
    description: "",
    category: "",
    yield: "",
    serving_size: "",
    prep_time: "",
    temperature: "",
    // Инициализируем полные структуры для редактирования
    ingredients: { groups: [] },
    equipment: [],
    instructions: { groups: [] },
    extras: [],
    image: "", // Для отображения существующего изображения
  });

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
        const recipeData = res.data;
        setRecipe(recipeData);
        setEditableFields({
          title: recipeData.title || "",
          description: recipeData.description || "",
          category: recipeData.category || "",
          yield: recipeData.yield || "",
          serving_size: recipeData.serving_size || "",
          prep_time: recipeData.prep_time || "",
          temperature: recipeData.temperature || "",
          ingredients: recipeData.ingredients || { groups: [] },
          equipment: recipeData.equipment || [],
          instructions: recipeData.instructions || { groups: [] },
          extras: recipeData.extras || [],
          image: recipeData.image || "",
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

  // --- Handlers для Ingredients ---
  const handleAddIngredientGroup = () => {
    setEditableFields((prev) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        groups: [
          ...(prev.ingredients?.groups || []),
          { name: "", items: [{ item: "", amount: "" }] },
        ],
      },
    }));
  };

  const handleRemoveIngredientGroup = (idx) => {
    setEditableFields((prev) => {
      const newGroups = (prev.ingredients?.groups || []).filter(
        (_, i) => i !== idx
      );
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          groups: newGroups,
        },
      };
    });
  };

  const handleIngredientGroupNameChange = (grpIdx, val) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.ingredients?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].name = val;
      }
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          groups: newGroups,
        },
      };
    });
  };

  const handleAddIngredientItem = (grpIdx) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.ingredients?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].items.push({ item: "", amount: "" });
      }
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          groups: newGroups,
        },
      };
    });
  };

  const handleRemoveIngredientItem = (grpIdx, itemIdx) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.ingredients?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].items = newGroups[grpIdx].items.filter(
          (_, i) => i !== itemIdx
        );
      }
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          groups: newGroups,
        },
      };
    });
  };

  const handleIngredientItemChange = (grpIdx, itemIdx, field, val) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.ingredients?.groups || [])];
      if (newGroups[grpIdx] && newGroups[grpIdx].items[itemIdx]) {
        newGroups[grpIdx].items[itemIdx][field] = val;
      }
      return {
        ...prev,
        ingredients: {
          ...prev.ingredients,
          groups: newGroups,
        },
      };
    });
  };

  // --- Handlers для Equipment ---
  const handleAddEquipment = () => {
    setEditableFields((prev) => ({
      ...prev,
      equipment: [...(prev.equipment || []), ""],
    }));
  };

  const handleRemoveEquipment = (idx) => {
    setEditableFields((prev) => ({
      ...prev,
      equipment: (prev.equipment || []).filter((_, i) => i !== idx),
    }));
  };

  const handleEquipmentChange = (idx, val) => {
    setEditableFields((prev) => {
      const newEquipment = [...(prev.equipment || [])];
      newEquipment[idx] = val;
      return {
        ...prev,
        equipment: newEquipment,
      };
    });
  };

  // --- Handlers для Instructions ---
  const handleAddInstructionGroup = () => {
    setEditableFields((prev) => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        groups: [
          ...(prev.instructions?.groups || []),
          { name: "", steps: [""] },
        ],
      },
    }));
  };

  const handleRemoveInstructionGroup = (idx) => {
    setEditableFields((prev) => {
      const newGroups = (prev.instructions?.groups || []).filter(
        (_, i) => i !== idx
      );
      return {
        ...prev,
        instructions: {
          ...prev.instructions,
          groups: newGroups,
        },
      };
    });
  };

  const handleInstructionGroupNameChange = (grpIdx, val) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.instructions?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].name = val;
      }
      return {
        ...prev,
        instructions: {
          ...prev.instructions,
          groups: newGroups,
        },
      };
    });
  };

  const handleAddStep = (grpIdx) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.instructions?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].steps.push("");
      }
      return {
        ...prev,
        instructions: {
          ...prev.instructions,
          groups: newGroups,
        },
      };
    });
  };

  const handleRemoveStep = (grpIdx, stepIdx) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.instructions?.groups || [])];
      if (newGroups[grpIdx]) {
        newGroups[grpIdx].steps = newGroups[grpIdx].steps.filter(
          (_, i) => i !== stepIdx
        );
      }
      return {
        ...prev,
        instructions: {
          ...prev.instructions,
          groups: newGroups,
        },
      };
    });
  };

  const handleStepChange = (grpIdx, stepIdx, val) => {
    setEditableFields((prev) => {
      const newGroups = [...(prev.instructions?.groups || [])];
      if (newGroups[grpIdx] && newGroups[grpIdx].steps[stepIdx]) {
        newGroups[grpIdx].steps[stepIdx] = val;
      }
      return {
        ...prev,
        instructions: {
          ...prev.instructions,
          groups: newGroups,
        },
      };
    });
  };

  // --- Handlers для Extras ---
  const handleAddExtra = () => {
    setEditableFields((prev) => ({
      ...prev,
      extras: [...(prev.extras || []), ""],
    }));
  };

  const handleRemoveExtra = (idx) => {
    setEditableFields((prev) => ({
      ...prev,
      extras: (prev.extras || []).filter((_, i) => i !== idx),
    }));
  };

  const handleExtraChange = (idx, val) => {
    setEditableFields((prev) => {
      const newExtras = [...(prev.extras || [])];
      newExtras[idx] = val;
      return {
        ...prev,
        extras: newExtras,
      };
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      // Добавляем все простые поля
      for (const key in editableFields) {
        if (
          typeof editableFields[key] === "string" ||
          typeof editableFields[key] === "number"
        ) {
          formData.append(key, editableFields[key]);
        }
      }

      // Добавляем сложные поля как JSON-строки
      formData.append(
        "ingredients",
        JSON.stringify(editableFields.ingredients)
      );
      formData.append("equipment", JSON.stringify(editableFields.equipment));
      formData.append(
        "instructions",
        JSON.stringify(editableFields.instructions)
      );
      formData.append("extras", JSON.stringify(editableFields.extras));

      const res = await api.put(`/api/admin/recipes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.imageWrapper}>
            {editableFields.image ? (
              <img
                src={editableFields.image}
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
                <span className={styles.value}>{recipe.author.name}</span>
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
            <div className={styles.infoItem}>
              <label className={styles.label}>Лайки:</label>
              <span className={styles.value}>{recipe.likesCount}</span>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.label}>Комментарии:</label>
              <span className={styles.value}>{recipe.commentsCount}</span>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Ингредиенты</h3>
          {isEditing ? (
            <div className={styles.groupsContainer}>
              {editableFields.ingredients.groups.map((group, grpIdx) => (
                <div key={grpIdx} className={styles.group}>
                  <input
                    type="text"
                    placeholder="Название группы (например, Тесто)"
                    value={group.name}
                    onChange={(e) =>
                      handleIngredientGroupNameChange(grpIdx, e.target.value)
                    }
                    className={styles.groupInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredientGroup(grpIdx)}
                    className={styles.removeGroupBtn}
                  >
                    Удалить группу
                  </button>
                  <div className={styles.itemsContainer}>
                    {group.items.map((item, itemIdx) => (
                      <div key={itemIdx} className={styles.itemRow}>
                        <input
                          type="text"
                          placeholder="Ингредиент (например, Мука)"
                          value={item.item}
                          onChange={(e) =>
                            handleIngredientItemChange(
                              grpIdx,
                              itemIdx,
                              "item",
                              e.target.value
                            )
                          }
                          className={styles.itemInput}
                        />
                        <input
                          type="text"
                          placeholder="Количество (например, 200г)"
                          value={item.amount}
                          onChange={(e) =>
                            handleIngredientItemChange(
                              grpIdx,
                              itemIdx,
                              "amount",
                              e.target.value
                            )
                          }
                          className={styles.amountInput}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveIngredientItem(grpIdx, itemIdx)
                          }
                          className={styles.removeItemBtn}
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddIngredientItem(grpIdx)}
                    className={styles.addItemBtn}
                  >
                    Добавить ингредиент
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredientGroup}
                className={styles.addGroupBtn}
              >
                Добавить группу ингредиентов
              </button>
            </div>
          ) : editableFields.ingredients?.groups?.length > 0 ? (
            <div
              className={styles.displayContent}
              onClick={() => setIsEditing(true)}
            >
              {editableFields.ingredients.groups.map((group, grpIdx) => (
                <div key={grpIdx} className={styles.displayGroup}>
                  {group.name && (
                    <h4 className={styles.displayGroupName}>{group.name}</h4>
                  )}
                  <ul className={styles.displayList}>
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className={styles.displayItem}>
                        {item.item} {item.amount && `(${item.amount})`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noContent}>Ингредиенты не указаны.</p>
          )}
        </div>

        {/* Equipment Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Оборудование</h3>
          {isEditing ? (
            <div className={styles.listContainer}>
              {editableFields.equipment.map((item, idx) => (
                <div key={idx} className={styles.listItemRow}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleEquipmentChange(idx, e.target.value)}
                    className={styles.listInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipment(idx)}
                    className={styles.removeItemBtn}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEquipment}
                className={styles.addItemBtn}
              >
                Добавить оборудование
              </button>
            </div>
          ) : editableFields.equipment?.length > 0 ? (
            <ul
              className={styles.displayList}
              onClick={() => setIsEditing(true)}
            >
              {editableFields.equipment.map((item, idx) => (
                <li key={idx} className={styles.displayItem}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noContent}>Оборудование не указано.</p>
          )}
        </div>

        {/* Instructions Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Инструкции</h3>
          {isEditing ? (
            <div className={styles.groupsContainer}>
              {editableFields.instructions.groups.map((group, grpIdx) => (
                <div key={grpIdx} className={styles.group}>
                  <input
                    type="text"
                    placeholder="Название группы (например, Приготовление)"
                    value={group.name}
                    onChange={(e) =>
                      handleInstructionGroupNameChange(grpIdx, e.target.value)
                    }
                    className={styles.groupInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstructionGroup(grpIdx)}
                    className={styles.removeGroupBtn}
                  >
                    Удалить группу
                  </button>
                  <div className={styles.itemsContainer}>
                    {group.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className={styles.itemRow}>
                        <textarea
                          placeholder="Шаг инструкции"
                          value={step}
                          onChange={(e) =>
                            handleStepChange(grpIdx, stepIdx, e.target.value)
                          }
                          className={styles.textareaInput}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(grpIdx, stepIdx)}
                          className={styles.removeItemBtn}
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddStep(grpIdx)}
                    className={styles.addItemBtn}
                  >
                    Добавить шаг
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddInstructionGroup}
                className={styles.addGroupBtn}
              >
                Добавить группу инструкций
              </button>
            </div>
          ) : editableFields.instructions?.groups?.length > 0 ? (
            <div
              className={styles.displayContent}
              onClick={() => setIsEditing(true)}
            >
              {editableFields.instructions.groups.map((group, grpIdx) => (
                <div key={grpIdx} className={styles.displayGroup}>
                  {group.name && (
                    <h4 className={styles.displayGroupName}>{group.name}</h4>
                  )}
                  <ol className={styles.displayList}>
                    {group.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className={styles.displayItem}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noContent}>Инструкции не указаны.</p>
          )}
        </div>

        {/* Extras Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Дополнительно</h3>
          {isEditing ? (
            <div className={styles.listContainer}>
              {editableFields.extras.map((item, idx) => (
                <div key={idx} className={styles.listItemRow}>
                  <textarea
                    value={item}
                    onChange={(e) => handleExtraChange(idx, e.target.value)}
                    className={styles.textareaInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtra(idx)}
                    className={styles.removeItemBtn}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExtra}
                className={styles.addItemBtn}
              >
                Добавить дополнительную заметку
              </button>
            </div>
          ) : editableFields.extras?.length > 0 ? (
            <ul
              className={styles.displayList}
              onClick={() => setIsEditing(true)}
            >
              {editableFields.extras.map((item, idx) => (
                <li key={idx} className={styles.displayItem}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noContent}>
              Дополнительные заметки отсутствуют.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
