import React, { useState, useEffect } from "react";
import styles from "./SearchInput.module.css";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Поиск...",
  debounceTime = 300,
}) {
  const [inputValue, setInputValue] = useState(value);

  // Update internal state when external value changes (e.g., reset by parent)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounceTime, onChange]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      className={styles.searchInput}
    />
  );
}
