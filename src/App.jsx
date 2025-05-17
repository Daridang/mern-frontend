import Header from "./components/Header/Header";
import { useEffect, useState } from "react";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";

function App() {
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
    <div>
      <Header></Header>
      <Hero></Hero>
      <Features></Features>
      <p>Ответ от бэкенда: {data}</p>
    </div>
  );
}

export default App;
