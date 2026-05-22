export type Script = {
  id: number;
  category: string;
  title: string;
  script: string;
};

export const SCRIPTS: Script[] = [
  // ─── Instagram DMs — Client Outreach ──────────────────────────────────────
  {
    id: 1,
    category: "Instagram DMs — Client Outreach",
    title: '"Noticed Your Work" Opener',
    script:
      "Hey [NAME] 👋\n\nI've been following your content and really liked [SPECIFIC POST/REEL].\n\nI help [NICHE] businesses with [YOUR SERVICE — e.g. graphic design / copywriting / video editing].\n\nWould it be weird if I shared one quick idea I had for your page?\n\nNo pitch — just a free idea. You can say no 😄",
  },
  {
    id: 2,
    category: "Instagram DMs — Client Outreach",
    title: '"I Help Businesses Like Yours"',
    script:
      "Hey [NAME],\n\nI noticed you're a [THEIR NICHE] — I specialize in helping [NICHE] businesses [RESULT — e.g. get more clients / save time on content].\n\nI've done this for [CLIENT NAME or \"3 clients in your space\"] recently.\n\nWould you be open to a 5-minute chat this week?",
  },
  {
    id: 3,
    category: "Instagram DMs — Client Outreach",
    title: '"Saw Your Recent Post" Contextual',
    script:
      "Hey [NAME] — your post about [TOPIC] was really good.\n\nIt made me think: have you ever tried [IDEA RELATED TO YOUR SERVICE]?\n\nI recently helped [CLIENT] do this and they got [RESULT].\n\nJust thought it might help you too 🙂",
  },
  {
    id: 4,
    category: "Instagram DMs — Client Outreach",
    title: '"Quick Question" Curiosity Hook',
    script:
      "Hey [NAME], quick question —\n\nAre you currently handling [SPECIFIC TASK — e.g. video editing / email newsletter / website copy] yourself, or do you have someone for that?\n\nAsking because I might have something useful for you 👀",
  },
  {
    id: 5,
    category: "Instagram DMs — Client Outreach",
    title: '"Social Proof" DM',
    script:
      "Hey [NAME]!\n\nI just wrapped up a project for [SIMILAR BUSINESS TYPE] where I helped them [RESULT — e.g. grow from 2k to 8k followers / close 5 new clients].\n\nI looked at your page and I think we could do something similar for you.\n\nWorth a quick 10-min call?",
  },
  {
    id: 6,
    category: "Instagram DMs — Client Outreach",
    title: '"Free Value First" Opener',
    script:
      "Hey [NAME] 👋\n\nI made something that might help you — [FREE RESOURCE: e.g. a content plan for your niche / a quick profile audit / a template].\n\nNo catch. Just want to get it to the right people.\n\nWant me to send it over?",
  },

  // ─── Cold Emails — Freelance Pitch ────────────────────────────────────────
  {
    id: 7,
    category: "Cold Emails — Freelance Pitch",
    title: '"Quick Idea for [Business]"',
    script:
      "Subject: Quick idea for [COMPANY NAME]\n\nHi [NAME],\n\nI was looking at your [WEBSITE/SOCIAL] and had one specific idea that could [BENEFIT].\n\n[ONE SENTENCE explaining the idea]\n\nI've done this for [CLIENT] and they saw [RESULT].\n\nWould you be open to a 15-minute call this week?\n\n[YOUR NAME]\n[YOUR LINK]",
  },
  {
    id: 8,
    category: "Cold Emails — Freelance Pitch",
    title: '"I Found 3 Things"',
    script:
      "Subject: I found 3 things on [WEBSITE]\n\nHi [NAME],\n\nI was on your website and noticed 3 things that might be limiting your [GOAL]:\n\n1. [ISSUE]\n2. [ISSUE]\n3. [ISSUE]\n\nI fix exactly these for [TYPE OF BUSINESS].\n\nHappy to share the full breakdown on a quick call?\n\n[YOUR NAME]",
  },
  {
    id: 9,
    category: "Cold Emails — Freelance Pitch",
    title: '"Your Competitor Is Doing This"',
    script:
      "Subject: [COMPETITOR] is doing this — thought you should know\n\nHi [NAME],\n\n[COMPETITOR] recently started [STRATEGY] and it seems to be working well.\n\nI help businesses like yours do the same — often faster and at a better price.\n\nWorth 10 minutes to see if it makes sense for [COMPANY]?\n\n[YOUR NAME]",
  },
  {
    id: 10,
    category: "Cold Emails — Freelance Pitch",
    title: '"Mutual Connection"',
    script:
      "Subject: [MUTUAL NAME] suggested I reach out\n\nHi [NAME],\n\n[MUTUAL NAME] mentioned you might be looking for help with [SERVICE].\n\nI've been working with them on [PROJECT] — they thought we'd be a good fit.\n\nI help [TARGET] with [RESULT].\n\nDo you have 15 minutes this week?\n\n[YOUR NAME]",
  },
  {
    id: 11,
    category: "Cold Emails — Freelance Pitch",
    title: '"I Helped Similar Business"',
    script:
      "Subject: I helped [SIMILAR BUSINESS] get [RESULT]\n\nHi [NAME],\n\nI recently worked with [SIMILAR CLIENT] in [NICHE] to [RESULT].\n\nI think I could help [YOUR COMPANY] get there too.\n\nWorth a quick call?\n\n[YOUR NAME]\n[PORTFOLIO LINK]",
  },
  {
    id: 12,
    category: "Cold Emails — Freelance Pitch",
    title: '"2-Minute Read"',
    script:
      "Subject: 2-minute read — [THEIR SPECIFIC PAIN POINT]\n\nHi [NAME],\n\n[PAIN POINT in one sentence]\n\nI built a system that fixes this. Here's how it works:\n\n1. [STEP]\n2. [STEP]\n3. [STEP]\n\nI set this up for [CLIENT] and they went from [BEFORE] to [AFTER].\n\nIs this something you'd want to solve?\n\n[YOUR NAME]",
  },

  // ─── Follow-Up Messages ───────────────────────────────────────────────────
  {
    id: 13,
    category: "Follow-Up Messages",
    title: '"No Reply" 3-Day Follow-Up',
    script:
      "Hey [NAME], just following up on my last message 👋\n\nI know things get busy — no worries at all.\n\nStill happy to [WHAT YOU OFFERED] if timing works better now.\n\nJust a yes or no is totally fine 🙂",
  },
  {
    id: 14,
    category: "Follow-Up Messages",
    title: '"Soft Check-In"',
    script:
      "Hi [NAME],\n\nHope you're having a good week!\n\nWanted to circle back on [WHAT YOU DISCUSSED]. Have you had a chance to think it over?\n\nNo pressure — just didn't want it to get lost in your inbox.",
  },
  {
    id: 15,
    category: "Follow-Up Messages",
    title: '"Last Message" Breakup',
    script:
      "Hey [NAME],\n\nI'll make this my last follow-up — I don't want to be annoying.\n\nIf the timing ever works for [YOUR SERVICE], I'm here: [CONTACT/LINK].\n\nEither way, hope things go well for [THEIR BUSINESS]! 🙌",
  },
  {
    id: 16,
    category: "Follow-Up Messages",
    title: '"Value Add" Follow-Up',
    script:
      "Hey [NAME],\n\nDidn't want to follow up empty-handed, so I put together [FREE RESOURCE] for you.\n\n[LINK or brief description]\n\nStill happy to chat about working together too — but no pressure. Hope this helps either way!",
  },
  {
    id: 17,
    category: "Follow-Up Messages",
    title: '"New Angle" Follow-Up',
    script:
      "Hey [NAME],\n\nI reached out about [ORIGINAL TOPIC] before — but I wanted to bring up something different.\n\nI just noticed [NEW OBSERVATION] about your business and I think there's an opportunity around [NEW ANGLE].\n\nWould this be more relevant to you right now?",
  },

  // ─── Collab & Partnership DMs ─────────────────────────────────────────────
  {
    id: 18,
    category: "Collab & Partnership DMs",
    title: "Brand Collaboration Outreach",
    script:
      "Hey [BRAND] team 👋\n\nI'm [YOUR NAME], a [CREATOR TYPE] with [AUDIENCE SIZE]. My audience is mainly [DEMOGRAPHIC].\n\nI'd love to explore a collab — specifically [IDEA: sponsored post / product review / giveaway].\n\nMy recent collab with [BRAND] got [RESULT].\n\nWould your team be open to this?",
  },
  {
    id: 19,
    category: "Collab & Partnership DMs",
    title: "Podcast/YouTube Collab Request",
    script:
      "Hey [NAME],\n\nI've been following [THEIR SHOW] for a while — loved your episode on [TOPIC].\n\nI think our audiences overlap well. I create content for [YOUR NICHE] and I know [THEIR AUDIENCE] would love [YOUR TOPIC].\n\nWould you be open to having me as a guest? I'd promote the episode to my [AUDIENCE SIZE] followers.\n\nHere's my content: [LINK]",
  },
  {
    id: 20,
    category: "Collab & Partnership DMs",
    title: "Cross-Promotion Pitch",
    script:
      "Hey [NAME]!\n\nYour content on [TOPIC] is really solid.\n\nQuick idea: I think our audiences would love each other. I have [YOUR AUDIENCE] in [YOUR NICHE] and you have [THEIR NICHE].\n\nWhat if we did a simple cross-promo? I mention you, you mention me. No money — just mutual growth.\n\nInterested?",
  },
  {
    id: 21,
    category: "Collab & Partnership DMs",
    title: "Affiliate/Commission Partnership",
    script:
      "Hey [NAME],\n\nI've been using [THEIR PRODUCT] and genuinely love it — I mention it to my audience regularly.\n\nDo you have an affiliate program? I'd love to promote it more officially.\n\nMy audience is [SIZE] [NICHE] — I think conversion would be solid.\n\nLet me know!",
  },
  {
    id: 22,
    category: "Collab & Partnership DMs",
    title: "Guest Post / Content Swap",
    script:
      "Hey [NAME],\n\nI'm [YOUR NAME], I write about [YOUR TOPIC] for [YOUR PLATFORM/AUDIENCE SIZE].\n\nI'd love to write a guest post for [THEIR BLOG/NEWSLETTER] on [SPECIFIC TOPIC IDEA].\n\nIn return, I'd promote the piece to my audience and we could do a content swap.\n\nWould this be a fit?",
  },

  // ─── Objection Replies ────────────────────────────────────────────────────
  {
    id: 23,
    category: "Objection Replies",
    title: '"I Can\'t Afford It" Reply',
    script:
      "Totally understand — budget is always a real thing.\n\nQuick question though: what would it mean for your business if [RESULT YOUR SERVICE DELIVERS]?\n\nI ask because I don't want price to be the only thing standing between you and [OUTCOME].\n\nI'm also happy to discuss a smaller starting scope if that helps.",
  },
  {
    id: 24,
    category: "Objection Replies",
    title: '"I\'ll Think About It" Reply',
    script:
      "Of course, take your time!\n\nJust so you have everything while you think: [BRIEF RECAP of your offer].\n\nIs there anything specific holding you back that I can help clarify?\n\nHappy to answer questions — no pressure 🙂",
  },
  {
    id: 25,
    category: "Objection Replies",
    title: '"Already Working With Someone" Reply',
    script:
      "That's great — glad you have support!\n\nOut of curiosity, is it working well? Sometimes people keep a backup for [SPECIFIC THING YOUR SERVICE DOES DIFFERENTLY].\n\nNo pressure to switch — just want to understand if I could help down the line.",
  },
  {
    id: 26,
    category: "Objection Replies",
    title: '"Send Me Your Rates" Reply',
    script:
      "Happy to!\n\nBefore I send numbers, I want to make sure it's relevant — rates vary a lot by scope.\n\nCould you quickly tell me:\n1. What's the main thing you want help with?\n2. One-time project or ongoing?\n\nThen I'll send a clear breakdown — no fluff, no hidden fees.",
  },

  // ─── Proposal Openers ─────────────────────────────────────────────────────
  {
    id: 27,
    category: "Proposal Openers",
    title: "Discovery Call Closer",
    script:
      "Thanks so much for the call, [NAME]!\n\nBased on what you shared:\n[1-2 sentence summary of their problem]\n\nHere's what working together would look like:\n• [DELIVERABLE]\n• [TIMELINE]\n• [EXPECTED OUTCOME]\n\nI'll send a formal proposal by [DATE]. Any questions in the meantime?",
  },
  {
    id: 28,
    category: "Proposal Openers",
    title: '"Here\'s What I\'d Do" Value Opener',
    script:
      "Hey [NAME],\n\nBefore I send a formal proposal, here's exactly what I'd do:\n\nPhase 1 ([WEEK 1-2]): [WHAT YOU'D DO]\nPhase 2 ([WEEK 3-4]): [WHAT YOU'D DO]\nExpected result: [OUTCOME]\n\nInvestment: [PRICE RANGE]\n\nDoes this direction make sense for [THEIR BUSINESS]?",
  },
  {
    id: 29,
    category: "Proposal Openers",
    title: "Project Scope Intro",
    script:
      "Hi [NAME],\n\nHere's a quick summary of what I'm proposing:\n\n📌 Deliverable: [WHAT YOU'LL DELIVER]\n📅 Timeline: [TIMEFRAME]\n💰 Investment: [PRICE]\n🔄 Revisions: [NUMBER] rounds included\n\nI'm confident this will [SPECIFIC RESULT].\n\nLet me know if you want to adjust anything before I send the contract.",
  },
  {
    id: 30,
    category: "Proposal Openers",
    title: '"Why Me" Pitch',
    script:
      "Hi [NAME],\n\nI know you've probably heard from other freelancers — here's why I'm different:\n\n✅ I specialize in [NICHE] — not a generalist\n✅ [SPECIFIC RESULT I'VE GOTTEN FOR CLIENTS]\n✅ [UNIQUE PROCESS/APPROACH]\n✅ You work directly with me, not a junior\n\nMy clients typically see [RESULT] within [TIMEFRAME].\n\nPortfolio: [LINK]\n\nCan we set up 15 minutes this week?",
  },
];

export const CATEGORIES = [
  "Instagram DMs — Client Outreach",
  "Cold Emails — Freelance Pitch",
  "Follow-Up Messages",
  "Collab & Partnership DMs",
  "Objection Replies",
  "Proposal Openers",
] as const;

export type Category = (typeof CATEGORIES)[number];
