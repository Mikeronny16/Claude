/**
 * Lightweight text safety checks for a 12–15 audience.
 *
 * This is a first line of defense for short text (names, titles, AI prompts),
 * not a replacement for human or model-based moderation. It runs identically on
 * the client (instant feedback) and the server (enforcement).
 */

export type SafetyCode = "empty" | "too-short" | "too-long" | "personal-info" | "unsafe" | "invalid";

export type SafetyResult = { ok: true } | { ok: false; code: SafetyCode; message: string };

export const SAFETY_MESSAGES: Record<SafetyCode, string> = {
  empty: "Type something first.",
  "too-short": "That's a bit too short.",
  "too-long": "That's a bit too long — try fewer words.",
  "personal-info":
    "That looks like personal info (a link, number, email, address or social handle). Keep it secret, keep it safe!",
  unsafe: "Let's keep NEXORA friendly for everyone. Try different words.",
  invalid: "Use letters, numbers, spaces, - or _ only.",
};

const fail = (code: SafetyCode): SafetyResult => ({ ok: false, code, message: SAFETY_MESSAGES[code] });

// Plain-language terms that are off-limits for a teen creative space.
const BLOCKED_TERMS = [
  // violence (fantasy words like sword, shield, dragon and battle stay allowed)
  "kill", "killer", "murder", "blood", "bloody", "gore", "gory", "corpse", "stab", "shoot", "shooter",
  "gun", "rifle", "pistol", "bomb", "grenade", "explosive", "terrorist", "torture", "behead", "massacre",
  // self-harm
  "suicide", "suicidal", "selfharm", "kms",
  // sexual content
  "sex", "sexy", "sexual", "nude", "nudes", "naked", "porn", "porno", "nsfw", "hentai", "horny",
  "penis", "vagina", "xxx", "onlyfans",
  // drugs, alcohol, tobacco
  "drug", "cocaine", "weed", "marijuana", "meth", "heroin", "vape", "beer", "vodka", "alcohol", "drunk",
  "cigarette",
  // hate
  "nazi", "hitler", "kkk", "swastika",
];

// Profanity and slurs, stored ROT13-encoded so the source stays readable.
const ENCODED_TERMS = [
  "shpx", "shpxvat", "shpxre", "zbgureshpxre", "fuvg", "ovgpu", "onfgneq", "nffubyr", "qvpx", "phag",
  "juber", "fyhg", "ergneq", "snttbg", "snt", "avttre", "avttn", "pbba", "fcvp", "puvax", "xvxr",
];

const BLOCKED_PHRASES = [
  "self harm", "kill myself", "hurt myself", "cut myself", "end my life",
  "dead body",
];

const CONTACT_PHRASES = [
  "snapchat", "snap me", "instagram", "insta", "discord", "whatsapp", "telegram", "tiktok", "kik",
  "my address", "i live at", "my phone", "my number", "dm me", "add me", "text me",
  "call me", "my school", "where do you live",
];

function rot13(s: string): string {
  return s.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 13) % 26) + 97));
}

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i" };

/** Collapse repeated letters so "kiiiill" and "kill" compare equal. */
const squeeze = (s: string) => s.replace(/(.)\1+/g, "$1");

// Each term is stored as written plus its squeezed form. Very short squeezed
// forms ("xxx" -> "x") are skipped so ordinary single letters never match.
const BLOCKED_SET = new Set(
  [...BLOCKED_TERMS, ...ENCODED_TERMS.map(rot13)].flatMap((t) => {
    const sq = squeeze(t);
    return sq.length >= 3 ? [t, sq] : [t];
  }),
);

const isBlockedToken = (token: string) =>
  stems(token).some((s) => BLOCKED_SET.has(s) || (squeeze(s).length >= 3 && BLOCKED_SET.has(squeeze(s))));

