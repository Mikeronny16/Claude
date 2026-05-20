import { create } from "zustand"
import * as SecureStore from "expo-secure-store"

type User = { id: string; email: string; name: string | null; plan: string; isAdmin: boolean }

type AuthStore = {
  user: User | null
  token: string | null
  loaded: boolean
  setAuth: (token: string, user: User) => void
  signOut: () => void
  loadFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loaded: false,

  setAuth: (token, user) => {
    SecureStore.setItemAsync("auth_token", token)
    SecureStore.setItemAsync("auth_user", JSON.stringify(user))
    set({ token, user })
  },

  signOut: () => {
    SecureStore.deleteItemAsync("auth_token")
    SecureStore.deleteItemAsync("auth_user")
    set({ token: null, user: null })
  },

  loadFromStorage: async () => {
    const token = await SecureStore.getItemAsync("auth_token")
    const userStr = await SecureStore.getItemAsync("auth_user")
    if (token && userStr) {
      try { set({ token, user: JSON.parse(userStr), loaded: true }) }
      catch { set({ loaded: true }) }
    } else {
      set({ loaded: true })
    }
  },
}))
