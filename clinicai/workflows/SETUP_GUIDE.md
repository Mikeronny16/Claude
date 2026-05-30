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

## What to Replace in Workflow Files

| Placeholder | Replace With |
|-------------|-------------|
| `YOUR_GOOGLE_SHEET_ID_HERE` | Sheet ID from URL: `docs.google.com/spreadsheets/d/**THIS_PART**/edit` |
| `YOUR_GOOGLE_CRED_ID` | n8n Google Sheets credential ID |
| `YOUR_VIBER_BOT_TOKEN_HERE` | Token from Viber Business admin panel |
| `YOUR_PAGE_ACCESS_TOKEN_HERE` | Facebook Page Access Token |
| `YOUR_TELEGRAM_BOT_TOKEN` | Telegram bot token (for Mike's notifications) |
| `YOUR_TELEGRAM_CHAT_ID` | Mike's Telegram chat ID |
| `YOUR_GOOGLE_REVIEW_LINK_HERE` | Clinic's Google Maps review URL |

### For `1-booking-bot-telegram.json` specifically:
- Credential name must be exactly: **"Telegram account"** (telegramApi)
- Credential name must be exactly: **"Google Sheets account"** (googleSheetsOAuth2Api)
- Sheet ID already set: `1-6Hh2yuRqTv9gx-yJBhB4uqEfe1eGWfo4KnwjEeF8Og`
- Sheet tabs must be named exactly: **"Sessions"** and **"Appointments"**

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

## Telegram Bot Setup (5 minutes)

### Patient Bot (@clinicai_mmtest_bot) — already done
- Token: `8944511208:AAH9m7Id0M3-IS8w3zp4Pad6CHQul2re5KA`
- Credential name in n8n: **"Telegram account"**
- Handles: patient bookings, reminders, doctor notifications

### Doctor Bot (@new_doctor_bot) — setup steps
1. Token: `8866988860:AAHRnLqm_R8n5l5C961GDHqgsDz0y55Lhc8`
2. In n8n: Credentials → New → Telegram API → paste token above
3. Name the credential exactly: **"Doctor Telegram account"**
4. Import `3-doctor-bot-telegram.json` → assign credentials → Activate
5. Test: message @new_doctor_bot with `today`

### Mike's Telegram Chat ID (already set in workflow 1)
- Chat ID: `1636633347`
- Doctor notifications will arrive from @clinicai_mmtest_bot (patient bot)

---

## n8n Import Steps

1. Open n8n (mikeronny.app.n8n.cloud)
2. New Workflow → ⋮ menu → Import from JSON → paste JSON
3. Assign credentials to each node that has a warning icon
4. Click **Publish** → green dot = active
5. Test: send "မင်္ဂလာပါ" to your bot

---

## Testing Checklist

- [ ] Send message to patient bot → bot replies with greeting
- [ ] Reply with reason → bot shows slots
- [ ] Pick slot number → bot asks for name
- [ ] Give name → confirmation message + Google Sheets row added
- [ ] Mike receives notification on Telegram (from @clinicai_mmtest_bot)
- [ ] Send another message to patient bot → bot greets fresh (not "Confirm" again)
- [ ] Message @new_doctor_bot with `today` → see today's appointments
- [ ] Message @new_doctor_bot with `tomorrow` → see tomorrow's appointments
- [ ] Message @new_doctor_bot with `cancel NAME` → appointment marked cancelled
- [ ] Reminder workflow runs hourly
- [ ] Review workflow sends 2h after appointment

## Doctor Bot Commands

| Command | Myanmar | Result |
|---|---|---|
| `today` or `1` | `ဒီနေ့` | Today's appointments |
| `tomorrow` or `2` | `မနက်ဖြန်` | Tomorrow's appointments |
| `all` or `3` | `အားလုံး` | All upcoming appointments |
| `cancel Ko Aung` | `ပယ်ဖျက် ကိုအောင်` | Cancel that patient's booking |

---

## Per-Client Setup Time

- Google Sheet setup: 10 min
- Viber bot setup: 10 min
- Messenger setup: 15 min
- n8n import + configure: 20 min
- Test: 15 min
- **Total: ~1 hour per client**
