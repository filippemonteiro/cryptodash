import { Routes, Route } from "react-router-dom";
import { CryptoList } from "./pages/CryptoList";
import { CryptoDetail } from "./pages/CryptoDetail";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CryptoList />} />
      <Route path="/coin/:id" element={<CryptoDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
