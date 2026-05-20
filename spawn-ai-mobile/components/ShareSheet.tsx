import { Share, Alert } from "react-native"

type ShareData = {
  petName?: string
  species?: string
  stage?: string
  level?: number
  bond?: number
}

export async function sharePet(data: ShareData) {
  const { petName = "my pet", species = "creature", stage = "baby", level = 1, bond = 0 } = data

  const stageEmoji: Record<string, string> = { baby: "🐣", child: "🐥", teen: "🦋", adult: "✨" }
  const emoji = stageEmoji[stage] ?? "🐾"

  const messages = [
    `${emoji} My ${species} ${petName} just reached level ${level} in Spawn AI! We have a bond of ${bond}/100 💜`,
    `I've been raising ${petName} — a ${stage} ${species} — in Spawn AI. Our bond is ${bond}/100 ${emoji}`,
    `${petName} is growing up! ${emoji} ${stage.charAt(0).toUpperCase() + stage.slice(1)} stage, Lv.${level}. Hatch your own AI pet at Spawn AI 🥚`,
    `Just had the best chat with ${petName} my AI ${species}! This little ${stage} makes my day 💜 #SpawnAI`,
  ]
  const message = messages[Math.floor(Math.random() * messages.length)]

  try {
    await Share.share({
      message,
      url: "https://claude-97k2.vercel.app",
      title: `${petName} — Spawn AI`,
    })
  } catch (e: unknown) {
    if (e instanceof Error && e.message !== "User did not share") {
      Alert.alert("Error", "Could not open share menu")
    }
  }
}

export async function shareEggHatch(species: string, tier: string) {
  const tierEmoji: Record<string, string> = { common: "🥚", rare: "💎", epic: "🔮", mythic: "🌟" }
  const emoji = tierEmoji[tier] ?? "🥚"

  try {
    await Share.share({
      message: `${emoji} I just hatched a ${tier} ${species} egg in Spawn AI! Come raise your own AI creature 🐾\nhttps://claude-97k2.vercel.app`,
      title: "I hatched an egg!",
    })
  } catch {
    // user cancelled, ignore
  }
}
