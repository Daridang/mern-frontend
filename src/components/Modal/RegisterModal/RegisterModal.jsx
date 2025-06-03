import React from "react";
import Modal from "../Modal";
import { Link } from "react-router-dom";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ isOpen, onClose, from }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.heading}>Sign up or log in</h2>
      <p className={styles.text}>
        Please sign up or log in to
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
