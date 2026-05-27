export type Platform = "n8n" | "make";

export type Template = {
  id: string;
  slug: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  whatItDoes: string[];
  platforms: Platform[];
  price_single: number;  // one platform
  price_both: number;    // n8n + Make
  category: string;
  color: string;
  accentColor: string;
  guide: {
    n8n?: GuideStep[];
    make?: GuideStep[];
  };
};

export type GuideStep = {
  step: number;
  title: string;
  detail: string;
  apiKeySource?: string; // URL where to get the API key
};

export const TEMPLATES: Template[] = [
  {
    id: "1",
    slug: "telegram-ai-bot",
    icon: "🤖",
    name: "Telegram AI Bot",
    tagline: "Answer any question on Telegram — automatically with AI",
    description: "Connect your Telegram bot to AI (ChatGPT or Claude). When someone messages your bot, AI replies instantly. Perfect for customer support, FAQ bots, and community assistants.",
    whatItDoes: [
      "Receives messages from your Telegram bot",
      "Sends them to OpenAI GPT-4o (or Claude)",
      "Returns AI reply to the user automatically",
      "Supports group chats and private messages",
      "Optional: remembers conversation history",
    ],
    platforms: ["n8n", "make"],
    price_single: 9,
    price_both: 14,
    category: "AI + Messaging",
    color: "#3b82f6",
    accentColor: "rgba(59,130,246,0.15)",
    guide: {
      n8n: [
        { step: 1, title: "Create a Telegram Bot", detail: "Open Telegram → search @BotFather → send /newbot → follow steps → copy the Bot Token.", apiKeySource: "https://t.me/BotFather" },
        { step: 2, title: "Get OpenAI API Key", detail: "Go to platform.openai.com → Sign in → API Keys → Create new secret key → Copy it.", apiKeySource: "https://platform.openai.com/api-keys" },
        { step: 3, title: "Import to n8n", detail: "In n8n: Workflows → Import → paste the JSON file content → Save." },
        { step: 4, title: "Add Credentials", detail: "Click the Telegram node → Credentials → Add → paste your Bot Token. Click the OpenAI node → Credentials → Add → paste your API Key." },
        { step: 5, title: "Activate", detail: "Click the toggle top-right to Activate. Your bot is live! Test by sending a message to your Telegram bot." },
      ],
      make: [
        { step: 1, title: "Create a Telegram Bot", detail: "Open Telegram → search @BotFather → send /newbot → follow steps → copy the Bot Token.", apiKeySource: "https://t.me/BotFather" },
        { step: 2, title: "Get OpenAI API Key", detail: "Go to platform.openai.com → Sign in → API Keys → Create new secret key → Copy it.", apiKeySource: "https://platform.openai.com/api-keys" },
        { step: 3, title: "Import Blueprint to Make", detail: "In Make.com: Scenarios → Create new → Import Blueprint → upload the .json file." },
        { step: 4, title: "Connect Telegram", detail: "Click the Telegram module → Add connection → paste your Bot Token → Save." },
        { step: 5, title: "Connect OpenAI", detail: "Click the OpenAI module → Add connection → paste your API Key → Save." },
        { step: 6, title: "Turn On", detail: "Toggle the Scenario ON. Test by messaging your Telegram bot." },
      ],
    },
  },
  {
    id: "2",
    slug: "social-media-autoposter",
    icon: "📱",
    name: "Social Media Auto-Poster",
    tagline: "Schedule and auto-post to Facebook & Instagram from one place",
    description: "Write your posts in a Google Sheet, set a schedule, and this workflow automatically posts to your Facebook Page and Instagram Business account. Zero manual work.",
    whatItDoes: [
      "Reads posts from Google Sheets (text + image URL)",
      "Posts to Facebook Page automatically",
      "Posts to Instagram Business account",
      "Runs on your chosen schedule (daily, weekly)",
      "Marks rows as 'Posted' after publishing",
    ],
    platforms: ["n8n", "make"],
    price_single: 9,
    price_both: 14,
    category: "Social Media",
    color: "#a855f7",
    accentColor: "rgba(168,85,247,0.15)",
    guide: {
      n8n: [
        { step: 1, title: "Create Google Sheet", detail: "Create a Google Sheet with columns: Post Text | Image URL | Status. Fill in your posts. Leave Status empty." },
        { step: 2, title: "Get Google Sheets credentials", detail: "In n8n: Credentials → Google Sheets OAuth2 → Sign in with Google → Allow access." },
        { step: 3, title: "Get Facebook Page Token", detail: "Go to developers.facebook.com → My Apps → create app → Get a Page Access Token for your Facebook Page.", apiKeySource: "https://developers.facebook.com" },
        { step: 4, title: "Get Instagram credentials", detail: "Your Instagram must be a Business account linked to your Facebook Page. Use the same Facebook App to get Instagram Graph API access." },
        { step: 5, title: "Import and configure", detail: "Import the JSON to n8n → connect credentials → set your Sheet ID (from the sheet URL) → set schedule → Activate." },
      ],
      make: [
        { step: 1, title: "Create Google Sheet", detail: "Create a Google Sheet with columns: Post Text | Image URL | Status. Fill in your posts." },
        { step: 2, title: "Import Blueprint", detail: "In Make.com: Import the .json blueprint → connect Google Sheets module with your Google account." },
        { step: 3, title: "Connect Facebook", detail: "Click Facebook Pages module → Add connection → log in to Facebook → choose your Page." },
        { step: 4, title: "Connect Instagram", detail: "Click Instagram module → Add connection → log in (must be Business account)." },
        { step: 5, title: "Set Schedule", detail: "Click the clock icon → set to run daily or at your preferred time → Turn scenario ON." },
      ],
    },
  },
  {
    id: "3",
    slug: "business-automation",
    icon: "🏢",
    name: "Business Automation Bundle",
    tagline: "Auto-notify orders, send invoices, follow up customers",
    description: "3 workflows in one: (1) Get Telegram notification for every new order, (2) Auto-send invoice email to customer, (3) Follow-up email 3 days after purchase. Perfect for online sellers.",
    whatItDoes: [
      "New order → instant Telegram notification to you",
      "Auto-send invoice/receipt email to customer",
      "3-day follow-up email (review request or upsell)",
      "Works with Shopify, WooCommerce, or form submissions",
      "All 3 workflows included in one package",
    ],
    platforms: ["n8n", "make"],
    price_single: 9,
    price_both: 14,
    category: "E-commerce",
    color: "#f59e0b",
    accentColor: "rgba(245,158,11,0.15)",
    guide: {
      n8n: [
        { step: 1, title: "Create a Telegram Bot for notifications", detail: "Open Telegram → @BotFather → /newbot → copy Bot Token. Also note your Telegram Chat ID (use @userinfobot).", apiKeySource: "https://t.me/BotFather" },
        { step: 2, title: "Get Gmail/SMTP credentials", detail: "In n8n: Credentials → Gmail OAuth2 → sign in with Google → Allow. This lets n8n send emails from your Gmail." },
        { step: 3, title: "Set up order webhook", detail: "In your store (Shopify/WooCommerce): go to Settings → Webhooks → Add webhook → paste the n8n webhook URL from the trigger node." },
        { step: 4, title: "Import all 3 workflows", detail: "Import each of the 3 JSON files separately into n8n. Connect credentials to each." },
        { step: 5, title: "Activate all 3", detail: "Toggle all 3 workflows ON. Test by placing a test order in your store." },
      ],
      make: [
        { step: 1, title: "Create Telegram Bot", detail: "Open Telegram → @BotFather → /newbot → copy Token.", apiKeySource: "https://t.me/BotFather" },
        { step: 2, title: "Connect Gmail", detail: "In Make: Gmail module → Add connection → sign in with Google → Allow access." },
        { step: 3, title: "Import all 3 blueprints", detail: "Import each .json file as a separate Scenario in Make.com. Connect Telegram and Gmail to each." },
        { step: 4, title: "Set order webhook", detail: "Copy the Webhook URL from the first module of each scenario → paste into your store's webhook settings." },
        { step: 5, title: "Turn ON all 3", detail: "Toggle all 3 scenarios ON. Place a test order to verify notifications arrive." },
      ],
    },
  },
  {
    id: "4",
    slug: "lead-gen-crm",
    icon: "🎯",
    name: "Lead Gen + CRM",
    tagline: "Capture leads, store in Google Sheets, auto email + notify",
    description: "Someone fills your form → lead saved to Google Sheets → welcome email sent to them → you get a Telegram notification. Full automated lead pipeline with zero manual work.",
    whatItDoes: [
      "Captures leads from any form (Typeform, Google Form, website)",
      "Saves lead data to Google Sheets automatically",
      "Sends personalized welcome email to the lead",
      "Sends Telegram notification to you instantly",
      "Optional: follow-up email sequence (Day 1, Day 3, Day 7)",
    ],
    platforms: ["n8n", "make"],
    price_single: 9,
    price_both: 14,
    category: "Lead Generation",
    color: "#22c55e",
    accentColor: "rgba(34,197,94,0.15)",
    guide: {
      n8n: [
        { step: 1, title: "Create Google Sheet for leads", detail: "Create a sheet with columns: Name | Email | Phone | Source | Date | Status. Copy the Sheet ID from the URL." },
        { step: 2, title: "Set up your form", detail: "Use Google Forms, Typeform, or your website contact form. In n8n, the webhook URL from the trigger node is what you'll paste into your form's webhook/submission settings." },
        { step: 3, title: "Telegram Bot for notifications", detail: "Create a bot via @BotFather. Get your Chat ID via @userinfobot.", apiKeySource: "https://t.me/BotFather" },
        { step: 4, title: "Gmail for email sending", detail: "n8n Credentials → Gmail OAuth2 → sign in → Allow. Used to send welcome emails from your Gmail address." },
        { step: 5, title: "Import, configure, activate", detail: "Import JSON → set Sheet ID → connect Gmail + Telegram credentials → paste your email template → Activate." },
      ],
      make: [
        { step: 1, title: "Create Google Sheet for leads", detail: "Create columns: Name | Email | Phone | Source | Date. Copy Sheet ID from URL." },
        { step: 2, title: "Import Blueprint", detail: "In Make.com: New Scenario → Import Blueprint → upload .json file." },
        { step: 3, title: "Connect Google Sheets", detail: "Click Sheets module → Add connection → sign in with Google → select your sheet and columns." },
        { step: 4, title: "Connect Gmail + Telegram", detail: "Click Gmail module → Add connection. Click Telegram module → Add connection → paste Bot Token." },
        { step: 5, title: "Connect your form", detail: "Copy the Webhook URL from Make scenario → paste into your form's webhook/integrations settings. Turn scenario ON." },
      ],
    },
  },
];

export const BUNDLE_PRICE = 29;
export const BUNDLE_PRICE_SINGLE_PLATFORM = 19;

export function getTemplate(slug: string) {
  return TEMPLATES.find(t => t.slug === slug);
}
