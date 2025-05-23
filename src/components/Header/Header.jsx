import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>🌌 SpaceCafe</div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Home
        </NavLink>

        {!token ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Profile
            </NavLink>
            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
