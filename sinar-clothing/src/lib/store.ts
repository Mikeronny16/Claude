import { useSyncExternalStore } from "react"

// Tiny localStorage-backed stores for the wishlist and the order bag.
// Every component that reads them re-renders when they change.

type Listener = () => void

function createStore<T>(load: () => T) {
  let value = load()
  const listeners = new Set<Listener>()
  return {
    get: () => value,
    set(next: T) {
      value = next
      listeners.forEach((l) => l())
    },
    subscribe(l: Listener) {
      listeners.add(l)
      return () => { listeners.delete(l) }
    },
  }
}

// ── Wishlist ──
// Kept in the same per-product keys the old site used, so saved items survive the redesign.
const WISH_PREFIX = "sinar_wishlist_"

const wishStore = createStore<string[]>(() => {
  try {
    const ids: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(WISH_PREFIX) && localStorage.getItem(k) === "1") ids.push(k.slice(WISH_PREFIX.length))
    }
    return ids
  } catch {
    return []
  }
})

export function useWishlist() {
  return useSyncExternalStore(wishStore.subscribe, wishStore.get)
}

export function toggleWish(id: string) {
  const ids = wishStore.get()
  const on = ids.includes(id)
  wishStore.set(on ? ids.filter((x) => x !== id) : [...ids, id])
  try {
    if (on) localStorage.removeItem(WISH_PREFIX + id)
    else localStorage.setItem(WISH_PREFIX + id, "1")
  } catch {}
  return !on
}

// ── Order bag ──
export type BagItem = { key: string; id: string; size?: string; color?: string; qty: number }

const BAG_KEY = "sinar_bag"

const bagStore = createStore<BagItem[]>(() => {
  try {
    const parsed = JSON.parse(localStorage.getItem(BAG_KEY) || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})

function saveBag(items: BagItem[]) {
  bagStore.set(items)
  try { localStorage.setItem(BAG_KEY, JSON.stringify(items)) } catch {}
}

const itemKey = (id: string, size?: string, color?: string) => `${id}|${size ?? ""}|${color ?? ""}`

export function useBag() {
  return useSyncExternalStore(bagStore.subscribe, bagStore.get)
}

export function addToBag(id: string, size?: string, color?: string) {
  const key = itemKey(id, size, color)
  const items = bagStore.get()
  const existing = items.find((i) => i.key === key)
  saveBag(
    existing
      ? items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { key, id, size, color, qty: 1 }]
  )
}

export function setBagQty(key: string, qty: number) {
  saveBag(qty <= 0 ? bagStore.get().filter((i) => i.key !== key) : bagStore.get().map((i) => (i.key === key ? { ...i, qty } : i)))
}

export function setBagSize(key: string, size: string) {
  const items = bagStore.get()
  const item = items.find((i) => i.key === key)
  if (!item) return
  const nextKey = itemKey(item.id, size, item.color)
  const clash = items.find((i) => i.key === nextKey && i.key !== key)
  saveBag(
    clash
      ? items.filter((i) => i.key !== key).map((i) => (i.key === nextKey ? { ...i, qty: i.qty + item.qty } : i))
      : items.map((i) => (i.key === key ? { ...i, key: nextKey, size } : i))
  )
}

export function clearBag() {
  saveBag([])
}
