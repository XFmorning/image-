import { Routes, Route, Navigate } from "react-router-dom";
import { GenerationProvider } from "./GenerationContext";
import AppLayout from "./components/AppLayout";
import Generate from "./pages/Generate";
import History from "./pages/History";
import ModelConfig from "./pages/ModelConfig";

export default function App() {
  return (
    <GenerationProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Generate />} />
          <Route path="/history" element={<History />} />
          <Route path="/models" element={<ModelConfig />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </GenerationProvider>
  );
}
