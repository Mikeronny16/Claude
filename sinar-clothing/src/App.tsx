import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom"
import AppShell from "./components/app/AppShell"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Saved from "./pages/Saved"
import Me from "./pages/Me"
import ProductPage from "./pages/ProductPage"
import Auth from "./pages/Auth"
import Admin from "./pages/Admin"
import StyleQuiz from "./pages/StyleQuiz"
import OutfitQuiz from "./pages/OutfitQuiz"
import { LangProvider } from "./lib/lang"
import { trackVisit } from "./lib/analytics"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem("sinar_admin_auth") === "true"
  return auth ? <>{children}</> : <Navigate to="/auth" replace />
}

// New screens open at the top; Back keeps the browser's saved scroll position.
function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType !== "POP") window.scrollTo(0, 0)
  }, [pathname, navType])
  return null
}

if (typeof window !== "undefined") trackVisit()

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/me" element={<Me />} />
            <Route path="/p/:id" element={<ProductPage />} />
          </Route>
          <Route path="/style" element={<StyleQuiz />} />
          <Route path="/outfit" element={<OutfitQuiz />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
