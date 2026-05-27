# ClinicAI Myanmar — n8n Setup Guide

## Google Sheets Structure

### Create one Google Sheet with 3 tabs:

#### Tab 1: `Sessions`
| sender_id | platform | state | reason | temp_slots | selected_slot | patient_name | last_updated |
|-----------|----------|-------|--------|------------|---------------|--------------|--------------|

#### Tab 2: `Appointments`
| patient_name | sender_id | platform | reason | slot | appointment_datetime | status | reminder_24h_sent | reminder_2h_sent | review_sent | review_sent_at | booked_at |
|---|---|---|---|---|---|---|---|---|---|---|---|

> **appointment_datetime** must be ISO format: `2026-05-29T09:00:00`

#### Tab 3: `Slots` (optional — for dynamic slot management)
| date | time | doctor | max_patients | booked_count | available |
|------|------|--------|--------------|--------------|-----------|

---

## What to Replace in All 3 Workflow Files

| Placeholder | Replace With |
|-------------|-------------|
| `YOUR_GOOGLE_SHEET_ID_HERE` | Sheet ID from URL: `docs.google.com/spreadsheets/d/**THIS_PART**/edit` |
| `YOUR_GOOGLE_CRED_ID` | n8n Google Sheets credential ID |
| `YOUR_VIBER_BOT_TOKEN_HERE` | Token from Viber Business admin panel |
| `YOUR_PAGE_ACCESS_TOKEN_HERE` | Facebook Page Access Token |
| `YOUR_TELEGRAM_BOT_TOKEN` | Telegram bot token (for Mike's notifications) |
| `YOUR_TELEGRAM_CHAT_ID` | Mike's Telegram chat ID |
| `YOUR_GOOGLE_REVIEW_LINK_HERE` | Clinic's Google Maps review URL |

---

## Viber Bot Setup (10 minutes)

1. Go to https://partners.viber.com
2. Create a Bot Account (free)
3. Copy the Auth Token
4. Set Webhook URL to your n8n webhook URL:
   `https://your-n8n.com/webhook/clinic-bot`
5. Enable: `message` and `conversation_started` events

---

## Facebook Messenger Setup (15 minutes)

1. Go to developers.facebook.com
2. Create an App → Add "Messenger" product
3. Connect your clinic's Facebook Page
4. Generate Page Access Token
5. Set Webhook URL to same n8n URL
6. Subscribe to `messages` event
7. Copy Page Access Token

---

## n8n Import Steps

1. Open n8n
2. New Workflow → Import → paste JSON
3. Add Google Sheets credential (OAuth2)
4. Replace all placeholder values
5. Activate workflow
6. Test: send "မင်္ဂလာပါ" to your Viber bot

---

## Testing Checklist

- [ ] Send message to Viber bot → bot replies with greeting
- [ ] Reply with reason → bot shows slots
- [ ] Pick slot number → bot asks for name
- [ ] Give name → confirmation message + Google Sheets row added
- [ ] Reminder workflow runs hourly
- [ ] Review workflow sends 2h after appointment

---

## Per-Client Setup Time

- Google Sheet setup: 10 min
- Viber bot setup: 10 min
- Messenger setup: 15 min
- n8n import + configure: 20 min
- Test: 15 min
- **Total: ~1 hour per client**
