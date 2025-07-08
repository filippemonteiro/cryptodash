import React from "react";
import { Routes, Route } from "react-router-dom";
import { CryptoList } from "./pages/CryptoList";
import { CryptoDetail } from "./pages/CryptoDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CryptoList />} />
      <Route path="/coin/:id" element={<CryptoDetail />} />
    </Routes>
  );
}

export default App;
