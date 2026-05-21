import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;

export type WUser = {
  id: string;
  username: string;
  display_name: string;
  avatar_emoji: string;
  created_at: string;
};

export type WMessage = {
  id: string;
  recipient_id: string;
  content: string;
  sender_mood: string | null;
  reaction: string | null;
  public_reply: string | null;
  is_read: boolean;
  created_at: string;
};

export async function getUserByUsername(username: string): Promise<WUser | null> {
  const { data } = await supabase
    .from("whispr_users")
    .select("id, username, display_name, avatar_emoji, created_at")
    .eq("username", username.toLowerCase())
    .single();
  return data;
}

export async function getUserByUsernameWithPassword(username: string) {
  const { data } = await supabase
    .from("whispr_users")
    .select("id, username, display_name, avatar_emoji, password_hash")
    .eq("username", username.toLowerCase())
    .single();
  return data;
}

export async function getUserById(id: string): Promise<WUser | null> {
  const { data } = await supabase
    .from("whispr_users")
    .select("id, username, display_name, avatar_emoji, created_at")
    .eq("id", id)
    .single();
  return data;
}

export async function createUser(
  username: string,
  displayName: string,
  avatarEmoji: string,
  passwordHash: string
): Promise<WUser | null> {
  const { data, error } = await supabase
    .from("whispr_users")
    .insert({ username: username.toLowerCase(), display_name: displayName, avatar_emoji: avatarEmoji, password_hash: passwordHash })
    .select("id, username, display_name, avatar_emoji, created_at")
    .single();
  if (error) return null;
  return data;
}

export async function getMessages(recipientId: string): Promise<WMessage[]> {
  const { data } = await supabase
    .from("whispr_messages")
    .select("*")
    .eq("recipient_id", recipientId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function sendMessage(recipientId: string, content: string, senderMood: string | null): Promise<boolean> {
  const { error } = await supabase
    .from("whispr_messages")
    .insert({ recipient_id: recipientId, content, sender_mood: senderMood });
  return !error;
}

export async function reactToMessage(messageId: string, reaction: string): Promise<boolean> {
  const { error } = await supabase
    .from("whispr_messages")
    .update({ reaction, is_read: true })
    .eq("id", messageId);
  return !error;
}

export async function replyToMessage(messageId: string, reply: string): Promise<boolean> {
  const { error } = await supabase
    .from("whispr_messages")
    .update({ public_reply: reply, is_read: true })
    .eq("id", messageId);
  return !error;
}

export async function getMessageStats(recipientId: string) {
  const { data } = await supabase
    .from("whispr_messages")
    .select("is_read, created_at, sender_mood")
    .eq("recipient_id", recipientId);
  if (!data) return { total: 0, unread: 0, today: 0, week: 0, moods: {} };
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const moods: Record<string, number> = {};
  for (const m of data) {
    if (m.sender_mood) moods[m.sender_mood] = (moods[m.sender_mood] ?? 0) + 1;
  }
  return {
    total: data.length,
    unread: data.filter(m => !m.is_read).length,
    today: data.filter(m => m.created_at >= todayStart).length,
    week: data.filter(m => m.created_at >= weekAgo).length,
    moods,
  };
}
