// src/components/RecipeForm/RecipeForm.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../axiosConfig";
import BasicInfo from "./BasicInfo";
import ImageUpload from "./ImageUpload";
import IngredientsSection from "./IngredientsSection";
import EquipmentSection from "./EquipmentSection";
import InstructionsSection from "./InstructionsSection";
import ExtrasSection from "./ExtrasSection";
import styles from "./RecipeForm.module.css";

export default function RecipeForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: recipeId } = useParams();

  // Основные поля
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [yieldInfo, setYieldInfo] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [temperature, setTemperature] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Ингредиенты
  const [ingredientsGroups, setIngredientsGroups] = useState([
    { name: "", items: [{ item: "", amount: "" }] },
  ]);

  // Оборудование
  const [equipment, setEquipment] = useState([""]);

  // Инструкции
  const [instructionsGroups, setInstructionsGroups] = useState([
    { name: "", steps: [""] },
  ]);

  // Экстры
  const [extras, setExtras] = useState([""]);

  useEffect(() => {
    if (recipeId) {
      // Editing existing recipe
      const fetchRecipe = async () => {
        try {
          const res = await api.get(`/api/recipes/${recipeId}`);
          const recipeData = res.data;

          setTitle(recipeData.title || "");
          setDescription(recipeData.description || "");
          setCategory(recipeData.category || "");
          setYieldInfo(recipeData.yield || "");
          setServingSize(recipeData.serving_size || "");
          setPrepTime(recipeData.prep_time || "");
          setTemperature(recipeData.temperature || "");
          setExistingImage(recipeData.image || ""); // Set existing image URL

          setIngredientsGroups(
            recipeData.ingredients?.groups || [
              { name: "", items: [{ item: "", amount: "" }] },
            ]
          );
          setEquipment(recipeData.equipment || [""]);
          setInstructionsGroups(
            recipeData.instructions?.groups || [{ name: "", steps: [""] }]
          );
          setExtras(recipeData.extras || [""]);
        } catch (err) {
          console.error("Error fetching recipe for edit:", err);
          setError("Failed to load recipe for editing.");
          navigate("/recipes");
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    } else {
      // Creating new recipe
      setLoading(false);
    }
  }, [recipeId, navigate]);

  // --- Handlers для Ingredients ---
  const handleAddGroup = () => {
    setIngredientsGroups([
      ...ingredientsGroups,
      { name: "", items: [{ item: "", amount: "" }] },
    ]);
  };
  const handleRemoveGroup = (idx) => {
    setIngredientsGroups(ingredientsGroups.filter((_, i) => i !== idx));
  };
  const handleGroupNameChange = (idx, val) => {
    const newG = [...ingredientsGroups];
    newG[idx].name = val;
    setIngredientsGroups(newG);
  };
  const handleAddItem = (grpIdx) => {
    const newG = [...ingredientsGroups];
    newG[grpIdx].items.push({ item: "", amount: "" });
    setIngredientsGroups(newG);
  };
  const handleRemoveItem = (grpIdx, itemIdx) => {
    const newG = [...ingredientsGroups];
    newG[grpIdx].items = newG[grpIdx].items.filter((_, i) => i !== itemIdx);
    setIngredientsGroups(newG);
  };
  const handleItemChange = (grpIdx, itemIdx, field, val) => {
    const newG = [...ingredientsGroups];
    newG[grpIdx].items[itemIdx][field] = val;
    setIngredientsGroups(newG);
  };

  // --- Handlers для Equipment ---
  const handleAddEquipment = () => setEquipment([...equipment, ""]);
  const handleRemoveEquipment = (idx) =>
    setEquipment(equipment.filter((_, i) => i !== idx));
  const handleEquipmentChange = (idx, val) => {
    const arr = [...equipment];
    arr[idx] = val;
    setEquipment(arr);
  };

  // --- Handlers для Instructions ---
  const handleAddInstrGroup = () =>
    setInstructionsGroups([...instructionsGroups, { name: "", steps: [""] }]);
  const handleRemoveInstrGroup = (idx) =>
    setInstructionsGroups(instructionsGroups.filter((_, i) => i !== idx));
  const handleInstrGroupName = (idx, val) => {
    const arr = [...instructionsGroups];
    arr[idx].name = val;
    setInstructionsGroups(arr);
  };
  const handleAddStep = (grpIdx) => {
    const arr = [...instructionsGroups];
    arr[grpIdx].steps.push("");
    setInstructionsGroups(arr);
  };
  const handleRemoveStep = (grpIdx, stepIdx) => {
    const arr = [...instructionsGroups];
    arr[grpIdx].steps = arr[grpIdx].steps.filter((_, i) => i !== stepIdx);
    setInstructionsGroups(arr);
  };
  const handleStepChange = (grpIdx, stepIdx, val) => {
    const arr = [...instructionsGroups];
    arr[grpIdx].steps[stepIdx] = val;
    setInstructionsGroups(arr);
  };

  // --- Handlers для Extras ---
  const handleAddExtra = () => setExtras([...extras, ""]);
  const handleRemoveExtra = (idx) =>
    setExtras(extras.filter((_, i) => i !== idx));
  const handleExtraChange = (idx, val) => {
    const arr = [...extras];
    arr[idx] = val;
    setExtras(arr);
  };

  // New handler for filling from JSON
  const handleFillFromJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        // Populate form fields
        setTitle(json.title || "");
        setDescription(json.description || "");
        setCategory(json.category || "");
        setYieldInfo(json.yield || "");
        setServingSize(json.serving_size || "");
        setPrepTime(json.prep_time || "");
        setTemperature(json.temperature || "");
        // Note: Image cannot be directly set from a JSON path without a file upload
        // setExistingImage(json.image || ""); // This would only work if it's a URL already accessible

        setIngredientsGroups(
          json.ingredients?.groups || [
            { name: "", items: [{ item: "", amount: "" }] },
          ]
        );
        setEquipment(json.equipment || [""]);
        setInstructionsGroups(
          json.instructions?.groups || [{ name: "", steps: [""] }]
        );
        setExtras(json.extras || [""]);
        setError("");
      } catch (err) {
        setError("Invalid JSON file.");
        console.error("Error parsing JSON:", err);
      }
    };
    reader.readAsText(file);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("yield", yieldInfo);
    formData.append("serving_size", servingSize);
    formData.append("prep_time", prepTime);
    formData.append("temperature", temperature);
    // Only append author if creating a new recipe
    if (!recipeId) {
      formData.append("author", user.id);
    }

    // Handle image update for both new and existing recipes
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (recipeId && !existingImage) {
      // If in edit mode and image was removed (existingImage is empty), send a flag
      formData.append("clearImage", "true");
    }

    formData.append(
      "ingredients",
      JSON.stringify({ groups: ingredientsGroups })
    );
    formData.append("equipment", JSON.stringify(equipment));
    formData.append(
      "instructions",
      JSON.stringify({ groups: instructionsGroups })
    );
    formData.append("extras", JSON.stringify(extras));

    try {
      let res;
      if (recipeId) {
        // Update existing recipe
        res = await api.put(`/api/recipes/${recipeId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new recipe
        res = await api.post("/api/recipes", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      const data = res.data;
      navigate(`/recipes/${data._id}`);
    } catch (err) {
      console.error(
        recipeId ? "Error updating recipe" : "Error creating recipe",
        err,
        err.message
      );
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{recipeId ? "Edit Recipe" : "New Recipe"}</h2>
      {error && <div className={styles.error}>{error}</div>}

      <input
        type="file"
        id="jsonUpload"
        accept=".json"
        onChange={handleFillFromJson}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className={styles.fillFromJsonBtn}
        onClick={() => document.getElementById("jsonUpload").click()}
      >
        Заполнить из JSON
      </button>

      <BasicInfo
        {...{
          title,
          setTitle,
          description,
          setDescription,
          category,
          setCategory,
          yieldInfo,
          setYieldInfo,
          servingSize,
          setServingSize,
          prepTime,
          setPrepTime,
          temperature,
          setTemperature,
        }}
      />
      <ImageUpload
        {...{ imageFile, setImageFile, existingImage, setExistingImage }}
      />
      <IngredientsSection
        {...{
          groups: ingredientsGroups,
          handleAddGroup,
          handleRemoveGroup,
          handleGroupNameChange,
          handleAddItem,
          handleRemoveItem,
          handleItemChange,
        }}
      />
      <EquipmentSection
        {...{
          equipment,
          handleAddEquipment,
          handleRemoveEquipment,
          handleEquipmentChange,
        }}
      />
      <InstructionsSection
        {...{
          groups: instructionsGroups,
          handleAddInstrGroup,
          handleRemoveInstrGroup,
          handleInstrGroupName,
          handleAddStep,
          handleRemoveStep,
          handleStepChange,
        }}
      />
      <ExtrasSection
        {...{ extras, handleAddExtra, handleRemoveExtra, handleExtraChange }}
      />
      <button type="submit" className={styles.submitBtn}>
        {recipeId ? "Update Recipe" : "Create Recipe"}
      </button>
    </form>
  );
}
