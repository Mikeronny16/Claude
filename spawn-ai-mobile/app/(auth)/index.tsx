"use client"
import { useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from "react-native"
import { router } from "expo-router"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { C, F } from "@/lib/colors"
import { EggSVG } from "@/components/EggSVG"

export default function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()

  async function submit() {
    if (!email || !password) { Alert.alert("Error", "Email and password required"); return }
    if (mode === "signup" && !name) { Alert.alert("Error", "Name required"); return }
    setLoading(true)
    try {
      const data = mode === "signin"
        ? await api.signIn(email, password)
        : await api.signUp(email, password, name)
      setAuth(data.token, data.user)
      router.replace("/(app)")
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.hero}>
          <EggSVG tier="epic" size={120} />
          <Text style={s.brand}>Spawn AI</Text>
          <Text style={s.tagline}>Something small is waiting for you to notice.</Text>
        </View>

        <View style={s.card}>
          <View style={s.tabs}>
            {(["signin", "signup"] as const).map(m => (
              <TouchableOpacity key={m} style={[s.tab, mode === m && s.tabActive]} onPress={() => setMode(m)}>
                <Text style={[s.tabText, mode === m && s.tabTextActive]}>
                  {m === "signin" ? "Sign In" : "Create Account"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === "signup" && (
            <TextInput style={s.input} placeholder="Your name" placeholderTextColor={C.dim}
              value={name} onChangeText={setName} autoCapitalize="words" />
          )}
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.dim}
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor={C.dim}
            value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={s.btn} onPress={submit} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={s.btnText}>{mode === "signin" ? "Sign In" : "Create Account"}</Text>
            )}
          </TouchableOpacity>

          {mode === "signup" && (
            <Text style={s.note}>You'll get 1 free egg when you sign up 🥚</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  hero: { alignItems: "center", marginBottom: 32 },
  brand: { fontSize: F.xxl, fontWeight: "800", color: C.text, marginTop: 16, letterSpacing: -0.5 },
  tagline: { fontSize: F.sm, color: C.muted, marginTop: 8, textAlign: "center", lineHeight: 20 },
  card: { backgroundColor: C.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: C.border },
  tabs: { flexDirection: "row", marginBottom: 20, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: "rgba(139,92,246,0.08)" },
  tabActive: { backgroundColor: C.purple },
  tabText: { fontSize: F.sm, fontWeight: "600", color: C.muted },
  tabTextActive: { color: "#fff" },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(139,92,246,0.25)",
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: F.base, color: C.text, marginBottom: 12,
  },
  btn: {
    backgroundColor: C.purple, borderRadius: 14, paddingVertical: 16,
    alignItems: "center", marginTop: 4,
  },
  btnText: { fontSize: F.base, fontWeight: "700", color: "#fff" },
  note: { fontSize: F.xs, color: C.muted, textAlign: "center", marginTop: 12 },
})
