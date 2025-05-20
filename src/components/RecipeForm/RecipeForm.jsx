// src/components/RecipeForm/RecipeForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import ImageUpload from "./ImageUpload";
import IngredientsSection from "./IngredientsSection";
import EquipmentSection from "./EquipmentSection";
import InstructionsSection from "./InstructionsSection";
import ExtrasSection from "./ExtrasSection";
import styles from "./RecipeForm.module.css";

export default function RecipeForm() {
  const navigate = useNavigate();
  // Основные поля
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [yieldInfo, setYieldInfo] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [temperature, setTemperature] = useState("");
  const [imageFile, setImageFile] = useState(null);

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
    if (imageFile) formData.append("image", imageFile);

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
      const res = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/recipes`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log("Recipe created:", data);

      navigate("/");
    } catch (err) {
      console.error("Error creating recipe", err, err.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>New Recipe</h2>
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
      <ImageUpload {...{ imageFile, setImageFile }} />
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
        Create Recipe
      </button>
    </form>
  );
}
