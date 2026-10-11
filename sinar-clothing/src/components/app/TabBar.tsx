import { NavLink } from "react-router-dom"
import { Heart, Home, LayoutGrid, MessageCircle, User, type LucideIcon } from "lucide-react"
import { useWishlist } from "@/lib/store"
import { useAppUI } from "./AppShell"

function Tab({ to, icon: Icon, label, end, badge }: { to: string; icon: LucideIcon; label: string; end?: boolean; badge?: number }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 text-[11px] font-extrabold ${isActive ? "text-candy-pink" : "text-candy-muted"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`relative flex h-8 w-[52px] items-center justify-center rounded-2xl transition-colors ${isActive ? "bg-candy-soft" : ""}`}>
            <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 2} />
            {!!badge && (
              <span className="absolute -top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-candy-pink px-1 text-[10px] font-extrabold text-white">
                {badge}
              </span>
            )}
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function TabBar() {
  const saved = useWishlist()
  const { openChat } = useAppUI()

  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-lg grid-cols-5 items-center rounded-t-[28px] bg-white px-1.5 pt-2 shadow-bar"
    >
      <Tab to="/" end icon={Home} label="Home" />
      <Tab to="/shop" icon={LayoutGrid} label="Shop" />
      <button
        onClick={openChat}
        aria-label="Chat to order"
        className="-mt-9 flex h-[62px] w-[62px] items-center justify-center justify-self-center rounded-full border-[5px] border-white bg-candy-pink text-white shadow-cta transition-transform active:scale-90"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2.3} />
      </button>
      <Tab to="/saved" icon={Heart} label="Saved" badge={saved.length} />
      <Tab to="/me" icon={User} label="Me" />
    </nav>
  )
}
