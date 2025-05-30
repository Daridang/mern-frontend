import React, { createContext, useState } from "react";

export const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [catalogScroll, setCatalogScroll] = useState(0);
  const [catalogPage, setCatalogPage] = useState(1);

  return (
    <ScrollContext.Provider
      value={{ catalogScroll, setCatalogScroll, catalogPage, setCatalogPage }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
