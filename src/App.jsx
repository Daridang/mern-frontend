import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import RecipesCatalog from "./components/RecipesCatalog/RecipesCatalog";
import Footer from "./components/Footer/Footer";
import RecipeDetail from "./pages/RecipeDetail";

export default function App() {
  return (
    <Routes>
      {/* Маршрут главной страницы */}
      <Route
        path="/"
        element={
          <div>
            <Header />
            <Hero />
            <Features />
            <RecipesCatalog />
            <Footer />
          </div>
        }
      />
      {/* Маршрут детали рецепта */}
      <Route path="/recipes/:id" element={<RecipeDetail />} />
    </Routes>
  );
}
