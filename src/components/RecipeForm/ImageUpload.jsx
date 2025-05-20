// src/components/RecipeForm/ImageUpload.jsx
import React, { useState, useEffect } from "react";
import styles from "./RecipeForm.module.css";

export default function ImageUpload({ imageFile, setImageFile }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Create a preview URL when imageFile changes
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    // Create a URL for the file
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    // Clean up the URL when component unmounts or imageFile changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You can add validation here if needed
      // For example, check file type or size
      setImageFile(file);
    }
  };

  return (
    <section className={styles.section}>
      <h3>Image</h3>
      {previewUrl && (
        <div className={styles.imagePreview}>
          <img
            src={previewUrl}
            alt="Recipe preview"
            className={styles.previewImage}
          />
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleOnChange} />
    </section>
  );
}
