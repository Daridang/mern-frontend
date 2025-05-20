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
      const response = await fetch(
        // `${process.env.REACT_APP_API_URL}/api/upload`,
        `http://localhost:5000/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("File uploaded successfully", data.url);
      // optionally clear form
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
        Select Image
      </label>
      <input
        id="image"
        type="file"
        className={styles.fileInput}
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" className={styles.button}>
        Upload
      </button>
    </form>
  );
}
