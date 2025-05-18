import React, { useState } from "react";

function ImageUploadForm() {
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
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("File uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default ImageUploadForm;
