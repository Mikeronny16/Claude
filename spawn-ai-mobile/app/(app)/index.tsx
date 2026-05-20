import { useEffect, useState, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, Alert,
} from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { C, F } from "@/lib/colors"
import { EggSVG } from "@/components/EggSVG"
import { sharePet } from "@/components/ShareSheet"

type Egg = { id: string; species: string; tier: string; hatchesAt: string; isHatched: boolean; personalitySeeds: { id: string }[] }
type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number }
type DashData = { eggs: Egg[]; pets: Pet[]; user: { plan: string; messagesUsedToday: number; name: string | null; email: string; isAdmin: boolean } }

const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <View style={{ height: "100%", width: `${Math.max(2, value)}%`, backgroundColor: color, borderRadius: 3 }} />
    </View>
  )
}

function EggCountdown({ hatchesAt }: { hatchesAt: string }) {
  const [rem, setRem] = useState("")
  useEffect(() => {
    function upd() {
      const d = new Date(hatchesAt).getTime() - Date.now()
      if (d <= 0) { setRem("Ready!"); return }
      const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), sec = Math.floor((d % 60000) / 1000)
      setRem(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec}s` : `${sec}s`)
    }
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id)
  }, [hatchesAt])
  return <Text style={{ fontSize: F.xs, color: C.purple }}>{rem}</Text>
}

export default function DashboardScreen() {
  const { user: authUser, signOut } = useAuthStore()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const d = await api.getDashboard()
      setData(d)
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "Unauthorized") { signOut(); router.replace("/(auth)") }
    } finally { setLoading(false); setRefreshing(false) }
  }, [signOut])

  useEffect(() => { load() }, [load])

  const onRefresh = () => { setRefreshing(true); load() }

  if (loading) return (
    <View style={[s.root, { alignItems: "center", justifyContent: "center" }]}>
      <ActivityIndicator color={C.purple} size="large" />
    </View>
  )

  const pendingEggs = data?.eggs.filter(e => !e.isHatched) ?? []
  const readyEggs = pendingEggs.filter(e => new Date(e.hatchesAt) <= new Date())
  const incubating = pendingEggs.filter(e => new Date(e.hatchesAt) > new Date())
  const pets = data?.pets ?? []

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hey{data?.user?.name ? `, ${data.user.name.split(" ")[0]}` : ""} 👋</Text>
          <Text style={s.plan}>{data?.user?.plan ?? "free"} plan</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {data?.user?.plan === "free" && (
            <TouchableOpacity style={s.upgradeBadge} onPress={() => router.push("/shop" as never)}>
              <Text style={{ fontSize: F.xs, fontWeight: "700", color: "#fff" }}>⚡ Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.purple} />}
      >
        {/* Stats row */}
        <View style={s.statsRow}>
          {[
            { label: "Eggs", value: pendingEggs.length, emoji: "🥚" },
            { label: "Pets", value: pets.length, emoji: "🐾" },
            { label: "Bond", value: pets.reduce((s, p) => s + p.bond, 0), emoji: "💜" },
          ].map(st => (
            <View key={st.label} style={s.statCard}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{st.emoji}</Text>
              <Text style={s.statNum}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Message limit */}
        {data?.user?.plan === "free" && (
          <View style={s.limitBar}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={s.limitLabel}>Messages today</Text>
              <Text style={s.limitLabel}>{data.user.messagesUsedToday}/30</Text>
            </View>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <View style={{
                height: "100%", borderRadius: 3,
                width: `${(data.user.messagesUsedToday / 30) * 100}%`,
                backgroundColor: data.user.messagesUsedToday > 25 ? C.red : C.purple,
              }} />
            </View>
          </View>
        )}

        {/* Ready to hatch */}
        {readyEggs.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>✨ Ready to Hatch!</Text>
            {readyEggs.map(egg => (
              <TouchableOpacity key={egg.id} style={[s.eggCard, { borderColor: "rgba(245,158,11,0.5)", backgroundColor: "rgba(245,158,11,0.08)" }]}
                onPress={() => Alert.alert("Hatch!", `${egg.species} egg is ready! Open the web app to hatch for now.`)}>
                <EggSVG tier={egg.tier} size={52} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.eggName}>{egg.species} Egg</Text>
                  <Text style={{ fontSize: F.xs, color: C.amber }}>Tap to hatch! 🎉</Text>
                </View>
                <View style={[s.badge, { backgroundColor: "rgba(245,158,11,0.2)", borderColor: "rgba(245,158,11,0.5)" }]}>
                  <Text style={{ fontSize: F.xs, color: C.amber }}>{egg.tier}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Incubating */}
        {incubating.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>🥚 Incubating</Text>
            {incubating.map(egg => (
              <View key={egg.id} style={s.eggCard}>
                <EggSVG tier={egg.tier} size={52} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.eggName}>{egg.species} Egg</Text>
                  <Text style={{ fontSize: F.xs, color: C.muted }}>Hatches in </Text>
                  <EggCountdown hatchesAt={egg.hatchesAt} />
                  <Text style={{ fontSize: F.xs, color: C.dim, marginTop: 2 }}>{egg.personalitySeeds.length} whispers</Text>
                </View>
                <View style={s.badge}>
                  <Text style={{ fontSize: F.xs, color: C.purpleLight }}>{egg.tier}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pets */}
        {pets.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={s.sectionTitle}>💜 Your Companions</Text>
            {pets.map(pet => (
              <TouchableOpacity key={pet.id} style={s.petCard} onPress={() => router.push(`/(app)/pet/${pet.id}` as never)}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={{ fontSize: 32 }}>{stageEmoji[pet.stage] ?? "🐣"}</Text>
                    <View>
                      <Text style={s.petName}>{pet.name}</Text>
                      <Text style={{ fontSize: F.xs, color: C.muted, textTransform: "capitalize" }}>
                        {pet.species} · {pet.stage} · Lv.{pet.level}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <View style={s.talkBadge}>
                      <Text style={{ fontSize: F.xs, color: C.purpleLight, fontWeight: "600" }}>💬 Talk</Text>
                    </View>
                    <TouchableOpacity
                      style={[s.talkBadge, { backgroundColor: "rgba(255,255,255,0.06)" }]}
                      onPress={(e) => { e.stopPropagation?.(); sharePet({ petName: pet.name, species: pet.species, stage: pet.stage, level: pet.level, bond: pet.bond }) }}>
                      <Text style={{ fontSize: F.xs }}>📤</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[
                    { label: "Hunger", value: pet.hunger, color: C.amber },
                    { label: "Energy", value: pet.energy, color: C.green },
                  ].map(st => (
                    <View key={st.label} style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={s.statSmall}>{st.label}</Text>
                        <Text style={s.statSmall}>{st.value}</Text>
                      </View>
                      <StatBar value={st.value} color={st.color} />
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  {[
                    { label: "Happy", value: pet.happiness, color: C.purple },
                    { label: "Bond", value: pet.bond, color: "#EC4899" },
                  ].map(st => (
                    <View key={st.label} style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={s.statSmall}>{st.label}</Text>
                        <Text style={s.statSmall}>{st.value}</Text>
                      </View>
                      <StatBar value={st.value} color={st.color} />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty state */}
        {pendingEggs.length === 0 && pets.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>🥚</Text>
            <Text style={{ fontSize: F.lg, fontWeight: "700", color: C.text }}>No eggs yet</Text>
            <Text style={{ fontSize: F.sm, color: C.muted, marginTop: 4 }}>Something is waiting to be born.</Text>
            <TouchableOpacity style={[s.btn, { marginTop: 20, paddingHorizontal: 32 }]}
              onPress={() => router.push("/shop" as never)}>
              <Text style={s.btnText}>Get your first egg →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  greeting: { fontSize: F.xl, fontWeight: "800", color: C.text },
  plan: { fontSize: F.xs, color: C.muted, textTransform: "capitalize", marginTop: 2 },
  upgradeBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: C.purple,
  },
  scroll: { flex: 1 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, alignItems: "center", padding: 12, borderRadius: 16,
    backgroundColor: "rgba(139,92,246,0.08)", borderWidth: 1, borderColor: "rgba(139,92,246,0.15)",
  },
  statNum: { fontSize: F.lg, fontWeight: "800", color: C.text },
  statLabel: { fontSize: F.xs, color: C.dim, marginTop: 2 },
  limitBar: {
    backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  limitLabel: { fontSize: F.xs, color: C.muted },
  sectionTitle: { fontSize: F.xs, fontWeight: "700", color: C.purpleLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  eggCard: {
    flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, marginBottom: 8,
    backgroundColor: C.surface, borderWidth: 1, borderColor: "rgba(139,92,246,0.25)",
  },
  eggName: { fontSize: F.base, fontWeight: "600", color: C.text, textTransform: "capitalize" },
  badge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    backgroundColor: "rgba(139,92,246,0.15)", borderWidth: 1, borderColor: "rgba(139,92,246,0.3)",
  },
  petCard: {
    padding: 16, borderRadius: 16, marginBottom: 10,
    backgroundColor: C.surface, borderWidth: 1, borderColor: "rgba(139,92,246,0.3)",
  },
  petName: { fontSize: F.base, fontWeight: "700", color: C.text },
  talkBadge: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
    backgroundColor: "rgba(139,92,246,0.15)", borderWidth: 1, borderColor: "rgba(139,92,246,0.3)",
  },
  statSmall: { fontSize: F.xs, color: C.dim },
  btn: { backgroundColor: C.purple, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { fontSize: F.base, fontWeight: "700", color: "#fff" },
})
