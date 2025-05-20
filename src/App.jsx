import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import RecipeForm from "./components/RecipeForm/RecipeForm";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/create" element={<RecipeForm />} />
      </Route>
    </Routes>
  );
}
