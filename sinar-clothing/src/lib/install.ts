import { useSyncExternalStore } from "react"

// "Add to Home Screen" support. Android/desktop Chrome fire beforeinstallprompt;
// iPhone Safari has no prompt, so the Me tab shows manual steps instead.

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

let deferred: InstallEvent | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferred = e as InstallEvent
    emit()
  })
  window.addEventListener("appinstalled", () => {
    deferred = null
    emit()
  })
}

export const isStandalone =
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true)

export const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent)

export function useInstallPrompt() {
  const canInstall = useSyncExternalStore(
    (l) => { listeners.add(l); return () => { listeners.delete(l) } },
    () => deferred !== null
  )

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    deferred = null
    emit()
  }

  return { canInstall, install }
}
