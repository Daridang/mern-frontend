import React from "react";

import Hero from "../../components/HomePage/Hero/Hero";
import Features from "../../components/HomePage/Features/Features";
import RecipesCatalog from "../../components/HomePage/RecipesCatalog/RecipesCatalog";
import ImageUploadForm from "../../components/ImageUploadForm/ImageUploadForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <RecipesCatalog />
      <ImageUploadForm />
    </>
  );
}
