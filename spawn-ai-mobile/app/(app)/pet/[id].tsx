import { useEffect, useState, useRef, useCallback } from "react"
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@/lib/api"
import { C, F } from "@/lib/colors"

type Pet = { id: string; name: string; species: string; tier: string; stage: string; level: number; hunger: number; energy: number; happiness: number; bond: number; xp: number }
type Msg = { id: string; role: string; content: string }

const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: F.xs, color, fontWeight: "700" }}>{value}</Text>
      <Text style={{ fontSize: 10, color: C.dim }}>{label}</Text>
    </View>
  )
}

export default function PetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const listRef = useRef<FlatList>(null)

  const load = useCallback(async () => {
    try {
      const [petData, msgData] = await Promise.all([
        api.getPet(id),
        api.getMessages(id).catch(() => ({ messages: [] })),
      ])
      setPet(petData.pet)
      setMessages(msgData.messages ?? [])
    } catch {
      Alert.alert("Error", "Could not load pet")
    }
  }, [id])

  useEffect(() => { load() }, [load])

  async function sendMessage() {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput("")
    const tempId = Date.now().toString()
    setMessages(prev => [...prev, { id: tempId, role: "user", content: text }])
    setSending(true)
    try {
      const res = await api.chat(id, text)
      setMessages(prev => [...prev, { id: `${tempId}-r`, role: "pet", content: res.reply }])
      if (pet && res.newLevel > pet.level) {
        Alert.alert("Level Up! 🎉", `${pet.name} is now level ${res.newLevel}!`)
      }
      setPet(prev => prev ? { ...prev, level: res.newLevel, stage: res.newStage } : prev)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "AI unavailable"
      setMessages(prev => [...prev, { id: `${tempId}-err`, role: "error", content: msg }])
    } finally {
      setSending(false)
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }

  async function doAction(action: string) {
    setActionLoading(action)
    try {
      const res = await api.petAction(id, action)
      setPet(prev => prev ? { ...prev, ...res } : prev)
    } catch {
      Alert.alert("Error", "Action failed")
    } finally { setActionLoading(null) }
  }

  if (!pet) return (
    <View style={[s.root, { alignItems: "center", justifyContent: "center" }]}>
      <ActivityIndicator color={C.purple} size="large" />
    </View>
  )

  return (
    <SafeAreaView style={s.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 20, color: C.muted }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.petName}>{pet.name}</Text>
          <Text style={{ fontSize: F.xs, color: C.muted, textTransform: "capitalize" }}>
            {pet.species} · {pet.stage} · Lv.{pet.level}
          </Text>
        </View>
        <Text style={{ fontSize: 28 }}>{stageEmoji[pet.stage] ?? "🐣"}</Text>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        <StatPill label="Hunger" value={pet.hunger} color={C.amber} />
        <StatPill label="Energy" value={pet.energy} color={C.green} />
        <StatPill label="Happy" value={pet.happiness} color={C.purple} />
        <StatPill label="Bond" value={pet.bond} color="#EC4899" />
      </View>

      {/* Action buttons */}
      <View style={s.actions}>
        {[
          { action: "feed", emoji: "🍖", label: "Feed" },
          { action: "play", emoji: "🎮", label: "Play" },
          { action: "sleep", emoji: "😴", label: "Sleep" },
          { action: "pet", emoji: "🤝", label: "Pet" },
        ].map(a => (
          <TouchableOpacity key={a.action} style={s.actionBtn}
            onPress={() => doAction(a.action)} disabled={actionLoading !== null}>
            {actionLoading === a.action
              ? <ActivityIndicator color={C.purple} size="small" />
              : <>
                <Text style={{ fontSize: 20 }}>{a.emoji}</Text>
                <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{a.label}</Text>
              </>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>{stageEmoji[pet.stage] ?? "🐣"}</Text>
            <Text style={{ fontSize: F.sm, color: C.muted }}>Say hello to {pet.name}!</Text>
          </View>
        }
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[
            s.bubble,
            item.role === "user" ? s.bubbleUser : item.role === "error" ? s.bubbleError : s.bubblePet,
          ]}>
            <Text style={[
              s.bubbleText,
              item.role === "user" ? { color: "#fff" } : item.role === "error" ? { color: "#fca5a5" } : { color: C.text },
            ]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.inputRow}>
          <TextInput
            style={s.input} value={input} onChangeText={setInput}
            placeholder={`Talk to ${pet.name}...`} placeholderTextColor={C.dim}
            multiline maxLength={200} returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={[s.sendBtn, (!input.trim() || sending) && { opacity: 0.5 }]}
            onPress={sendMessage} disabled={!input.trim() || sending}>
            {sending
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={{ fontSize: 18, color: "#fff" }}>↑</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(139,92,246,0.2)",
  },
  petName: { fontSize: F.lg, fontWeight: "700", color: C.text },
  statsRow: {
    flexDirection: "row", justifyContent: "space-around",
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
  },
  actions: {
    flexDirection: "row", justifyContent: "space-around",
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
  },
  actionBtn: {
    alignItems: "center", paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, backgroundColor: "rgba(139,92,246,0.12)",
    minWidth: 60,
  },
  bubble: {
    maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, marginBottom: 8,
  },
  bubbleUser: { backgroundColor: C.purple, alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubblePet: { backgroundColor: C.surface, alignSelf: "flex-start", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "rgba(139,92,246,0.2)" },
  bubbleError: { backgroundColor: "rgba(239,68,68,0.15)", alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)" },
  bubbleText: { fontSize: F.base, lineHeight: 22 },
  inputRow: {
    flexDirection: "row", alignItems: "flex-end", padding: 12,
    borderTopWidth: 1, borderTopColor: "rgba(139,92,246,0.2)",
    gap: 10,
  },
  input: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1,
    borderColor: "rgba(139,92,246,0.25)", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: F.base, color: C.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.purple,
    alignItems: "center", justifyContent: "center",
  },
})
