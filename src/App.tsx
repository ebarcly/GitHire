import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/home";
import LandingPage from "./components/LandingPage.tsx";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
