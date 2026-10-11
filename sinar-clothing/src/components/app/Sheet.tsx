import { useEffect, type ReactNode } from "react"
import { AnimatePresence, motion, useDragControls } from "framer-motion"
import { X } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/** Bottom sheet that slides up like a native app panel. Drag the handle down to close. */
export default function Sheet({ open, onClose, title, children, footer }: Props) {
  const drag = useDragControls()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-candy-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-[101] mx-auto flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-[28px] bg-candy-bg shadow-bar"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose() }}
          >
            <div
              className="flex cursor-grab touch-none items-center justify-between px-5 pb-2 pt-3"
              onPointerDown={(e) => drag.start(e)}
            >
              <span className="w-10" />
              <span className="h-1.5 w-10 rounded-full bg-candy-line" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-candy-muted active:bg-candy-soft"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="px-5 pb-3 font-display text-[22px] font-semibold leading-tight">{title}</h2>
            <div className="overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
            {footer && <div className="pb-safe border-t border-candy-line/60 bg-white px-5 pt-3">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
