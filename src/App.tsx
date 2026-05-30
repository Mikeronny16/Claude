import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Admin from "./pages/Admin"
import StyleQuiz from "./pages/StyleQuiz"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem("sinar_admin_auth") === "true"
  return auth ? <>{children}</> : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/style" element={<StyleQuiz />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
