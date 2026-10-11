import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { GarmentDefs } from "./Garment"
import TabBar from "./TabBar"
import BagSheet from "./BagSheet"
import ChatSheet from "./ChatSheet"
import SizeGuide from "./SizeGuide"
import SocialProofTicker from "./SocialProofTicker"

interface AppUI {
  openBag: () => void
  openChat: () => void
  openSizeGuide: () => void
}

const AppUIContext = createContext<AppUI | null>(null)

export function useAppUI() {
  const ctx = useContext(AppUIContext)
  if (!ctx) throw new Error("useAppUI must be used inside AppShell")
  return ctx
}

/** Phone-app frame for all customer pages: content column, bottom tabs and the shared sheets. */
export default function AppShell() {
  const [bagOpen, setBagOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const { pathname } = useLocation()
  const onProductPage = pathname.startsWith("/p/")

  const closeBag = useCallback(() => setBagOpen(false), [])
  const closeChat = useCallback(() => setChatOpen(false), [])
  const closeSize = useCallback(() => setSizeOpen(false), [])

  const ui = useMemo<AppUI>(() => ({
    openBag: () => setBagOpen(true),
    openChat: () => setChatOpen(true),
    openSizeGuide: () => setSizeOpen(true),
  }), [])

  return (
    <AppUIContext.Provider value={ui}>
      <GarmentDefs />
      <div className="min-h-screen bg-[#F9E4EC]">
        <div className={`relative mx-auto min-h-screen max-w-lg overflow-x-clip bg-candy-bg lg:shadow-[0_0_60px_rgba(224,17,95,0.12)] ${onProductPage ? "" : "pb-28"}`}>
          <Outlet />
        </div>
      </div>
      {!onProductPage && <TabBar />}
      <SocialProofTicker />
      <BagSheet open={bagOpen} onClose={closeBag} />
      <ChatSheet open={chatOpen} onClose={closeChat} />
      <SizeGuide open={sizeOpen} onClose={closeSize} />
    </AppUIContext.Provider>
  )
}
