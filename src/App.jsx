import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home          from "./pages/Home.jsx";
import Login         from "./pages/Login.jsx";
import Register      from "./pages/Register.jsx";
import Dashboard     from "./pages/Dashboard.jsx";
import History       from "./pages/History.jsx";
import BuyCredits    from "./pages/BuyCredits.jsx";
import NotFound      from "./pages/NotFound.jsx";
import Navbar        from "./components/Navbar.jsx";
import ProtectedRoute  from "./components/ProtectedRoute.jsx";
import ErrorBoundary   from "./components/ErrorBoundary.jsx";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
            success: { iconTheme: { primary: "#4f6ef7", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history"     element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/buy-credits" element={<ProtectedRoute><BuyCredits /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
