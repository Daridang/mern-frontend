import React, { useState } from "react";
import styles from "./CommentForm.module.css";

export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder,
  isReplyForm,
}) {
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
        placeholder={placeholder || "Write a comment..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <div className={styles.actions}>
        <button className={styles.button} type="submit">
          {isReplyForm ? "Ответить" : "Post Comment"}
        </button>
        {isReplyForm && (
          <button
            className={styles.cancelButton}
            type="button"
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
