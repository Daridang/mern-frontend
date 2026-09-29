// #region ImageUploadForm Component
import React, { useState } from "react";
import styles from "./ImageUploadForm.module.css";

export default function ImageUploadForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await fetch(`http://localhost:5000/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("File uploaded successfully", data.url);
      setTitle("");
      setText("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Upload a New Recipe Image</h2>
      <label className={styles.label} htmlFor="title">
        Title
      </label>
      <input
        id="title"
        type="text"
        className={styles.input}
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className={styles.label} htmlFor="text">
        Description
      </label>
      <textarea
        id="text"
        className={styles.textarea}
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <label className={styles.label} htmlFor="image">
        Image
      </label>
      <input
        id="image"
        type="file"
        className={styles.input}
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button className={styles.button} type="submit">
        Upload
      </button>
    </form>
  );
}
// #endregion
