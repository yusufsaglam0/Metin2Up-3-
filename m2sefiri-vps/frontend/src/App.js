import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SubforumPage from "./pages/SubforumPage";
import TopicPage from "./pages/TopicPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import RutbePage from "./pages/RutbePage";
import ReklamPage from "./pages/ReklamPage";
import AcilacakPage from "./pages/AcilacakPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";

function App() {
  useEffect(() => {
    document.title = "Metin2 Sefiri – Forum | Metin2 PVP Serverler ve Tanıtımları";
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sub/:slug" element={<SubforumPage />} />
            <Route path="/topic/:id" element={<TopicPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/rutbe" element={<RutbePage />} />
            <Route path="/reklam" element={<ReklamPage />} />
            <Route path="/acilacak" element={<AcilacakPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
