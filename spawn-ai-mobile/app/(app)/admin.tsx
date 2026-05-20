import { useEffect, useState, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { C, F } from "@/lib/colors"

type Stats = {
  totalUsers: number; newUsersToday: number
  totalPets: number; totalEggs: number
  totalMessages: number; messagesToday: number
  pendingRequests: number
  planCounts: { plan: string; count: number }[]
}

type Request = {
  id: string; plan: string; amount: number; status: string; createdAt: string
  user: { email: string; name: string | null; plan: string }
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <View style={[s.statCard, { borderColor: color ? `${color}44` : C.border }]}>
      <Text style={[s.statNum, { color: color ?? C.text }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
      {sub && <Text style={s.statSub}>{sub}</Text>}
    </View>
  )
}

export default function AdminScreen() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<"insights" | "requests">("insights")

  const load = useCallback(async () => {
    try {
      const [statsData, reqData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminRequests(),
      ])
      setStats(statsData)
      setRequests(reqData.requests)
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed to load")
    } finally { setLoading(false); setRefreshing(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleRequest(id: string, action: "approve" | "reject") {
    setActionLoading(id)
    try {
      await api.approveRequest(id, action)
      Alert.alert(action === "approve" ? "✅ Approved!" : "❌ Rejected", "Payment request updated.")
      await load()
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed")
    } finally { setActionLoading(null) }
  }

  if (!user?.isAdmin) {
    return (
      <View style={[s.root, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ fontSize: 40 }}>🚫</Text>
        <Text style={{ color: C.muted, marginTop: 12 }}>Admin only</Text>
      </View>
    )
  }

  if (loading) return (
    <View style={[s.root, { alignItems: "center", justifyContent: "center" }]}>
      <ActivityIndicator color={C.purple} size="large" />
    </View>
  )

  const pendingReqs = requests.filter(r => r.status === "pending")
  const planColors: Record<string, string> = { free: C.muted, pro: "#818CF8", ultra: C.purple, legendary: "#EC4899" }

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>⚡ Admin</Text>
        <View style={s.tabs}>
          {(["insights", "requests"] as const).map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === "insights" ? "Insights" : `Requests${pendingReqs.length > 0 ? ` (${pendingReqs.length})` : ""}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} tintColor={C.purple} />}
      >
        {tab === "insights" && stats && (
          <>
            {/* Users */}
            <Text style={s.section}>👥 Users</Text>
            <View style={s.grid2}>
              <StatCard label="Total Users" value={stats.totalUsers} color={C.purpleLight} />
              <StatCard label="New Today" value={stats.newUsersToday} color={C.green} sub="+today" />
            </View>

            {/* Activity */}
            <Text style={s.section}>💬 Activity</Text>
            <View style={s.grid2}>
              <StatCard label="Total Messages" value={stats.totalMessages} />
              <StatCard label="Today" value={stats.messagesToday} color={C.amber} sub="messages" />
            </View>

            {/* Content */}
            <Text style={s.section}>🐾 Content</Text>
            <View style={s.grid2}>
              <StatCard label="Total Pets" value={stats.totalPets} color="#EC4899" />
              <StatCard label="Total Eggs" value={stats.totalEggs} color={C.amber} />
            </View>

            {/* Plans breakdown */}
            <Text style={s.section}>💳 Plans</Text>
            <View style={s.card}>
              {stats.planCounts.sort((a, b) => b.count - a.count).map(p => (
                <View key={p.plan} style={s.planRow}>
                  <View style={[s.planDot, { backgroundColor: planColors[p.plan] ?? C.purple }]} />
                  <Text style={[s.planName, { color: planColors[p.plan] ?? C.purple }]}>{p.plan}</Text>
                  <View style={{ flex: 1, marginHorizontal: 10, height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${Math.min(100, (p.count / stats.totalUsers) * 100)}%`, backgroundColor: planColors[p.plan] ?? C.purple, borderRadius: 3 }} />
                  </View>
                  <Text style={s.planCount}>{p.count} users</Text>
                </View>
              ))}
            </View>

            {/* Pending alert */}
            {stats.pendingRequests > 0 && (
              <TouchableOpacity style={s.pendingAlert} onPress={() => setTab("requests")}>
                <Text style={{ fontSize: 20 }}>⏳</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: F.sm, fontWeight: "700", color: C.amber }}>
                    {stats.pendingRequests} pending payment{stats.pendingRequests > 1 ? "s" : ""}
                  </Text>
                  <Text style={{ fontSize: F.xs, color: C.muted }}>Tap to review →</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {tab === "requests" && (
          <>
            {pendingReqs.length === 0 && (
              <View style={{ alignItems: "center", paddingTop: 40 }}>
                <Text style={{ fontSize: 40 }}>✅</Text>
                <Text style={{ color: C.muted, marginTop: 10 }}>All caught up!</Text>
              </View>
            )}
            {requests.map(r => (
              <View key={r.id} style={[s.requestCard, r.status !== "pending" && { opacity: 0.6 }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <View>
                    <Text style={s.reqUser}>{r.user.name ?? r.user.email}</Text>
                    <Text style={{ fontSize: F.xs, color: C.muted }}>{r.user.email}</Text>
                  </View>
                  <View style={[s.statusBadge, {
                    backgroundColor: r.status === "approved" ? "rgba(16,185,129,0.15)" : r.status === "rejected" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    borderColor: r.status === "approved" ? `${C.green}55` : r.status === "rejected" ? `${C.red}55` : `${C.amber}55`,
                  }]}>
                    <Text style={{ fontSize: F.xs, fontWeight: "700", color: r.status === "approved" ? C.green : r.status === "rejected" ? C.red : C.amber }}>
                      {r.status}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  <View style={s.pillTag}>
                    <Text style={{ fontSize: F.xs, color: C.purpleLight }}>Plan: {r.plan}</Text>
                  </View>
                  <View style={s.pillTag}>
                    <Text style={{ fontSize: F.xs, color: C.amber }}>${r.amount}</Text>
                  </View>
                  <View style={s.pillTag}>
                    <Text style={{ fontSize: F.xs, color: C.muted }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {r.status === "pending" && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: "rgba(16,185,129,0.15)", borderColor: `${C.green}55`, flex: 1 }]}
                      onPress={() => Alert.alert("Approve?", `Approve ${r.user.email}'s request for ${r.plan}?`, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Approve ✓", onPress: () => handleRequest(r.id, "approve") },
                      ])}
                      disabled={actionLoading === r.id}
                    >
                      {actionLoading === r.id
                        ? <ActivityIndicator size="small" color={C.green} />
                        : <Text style={{ fontSize: F.sm, fontWeight: "700", color: C.green }}>✓ Approve</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: "rgba(239,68,68,0.15)", borderColor: `${C.red}55`, flex: 1 }]}
                      onPress={() => Alert.alert("Reject?", `Reject ${r.user.email}'s request?`, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Reject", style: "destructive", onPress: () => handleRequest(r.id, "reject") },
                      ])}
                      disabled={actionLoading === r.id}
                    >
                      <Text style={{ fontSize: F.sm, fontWeight: "700", color: C.red }}>✕ Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: F.xl, fontWeight: "800", color: C.text, marginBottom: 12 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "rgba(139,92,246,0.08)" },
  tabActive: { backgroundColor: C.purple },
  tabText: { fontSize: F.sm, fontWeight: "600", color: C.muted },
  tabTextActive: { color: "#fff" },
  section: { fontSize: F.xs, fontWeight: "700", color: C.purpleLight, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, marginTop: 16 },
  grid2: { flexDirection: "row", gap: 10, marginBottom: 4 },
  statCard: {
    flex: 1, padding: 14, borderRadius: 16,
    backgroundColor: C.surface, borderWidth: 1, alignItems: "center",
  },
  statNum: { fontSize: F.xxl, fontWeight: "800", color: C.text },
  statLabel: { fontSize: F.xs, color: C.muted, marginTop: 2, textAlign: "center" },
  statSub: { fontSize: 10, color: C.dim, marginTop: 1 },
  card: { backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border },
  planRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  planDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  planName: { fontSize: F.sm, fontWeight: "600", textTransform: "capitalize", width: 70 },
  planCount: { fontSize: F.xs, color: C.muted, width: 55, textAlign: "right" },
  pendingAlert: {
    flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, marginTop: 16,
    backgroundColor: "rgba(245,158,11,0.08)", borderWidth: 1, borderColor: "rgba(245,158,11,0.35)",
  },
  requestCard: {
    backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: C.border,
  },
  reqUser: { fontSize: F.base, fontWeight: "700", color: C.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  pillTag: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    backgroundColor: "rgba(139,92,246,0.1)", borderWidth: 1, borderColor: "rgba(139,92,246,0.2)",
  },
  actionBtn: { paddingVertical: 10, borderRadius: 10, alignItems: "center", borderWidth: 1 },
})
