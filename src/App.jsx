import Header from "./components/Header/Header";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    // Правильный путь через прокси
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
    <div>
      <Header></Header>
      <p>Ответ от бэкенда: {data}</p>
    </div>
  );
}

export default App;
