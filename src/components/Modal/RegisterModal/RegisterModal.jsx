import React from "react";
import Modal from "../Modal";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ isOpen, onClose, from }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login", { state: { from: { pathname: from } } });
    onClose();
  };

  const handleRegister = () => {
    navigate("/register", { state: { from: { pathname: from } } });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.heading}>Sign up or log in</h2>
      <p className={styles.text}>
        Only registered users can like recipes. Please sign up or log in to
        continue.
      </p>
      <div className={styles.actions}>
        <Link
          to="/register"
          state={{ from: { pathname: from } }}
          className={styles.signupBtn}
          onClick={onClose}
        >
          Sign up
        </Link>
        <Link
          to="/login"
          state={{ from: { pathname: from } }}
          className={styles.loginBtn}
          onClick={onClose}
        >
          Log in
        </Link>
      </div>
    </Modal>
  );
}
