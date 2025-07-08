import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CryptoList } from "./pages/CryptoList";
import { CryptoDetail } from "./pages/CryptoDetail";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CryptoList />} />
        <Route path="/coin/:id" element={<CryptoDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;