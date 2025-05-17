import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
    const [data, setData] = useState("");
    
      useEffect(() => {
        fetch("https://mern-backend-wzrm.onrender.com/api/test")
          .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
          })
          .then((data) => setData(data.message))
          .catch((err) => {
            console.error("Ошибка:", err);
            setData("Ошибка подключения к бэкенду");
          });
      }, []);
      
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>Ответ от бэкенда: {data}</p>
      </div>
    </footer>
  );
}
