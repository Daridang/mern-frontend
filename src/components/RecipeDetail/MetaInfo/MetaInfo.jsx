// MetaInfo.jsx
import React from "react";
import styles from "./MetaInfo.module.css";

export default function MetaInfo({
  category,
  yieldInfo,
  servingSize,
  prepTime,
  temperature,
}) {
  const items = [
    { label: "Category", value: category },
    { label: "Yield", value: yieldInfo },
    { label: "Serving", value: servingSize },
    { label: "Prep Time", value: prepTime },
    { label: "Temp", value: temperature },
  ];
  return (
    <ul className={styles.list}>
      {items.map((i) => (
        <li key={i.label}>
          <strong>{i.label}:</strong> {i.value}
        </li>
      ))}
    </ul>
  );
}
