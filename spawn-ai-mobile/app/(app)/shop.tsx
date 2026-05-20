import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"
import { C, F } from "@/lib/colors"
import { EggSVG } from "@/components/EggSVG"

const EGGS = [
  { tier: "common",  emoji: "🐱", label: "Common Egg",  price: "Free",  amount: 0,  desc: "A warm little companion. Perfect first pet.", glowColor: "#F59E0B" },
  { tier: "rare",    emoji: "🐉", label: "Rare Egg",    price: "$3",    amount: 3,  desc: "A proud dragon spirit. Fierce and loyal.",   glowColor: "#818CF8" },
  { tier: "epic",    emoji: "🔥", label: "Epic Egg",    price: "$7",    amount: 7,  desc: "Born from flame. Rises with every bond.",    glowColor: "#A855F7" },
  { tier: "mythic",  emoji: "🦄", label: "Mythic Egg",  price: "$15",   amount: 15, desc: "Rarest of all. A once-in-a-lifetime soul.", glowColor: "#EC4899" },
]

const ADMIN_EMAIL = "mikeronny18@gmail.com"

export default function ShopScreen() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState<string | null>(null)

  async function buyEgg(egg: typeof EGGS[0]) {
    if (!user) return
    setLoading(egg.tier)
    try {
      const res = await api.buyEgg(egg.tier)
      if (res.egg) {
        Alert.alert("🥚 Egg added!", `${egg.label} is now in your nest! Go hatch it.`)
        return
      }
      if (res.requiresPayment) {
        const subject = encodeURIComponent(`Spawn AI — ${egg.label} Purchase`)
        const body = encodeURIComponent(
          `Hi Mike,\n\nI want to buy a ${egg.label} (${egg.price}).\n\nMy account: ${user.email}\n\nPlease let me know payment method.\n\nThank you!`
        )
        await Linking.openURL(`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`)
        Alert.alert("Email opened!", "Send the email to Mike to complete your order.", [{ text: "OK" }])
      }
      if (res.error) Alert.alert("Error", res.error)
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Egg Shop</Text>
        <Text style={s.sub}>Each egg carries a unique soul</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        {EGGS.map(egg => (
          <View key={egg.tier} style={[s.card, { borderColor: `${egg.glowColor}33` }]}>
            <View style={{ alignItems: "center", width: 90 }}>
              <EggSVG tier={egg.tier} size={72} />
              <Text style={{ fontSize: 20, marginTop: 4 }}>{egg.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Text style={s.eggLabel}>{egg.label}</Text>
                <View style={[s.tierBadge, { backgroundColor: `${egg.glowColor}22`, borderColor: `${egg.glowColor}55` }]}>
                  <Text style={[s.tierText, { color: egg.glowColor }]}>{egg.tier}</Text>
                </View>
              </View>
              <Text style={s.eggDesc}>{egg.desc}</Text>
              <TouchableOpacity
                style={[s.buyBtn, {
                  backgroundColor: egg.tier === "common" ? "rgba(16,185,129,0.15)" : `${egg.glowColor}20`,
                  borderColor: egg.tier === "common" ? `${C.green}66` : `${egg.glowColor}66`,
                }]}
                onPress={() => buyEgg(egg)}
                disabled={loading === egg.tier}
              >
                {loading === egg.tier
                  ? <ActivityIndicator size="small" color={egg.tier === "common" ? C.green : egg.glowColor} />
                  : <Text style={[s.buyBtnText, { color: egg.tier === "common" ? C.green : egg.glowColor }]}>
                    {egg.tier === "common" ? "Get Free" : `Buy ${egg.price}`}
                  </Text>}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={s.note}>
          <Text style={s.noteText}>
            Paid eggs → Email Mike → He confirms payment → Egg appears 🥚
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: F.xl, fontWeight: "800", color: C.text },
  sub: { fontSize: F.xs, color: C.muted, marginTop: 2 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 16, borderRadius: 20, marginBottom: 12,
    backgroundColor: C.surface, borderWidth: 1,
  },
  eggLabel: { fontSize: F.base, fontWeight: "700", color: C.text },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  tierText: { fontSize: F.xs, fontWeight: "600", textTransform: "capitalize" },
  eggDesc: { fontSize: F.xs, color: C.muted, marginBottom: 10, lineHeight: 18 },
  buyBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, alignSelf: "flex-start", minWidth: 90, alignItems: "center",
  },
  buyBtnText: { fontSize: F.sm, fontWeight: "700" },
  note: {
    padding: 14, borderRadius: 14, marginTop: 4,
    backgroundColor: "rgba(139,92,246,0.06)", borderWidth: 1, borderColor: "rgba(139,92,246,0.15)",
  },
  noteText: { fontSize: F.xs, color: C.muted, textAlign: "center", lineHeight: 18 },
})
