import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import App from "./App"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        offset={16}
        toastOptions={{
          style: {
            background: "#2A1320",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            fontFamily: "'Plus Jakarta Sans', 'Noto Sans Myanmar', sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
)
