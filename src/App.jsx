import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail"; // или из pages, если у вас так

export default function App() {
  return (
    <Routes>
      {/* Вся навигация в рамках одного Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Route>
    </Routes>
  );
}
