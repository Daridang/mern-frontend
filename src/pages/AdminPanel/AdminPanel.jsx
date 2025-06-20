import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";
import UserList from "../../components/Admin/UserList/UserList";
import AdminRecipeList from "../../components/Admin/AdminRecipeList/AdminRecipeList";
import AdminCommentList from "../../components/Admin/AdminCommentList/AdminCommentList";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className={styles.adminPanel}>
      <div className="container">
        <h2 className={styles.heading}>Админ-панель</h2>
        <div className={styles.tabs}>
          <button
            className={activeTab === "users" ? styles.activeTab : ""}
            onClick={() => handleTabChange("users")}
          >
            Пользователи
          </button>
          <button
            className={activeTab === "recipes" ? styles.activeTab : ""}
            onClick={() => handleTabChange("recipes")}
          >
            Рецепты
          </button>
          <button
            className={activeTab === "comments" ? styles.activeTab : ""}
            onClick={() => handleTabChange("comments")}
          >
            Комментарии
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "users" && <UserList />}
          {activeTab === "recipes" && <AdminRecipeList />}
          {activeTab === "comments" && <AdminCommentList />}
        </div>
      </div>
    </div>
  );
}
