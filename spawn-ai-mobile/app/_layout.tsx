import { useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuthStore } from "@/lib/store"
import { C } from "@/lib/colors"

export default function RootLayout() {
  const { loadFromStorage } = useAuthStore()
  useEffect(() => { loadFromStorage() }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  )
}
