import { Redirect } from "expo-router"
import { useAuthStore } from "@/lib/store"
import { View, ActivityIndicator } from "react-native"
import { C } from "@/lib/colors"

export default function Index() {
  const { token, loaded } = useAuthStore()
  if (!loaded) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={C.purple} size="large" />
    </View>
  )
  return <Redirect href={token ? "/(app)" : "/(auth)"} />
}
