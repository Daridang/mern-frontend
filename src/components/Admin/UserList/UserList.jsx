// #region UserList Component
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
  const [filterRole, setFilterRole] = useState("");

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
        setError("Failed to load user list.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
      setError("You do not have admin rights to access this page.");
    }
  }, [user, currentSearchTerm, filterRole]);

  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.userListContainer}>
      <h3 className={styles.subHeading}>Manage Users</h3>
      <div className={styles.filters}>
        <SearchInput
          value={currentSearchTerm}
          onChange={setCurrentSearchTerm}
          placeholder="Search by name or email..."
          disabled={loading}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={styles.selectInput}
          disabled={loading}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className={styles.loadingCell}>
                Loading data...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td data-label="ID:">{u.id}</td>
                <td data-label="Name:">
                  <Link to={`/admin/users/${u._id}`}>{u.name}</Link>
                </td>
                <td data-label="Email:">{u.email}</td>
                <td data-label="Role:">{u.role}</td>
                <td data-label="Registration Date:">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.emptyCell}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// #endregion
