// src/components/RecipeForm/ImageUpload.jsx
import React, { useState, useEffect } from "react";
import styles from "./RecipeForm.module.css";

export default function ImageUpload({
  imageFile,
  setImageFile,
  existingImage,
  setExistingImage,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Create a preview URL when imageFile or existingImage changes
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (existingImage) {
      setPreviewUrl(existingImage);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile, existingImage]);

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setExistingImage(null);
    } else {
      setImageFile(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setExistingImage(null);
    setPreviewUrl(null);
  };

  return (
    <section className={styles.section}>
      <h3>Image</h3>
      {(previewUrl || existingImage) && (
        <div className={styles.imagePreview}>
          <img
            src={previewUrl || existingImage}
            alt="Recipe preview"
            className={styles.previewImage}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className={styles.removeImageBtn}
          >
            Remove Image
          </button>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleOnChange} />
    </section>
  );
}
