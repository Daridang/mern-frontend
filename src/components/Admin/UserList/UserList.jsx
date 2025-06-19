import React, { useState, useEffect, useContext } from "react";
import api from "../../../axiosConfig";
import styles from "./UserList.module.css";
import { AuthContext } from "../../../context/AuthContext";
import SearchInput from "../../Common/SearchInput/SearchInput";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState(""); // '' for all, 'user', 'admin'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (currentSearchTerm) {
          params.append("search", currentSearchTerm);
        }
        if (filterRole) {
          params.append("role", filterRole);
        }
        const res = await api.get(`/api/admin/users?${params.toString()}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Не удалось загрузить список пользователей.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
      setError("У вас нет прав администратора для доступа к этой странице.");
    }
  }, [user, currentSearchTerm, filterRole]);

  if (error) return <p className={styles.error}>Ошибка: {error}</p>;

  return (
    <div className={styles.userListContainer}>
      <h3 className={styles.subHeading}>Управление пользователями</h3>

      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Поиск по имени или email..."
          disabled={loading}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={styles.selectInput}
          disabled={loading}
        >
          <option value="">Все роли</option>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Дата регистрации</th>
            {/* <th>Действия</th> */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className={styles.loadingCell}>
                Загрузка данных...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td data-label="ID:">{u.id}</td>
                <td data-label="Имя:">
                  <Link to={`/users/${u.id}`}>{u.name}</Link>
                </td>
                <td data-label="Email:">{u.email}</td>
                <td data-label="Роль:">{u.role}</td>
                <td data-label="Дата регистрации:">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                {/* <td>
                  <button>Редактировать</button>
                  <button>Удалить</button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.emptyCell}>
                Пользователи не найдены.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
