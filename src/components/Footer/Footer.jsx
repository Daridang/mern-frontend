import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} container`}>
        <p>Footer</p>
      </div>
    </footer>
  );
}
