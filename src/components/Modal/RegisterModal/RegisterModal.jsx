import React from "react";
import Modal from "../Modal";
import { Link } from "react-router-dom";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.heading}>Sign up or log in</h2>
      <p className={styles.text}>
        Only registered users can like recipes. Please sign up or log in to
        continue.
      </p>
      <div className={styles.actions}>
        <Link to="/register" onClick={onClose} className={styles.signupBtn}>
          Sign up
        </Link>
        <Link to="/login" onClick={onClose} className={styles.loginBtn}>
          Log in
        </Link>
      </div>
    </Modal>
  );
}
