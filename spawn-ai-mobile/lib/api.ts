import * as SecureStore from "expo-secure-store"

export const API_BASE = "https://claude-97k2.vercel.app"

async function getToken() {
  return await SecureStore.getItemAsync("auth_token")
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-mobile-token": token } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error ?? "Request failed")
  }
  return res.json()
}

export const api = {
  async signIn(email: string, password: string) {
    return req<{ token: string; user: { id: string; email: string; name: string | null; plan: string; isAdmin: boolean } }>(
      "/api/mobile/signin",
      { method: "POST", body: JSON.stringify({ email, password }) }
    )
  },

  async signUp(email: string, password: string, name: string) {
    return req<{ token: string; user: { id: string; email: string; name: string | null; plan: string; isAdmin: boolean } }>(
      "/api/mobile/signup",
      { method: "POST", body: JSON.stringify({ email, password, name }) }
    )
  },

  async getDashboard() {
    return req<{
      eggs: { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean; personalitySeeds: { id: string }[] }[]
      pets: { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number }[]
      user: { plan: string; messagesUsedToday: number; name: string | null; email: string; isAdmin: boolean }
    }>("/api/dashboard")
  },

  async getPet(id: string) {
    return req<{ pet: { id: string; name: string; species: string; tier: string; stage: string; level: number; personality: string; hunger: number; energy: number; happiness: number; bond: number; xp: number } }>(
      `/api/pet/${id}`
    )
  },

  async getMessages(petId: string) {
    return req<{ messages: { id: string; role: string; content: string; createdAt: string }[] }>(
      `/api/pet/${petId}/messages`
    )
  },

  async chat(petId: string, message: string) {
    return req<{ reply: string; xpGained: number; newLevel: number; newStage: string }>(
      `/api/pet/${petId}/chat`,
      { method: "POST", body: JSON.stringify({ message }) }
    )
  },

  async petAction(petId: string, action: string) {
    return req<{ hunger: number; energy: number; happiness: number; bond: number }>(
      `/api/pet/${petId}/action`,
      { method: "POST", body: JSON.stringify({ action }) }
    )
  },

  async buyEgg(tier: string) {
    return req<{ egg?: { id: string }; requiresPayment?: boolean; error?: string }>(
      "/api/shop/egg",
      { method: "POST", body: JSON.stringify({ tier }) }
    )
  },

  async updateProfile(data: { name?: string; currentPassword?: string; newPassword?: string }) {
    return req<{ success: boolean; error?: string }>(
      "/api/user/update",
      { method: "POST", body: JSON.stringify(data) }
    )
  },
}
