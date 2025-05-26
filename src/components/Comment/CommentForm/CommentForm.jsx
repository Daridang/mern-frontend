import React, { useState } from "react";
import styles from "./CommentForm.module.css";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <button className={styles.button} type="submit">
        Post Comment
      </button>
    </form>
  );
}
