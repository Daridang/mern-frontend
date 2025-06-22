import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.headerContent} container`}>
        <div className={styles.logo}>🌌 SpaceCafe</div>
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>

          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button className={styles.logout} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