/** Lowercase, strip accents, undo common leetspeak, and split into word tokens. */
export function tokenize(text: string): string[] {
  const lowered = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[013457@$!]/g, (c) => LEET[c] ?? c);
  const raw = lowered.split(/[^a-z]+/).filter(Boolean);
  // Re-join spaced-out letters ("k i l l" -> "kill").
  const tokens: string[] = [];
  let run = "";
  for (const t of raw) {
    if (t.length === 1) {
      run += t;
      continue;
    }
    if (run.length >= 3) tokens.push(run);
    else if (run) tokens.push(...run.split(""));
    run = "";
    tokens.push(t);
  }
  if (run.length >= 3) tokens.push(run);
  else if (run) tokens.push(...run.split(""));
  return tokens;
}

function stems(token: string): string[] {
  const out = [token];
  for (const suffix of ["ing", "ers", "er", "ed", "es", "s", "y"]) {
    if (token.length > suffix.length + 2 && token.endsWith(suffix)) out.push(token.slice(0, -suffix.length));
  }
  return out;
}

export function containsBlockedLanguage(text: string): boolean {
  const tokens = tokenize(text);
  if (tokens.some(isBlockedToken)) return true;
  const joined = ` ${tokens.join(" ")} `;
  if (BLOCKED_PHRASES.some((p) => joined.includes(` ${p} `))) return true;
  // Catch terms hidden by punctuation inside a word ("k.i.l.l", "s-e-x").
  const compact = text.toLowerCase().replace(/[^a-z]/g, "");
  return compact.length >= 3 && compact.length <= 24 && isBlockedToken(compact);
}

const EMAIL = /[a-z0-9._%+-]+\s*(@|\(at\)|\[at\])\s*[a-z0-9.-]+\.[a-z]{2,}/i;
const URL = /(https?:\/\/|www\.)|\b[a-z0-9-]+\.(com|net|org|io|gg|me|ly|tv|app|co|xyz|link)\b/i;
const PHONE = /(\+?\d[\s\-.()]*){7,}/;
const HANDLE = /(^|\s)@[a-z0-9_.]{2,}/i;
const ADDRESS = /\b\d{1,5}\s+[a-z]+(\s[a-z]+)?\s+(street|st|road|rd|avenue|ave|lane|ln|drive|dr|blvd|boulevard)\b/i;

export function containsPersonalInfo(text: string): boolean {
  if (EMAIL.test(text) || URL.test(text) || PHONE.test(text) || HANDLE.test(text) || ADDRESS.test(text)) return true;
  const joined = ` ${tokenize(text).join(" ")} `;
  return CONTACT_PHRASES.some((p) => joined.includes(` ${p} `));
}

export function checkText(text: string, opts: { min?: number; max?: number } = {}): SafetyResult {
  const { min = 1, max = 160 } = opts;
  const trimmed = text.trim();
  if (!trimmed) return fail("empty");
  if (trimmed.length < min) return fail("too-short");
  if (trimmed.length > max) return fail("too-long");
  if (containsPersonalInfo(trimmed)) return fail("personal-info");
  if (containsBlockedLanguage(trimmed)) return fail("unsafe");
  return { ok: true };
}

/** Explorer names and world names: short, no digits runs that could be a birth year or number. */
export function validateName(name: string, opts: { min?: number; max?: number } = {}): SafetyResult {
  const { min = 3, max = 20 } = opts;
  const trimmed = name.trim();
  if (!trimmed) return fail("empty");
  if (trimmed.length < min) return fail("too-short");
  if (trimmed.length > max) return fail("too-long");
  if (!/^[\p{L}\p{N} _'-]+$/u.test(trimmed) || !/\p{L}/u.test(trimmed)) return fail("invalid");
  if (/\d{4,}/.test(trimmed)) return fail("personal-info");
  return checkText(trimmed, { min, max });
}

/** Returns the text if it passes, otherwise a safe fallback. Used on AI output. */
export function safeOr(text: string, fallback: string, max = 140): string {
  const clipped = text.trim().slice(0, max);
  return checkText(clipped, { max }).ok ? clipped : fallback;
}
