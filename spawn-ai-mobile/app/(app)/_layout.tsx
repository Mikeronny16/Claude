import { Tabs, Redirect } from "expo-router"
import { Text, Platform } from "react-native"
import { useAuthStore } from "@/lib/store"
import { C, F } from "@/lib/colors"

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
}

export default function AppLayout() {
  const { token, loaded, user } = useAuthStore()
  if (loaded && !token) return <Redirect href="/(auth)" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.navBg,
          borderTopColor: C.navBorder,
          borderTopWidth: 3,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: C.purpleLight,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: F.xs, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="shop"
        options={{ title: "Shop", tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          href: user?.isAdmin ? undefined : null,
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} />,
        }}
      />
      <Tabs.Screen name="pet/[id]" options={{ href: null }} />
    </Tabs>
  )
}
