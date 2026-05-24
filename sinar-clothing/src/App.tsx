import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Admin from "./pages/Admin"
import LoadingScreen from "./components/LoadingScreen"
import CursorFollower from "./components/CursorFollower"
import { useEffect, useState } from "react"
import { supabase, isConfigured } from "./lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { LangProvider } from "./lib/lang"
import { ThemeProvider } from "./lib/theme"
import { trackVisit } from "./lib/analytics"

const queryClient = new QueryClient()

const LOCAL_ADMIN_KEY = "sinar_admin_auth"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null)

  useEffect(() => {
    if (isConfigured) {
      let session: Session | null = null
      supabase.auth.getSession().then(({ data }) => {
        session = data.session
        setAuth(!!session)
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
        setAuth(!!s)
      })
      return () => subscription.unsubscribe()
    } else {
      setAuth(localStorage.getItem(LOCAL_ADMIN_KEY) === "true")
    }
  }, [])

  if (auth === null) return (
    <div className="min-h-screen bg-[#0A1A0F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pink border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return auth ? <>{children}</> : <Navigate to="/auth" replace />
}

if (typeof window !== "undefined") trackVisit()

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: "#0F2415", border: "1px solid #1C3020", color: "#F5F0E8" },
            }}
          />
          <LoadingScreen />
          <CursorFollower />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
