import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"
import { C, F } from "@/lib/colors"

export default function SettingsScreen() {
  const { user, signOut, setAuth, token } = useAuthStore()
  const [name, setName] = useState(user?.name ?? "")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  async function saveName() {
    setSavingName(true)
    try {
      await api.updateProfile({ name })
      if (user && token) setAuth(token, { ...user, name })
      Alert.alert("✓ Saved", "Name updated!")
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed")
    } finally { setSavingName(false) }
  }

  async function savePassword() {
    if (newPw.length < 6) { Alert.alert("Error", "Password must be at least 6 characters"); return }
    setSavingPw(true)
    try {
      await api.updateProfile({ currentPassword: currentPw, newPassword: newPw })
      Alert.alert("✓ Saved", "Password changed!")
      setCurrentPw(""); setNewPw("")
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed")
    } finally { setSavingPw(false) }
  }

  function handleSignOut() {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => { signOut(); router.replace("/(auth)") } },
    ])
  }

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Account info */}
        <View style={s.card}>
          <Text style={s.cardTitle}>👤 Account</Text>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Email</Text>
            <Text style={s.infoValue}>{user?.email}</Text>
          </View>
          <View style={[s.infoRow, { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)", marginTop: 8, paddingTop: 8 }]}>
            <Text style={s.infoLabel}>Plan</Text>
            <Text style={[s.infoValue, { color: C.purple, textTransform: "capitalize" }]}>{user?.plan}</Text>
          </View>
        </View>

        {/* Change name */}
        <View style={s.card}>
          <Text style={s.cardTitle}>✏️ Display Name</Text>
          <TextInput
            style={s.input} value={name} onChangeText={setName}
            placeholder="Your name" placeholderTextColor={C.dim}
            maxLength={30} autoCapitalize="words"
          />
          <TouchableOpacity style={s.btn} onPress={saveName} disabled={savingName}>
            {savingName ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Save Name</Text>}
          </TouchableOpacity>
        </View>

        {/* Change password */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🔒 Change Password</Text>
          <TextInput style={s.input} value={currentPw} onChangeText={setCurrentPw}
            placeholder="Current password" placeholderTextColor={C.dim} secureTextEntry />
          <TextInput style={s.input} value={newPw} onChangeText={setNewPw}
            placeholder="New password (min 6 chars)" placeholderTextColor={C.dim} secureTextEntry />
          <TouchableOpacity style={[s.btn, (!currentPw || !newPw) && { opacity: 0.5 }]}
            onPress={savePassword} disabled={savingPw || !currentPw || !newPw}>
            {savingPw ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Change Password</Text>}
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: F.xl, fontWeight: "800", color: C.text },
  card: { backgroundColor: C.surface, borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: F.sm, fontWeight: "700", color: C.text, marginBottom: 14 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: F.sm, color: C.muted },
  infoValue: { fontSize: F.sm, color: C.text },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(139,92,246,0.25)",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: F.base, color: C.text, marginBottom: 10,
  },
  btn: { backgroundColor: C.purple, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { fontSize: F.base, fontWeight: "700", color: "#fff" },
  signOutBtn: {
    backgroundColor: "rgba(239,68,68,0.08)", borderRadius: 14,
    paddingVertical: 14, alignItems: "center", marginTop: 4,
    borderWidth: 1, borderColor: "rgba(239,68,68,0.25)",
  },
  signOutText: { fontSize: F.base, fontWeight: "600", color: C.red },
})
