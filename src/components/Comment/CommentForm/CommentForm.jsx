import React, { useState } from "react";
import styles from "./CommentForm.module.css";

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
