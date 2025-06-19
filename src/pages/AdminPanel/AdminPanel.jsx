import React from "react";
import styles from "./AdminPanel.module.css";
import UserList from "../../components/Admin/UserList/UserList";

export default function AdminPanel() {
  return (
    <div className={styles.adminPanel}>
      <div className="container">
        <h2 className={styles.heading}>Админ-панель</h2>
        <UserList />
      </div>
    </div>
  );
}
