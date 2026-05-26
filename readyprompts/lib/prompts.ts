export type Prompt = { id: number; category: string; title: string; prompt: string };

export const PROMPTS: Prompt[] = [
  // ═══════════════════════════════════════
  // TIKTOK & SHORT VIDEO CONTENT (1-20)
  // ═══════════════════════════════════════
  { id: 1, category: "TikTok & Short Video", title: "Hook Generator", prompt: "Write 5 powerful TikTok video hooks for a video about [TOPIC]. Each hook must be under 7 words and create instant curiosity. Make the viewer unable to scroll past." },
  { id: 2, category: "TikTok & Short Video", title: "Script 60s Video", prompt: "Write a 60-second TikTok script about [TOPIC]. Include: Hook (0-5s), Problem (5-15s), Solution (15-45s), CTA (45-60s). Keep it conversational and energetic." },
  { id: 3, category: "TikTok & Short Video", title: "Trend Caption", prompt: "Write 10 trending TikTok captions for a video about [TOPIC]. Include relevant hashtags. Make each caption create FOMO and get people to comment." },
  { id: 4, category: "TikTok & Short Video", title: "Story Format", prompt: "Turn this idea into a compelling TikTok story format: [YOUR IDEA]. Use: 'I used to... until I discovered... now I...' storytelling structure. Under 150 words." },
  { id: 5, category: "TikTok & Short Video", title: "Viral List Video", prompt: "Create a '5 things nobody tells you about [TOPIC]' TikTok script. Each point must be surprising, specific, and make viewers save the video." },
  { id: 6, category: "TikTok & Short Video", title: "POV Script", prompt: "Write a POV: [SITUATION] TikTok script. Make it relatable, emotional, and shareable. Include visual directions for each scene." },
  { id: 7, category: "TikTok & Short Video", title: "Duet Bait", prompt: "Write a TikTok script about [TOPIC] designed to get duets and stitches. End with a question or challenge that makes people want to respond." },
  { id: 8, category: "TikTok & Short Video", title: "Comment Section Bait", prompt: "Write a TikTok script about [TOPIC] that deliberately leaves a gap so viewers have to comment to get the answer. Build suspense throughout." },
  { id: 9, category: "TikTok & Short Video", title: "Day in My Life", prompt: "Write a 'day in my life as a [PROFESSION/LIFESTYLE]' TikTok voiceover script. Make it aspirational, honest, and entertaining. Include 8 scene descriptions." },
  { id: 10, category: "TikTok & Short Video", title: "Tutorial Script", prompt: "Write a step-by-step tutorial TikTok script for [HOW TO DO X]. Make each step clear and visual. Add personality and make it entertaining, not boring." },
  { id: 11, category: "TikTok & Short Video", title: "Controversial Take", prompt: "Write a TikTok script with a controversial but defensible take about [TOPIC/INDUSTRY]. Structure: bold claim → evidence → twist ending that makes people think." },
  { id: 12, category: "TikTok & Short Video", title: "Before/After", prompt: "Write a Before/After transformation TikTok script for [PRODUCT/SERVICE/HABIT]. Make the before painful and relatable. Make the after aspirational and specific." },
  { id: 13, category: "TikTok & Short Video", title: "Reaction Script", prompt: "Write a reaction-style TikTok script where I react to [TRENDING TOPIC/COMMON MISTAKE]. Include my genuine reactions and valuable insights. Keep under 60 seconds." },
  { id: 14, category: "TikTok & Short Video", title: "Q&A Format", prompt: "Create 5 TikTok Q&A scripts answering common questions about [YOUR NICHE]. Each answer should be 20-30 seconds, direct, and end with a surprising fact." },
  { id: 15, category: "TikTok & Short Video", title: "Behind The Scenes", prompt: "Write a behind-the-scenes TikTok script showing [PROCESS/BUSINESS/SKILL]. Make viewers feel like insiders. Include 3 surprising revelations." },
  { id: 16, category: "TikTok & Short Video", title: "Money Content", prompt: "Write a TikTok script about how I make [AMOUNT] per [TIME PERIOD] with [METHOD]. Be specific with numbers. Make it motivating without being braggy." },
  { id: 17, category: "TikTok & Short Video", title: "Myth Buster", prompt: "Write a 'Stop believing these [NICHE] myths' TikTok script. List 3 myths, bust each one with evidence, and end with actionable truth." },
  { id: 18, category: "TikTok & Short Video", title: "Beginner Guide", prompt: "Write a TikTok script: 'If I started [SKILL/BUSINESS] from zero today, here's exactly what I'd do.' Give 4 specific steps. Speak directly to beginners." },
  { id: 19, category: "TikTok & Short Video", title: "Trending Sound Script", prompt: "Write 3 different TikTok video concepts using trending audio/sound formats for [YOUR NICHE]. Include text overlay suggestions and visual cues." },
  { id: 20, category: "TikTok & Short Video", title: "CTA Closer", prompt: "Write 10 TikTok video closings that drive followers and profile visits. Each must be natural, not salesy, and specific to [YOUR NICHE]." },

  // ═══════════════════════════════════════
  // INSTAGRAM CONTENT (21-38)
  // ═══════════════════════════════════════
  { id: 21, category: "Instagram Content", title: "Carousel Caption", prompt: "Write an Instagram carousel caption for [TOPIC]. Include: attention-grabbing first line, value teaser ('swipe to see...'), and CTA. Under 150 words." },
  { id: 22, category: "Instagram Content", title: "Reel Script", prompt: "Write an Instagram Reel script about [TOPIC]. 30-45 seconds. Include hook, 3 key points, and strong CTA. Add on-screen text suggestions." },
  { id: 23, category: "Instagram Content", title: "Story Series", prompt: "Create a 7-story Instagram Story series about [TOPIC]. Each story should build on the last. Include polls, questions, and swipe-ups to keep engagement high." },
  { id: 24, category: "Instagram Content", title: "Bio Optimizer", prompt: "Write 5 Instagram bio options for a [TYPE] creator/business. Each must include: what you do, who you help, unique value, and CTA. Under 150 characters each." },
  { id: 25, category: "Instagram Content", title: "Feed Post Long", prompt: "Write a long-form Instagram feed post about [TOPIC/PERSONAL STORY]. Use line breaks for readability. Make it emotional, educational, or entertaining. End with a question." },
  { id: 26, category: "Instagram Content", title: "Product Post", prompt: "Write an Instagram post to promote [PRODUCT/SERVICE] without sounding salesy. Lead with value, tell a story, mention the offer naturally. Include hashtags." },
  { id: 27, category: "Instagram Content", title: "Hashtag Strategy", prompt: "Generate 30 Instagram hashtags for a post about [TOPIC]. Mix: 10 niche (under 100K posts), 10 medium (100K-1M), 10 broad (1M+). Explain the strategy." },
  { id: 28, category: "Instagram Content", title: "Collab Pitch DM", prompt: "Write an Instagram DM to pitch a collab with [TYPE OF CREATOR/BRAND]. Be genuine, specific about why them, clear about the value exchange. Under 100 words." },
  { id: 29, category: "Instagram Content", title: "Save-Worthy Post", prompt: "Create an Instagram carousel about [TOPIC] designed to get saved. Include a title slide, 5 valuable slides with tips/stats, and a 'save for later' CTA slide." },
  { id: 30, category: "Instagram Content", title: "Comment Booster", prompt: "Write an Instagram post about [TOPIC] that ends with a question that makes people HAVE to comment. The question should be easy to answer but spark debate." },
  { id: 31, category: "Instagram Content", title: "Transformation Post", prompt: "Write an Instagram transformation post: [BEFORE STATE] to [AFTER STATE]. Be vulnerable about the struggle. Be specific about the result. Inspire action." },
  { id: 32, category: "Instagram Content", title: "Quote Graphic", prompt: "Generate 10 powerful, shareable quote graphics for [YOUR NICHE]. Each quote should be original, under 15 words, and make people want to share it." },
  { id: 33, category: "Instagram Content", title: "Weekly Content Plan", prompt: "Create a 7-day Instagram content plan for [YOUR NICHE]. Include post type (Reel/Carousel/Story/Post), topic, hook, and best time to post for each day." },
  { id: 34, category: "Instagram Content", title: "Giveaway Post", prompt: "Write an Instagram giveaway post for [PRIZE]. Include rules that maximize reach (follow, like, tag friends). Create urgency and excitement. Legal disclaimer." },
  { id: 35, category: "Instagram Content", title: "Behind Brand Story", prompt: "Write an 'About Me' Instagram post that builds brand connection. Share your origin story, struggles, mission, and values. Make it human and memorable." },
  { id: 36, category: "Instagram Content", title: "Niche Authority Post", prompt: "Write an Instagram post that establishes me as an expert in [NICHE]. Include a bold stat, common mistake people make, and my unique perspective." },
  { id: 37, category: "Instagram Content", title: "Viral Question Post", prompt: "Create 10 Instagram post ideas using questions that are proven to go viral in the [NICHE] space. Include expected engagement type for each." },
  { id: 38, category: "Instagram Content", title: "Product Launch Sequence", prompt: "Write a 5-post Instagram launch sequence for [PRODUCT]. Day 1: Teaser. Day 2: Problem. Day 3: Solution reveal. Day 4: Social proof. Day 5: Launch post." },

  // ═══════════════════════════════════════
  // MARKETING & SALES (39-58)
  // ═══════════════════════════════════════
  { id: 39, category: "Marketing & Sales", title: "Sales Page Headline", prompt: "Write 10 headline options for a sales page selling [PRODUCT/SERVICE] at [PRICE]. Use different formulas: curiosity, benefit, number, question, how-to." },
  { id: 40, category: "Marketing & Sales", title: "Email Subject Lines", prompt: "Write 20 email subject lines for [CAMPAIGN TYPE] promoting [PRODUCT/SERVICE]. Mix: curiosity, urgency, personal, numbered lists. Aim for 40%+ open rates." },
  { id: 41, category: "Marketing & Sales", title: "Cold DM Pitch", prompt: "Write a cold DM pitch for [SERVICE] targeting [IDEAL CLIENT]. Be specific, show you've done research, offer value first, clear soft CTA. Under 80 words." },
  { id: 42, category: "Marketing & Sales", title: "Objection Handler", prompt: "List the top 5 objections customers have when buying [PRODUCT/SERVICE] and write persuasive responses to each. Make them conversational and empathetic." },
  { id: 43, category: "Marketing & Sales", title: "AIDA Copy", prompt: "Write AIDA sales copy for [PRODUCT/SERVICE]: Attention (hook), Interest (problem/benefit), Desire (transformation), Action (CTA). Conversational, punchy tone." },
  { id: 44, category: "Marketing & Sales", title: "Testimonial Request", prompt: "Write 3 messages to ask satisfied customers for testimonials. Each should be warm, specific about what to include, and make it easy for them to say yes." },
  { id: 45, category: "Marketing & Sales", title: "Upsell Script", prompt: "Write an upsell script for [UPSELL PRODUCT] after a customer buys [MAIN PRODUCT]. Make it feel natural and valuable, not pushy. Include objection handling." },
  { id: 46, category: "Marketing & Sales", title: "Flash Sale Copy", prompt: "Write a flash sale announcement for [PRODUCT] at [DISCOUNT]% off for [TIME]. Create urgency without being desperate. Include SMS, email, and social versions." },
  { id: 47, category: "Marketing & Sales", title: "Referral Program", prompt: "Write a referral program pitch for [BUSINESS]. Explain the reward, how it works, and why customers should refer friends. Keep it exciting and simple." },
  { id: 48, category: "Marketing & Sales", title: "Pricing Page Copy", prompt: "Write pricing page copy for [3 TIERS] of [PRODUCT/SERVICE]. Name each tier creatively. List features. Make the middle tier most attractive. Add FAQ." },
  { id: 49, category: "Marketing & Sales", title: "Video Sales Letter", prompt: "Write a 3-minute video sales letter script for [PRODUCT]. Include: hook, story, problem, solution, social proof, offer, bonuses, guarantee, and CTA." },
  { id: 50, category: "Marketing & Sales", title: "Ad Copy Facebook", prompt: "Write 5 Facebook/Instagram ad copy variations for [PRODUCT/SERVICE] targeting [AUDIENCE]. Mix: problem-aware, solution-aware, and product-aware audiences." },
  { id: 51, category: "Marketing & Sales", title: "Google Ad Copy", prompt: "Write 10 Google Search ad headlines and 5 descriptions for [BUSINESS TYPE] targeting keywords [LIST KEYWORDS]. Follow character limits strictly." },
  { id: 52, category: "Marketing & Sales", title: "Landing Page Copy", prompt: "Write full landing page copy for [PRODUCT/SERVICE]: hero section, benefits, social proof, FAQ, and CTA sections. Conversion-focused, mobile-first." },
  { id: 53, category: "Marketing & Sales", title: "Abandoned Cart Email", prompt: "Write a 3-email abandoned cart sequence for [PRODUCT]. Email 1: gentle reminder. Email 2: address objection. Email 3: last chance + incentive." },
  { id: 54, category: "Marketing & Sales", title: "Partnership Pitch", prompt: "Write a business partnership pitch email to [TYPE OF BUSINESS] for a joint promotion of [YOUR PRODUCT]. Show mutual benefit clearly. Professional but friendly." },
  { id: 55, category: "Marketing & Sales", title: "Case Study Story", prompt: "Write a case study for [CLIENT TYPE] who used [YOUR SERVICE]. Structure: situation, problem, solution implemented, measurable results, client quote." },
  { id: 56, category: "Marketing & Sales", title: "Webinar Invitation", prompt: "Write a webinar invitation for [TOPIC] targeting [AUDIENCE]. Include: compelling title, what they'll learn (3 specific outcomes), host credibility, and CTA." },
  { id: 57, category: "Marketing & Sales", title: "Guarantee Copy", prompt: "Write 5 different money-back guarantee statements for [PRODUCT] that reduce purchase anxiety and increase conversions. Make them bold and specific." },
  { id: 58, category: "Marketing & Sales", title: "Bonus Stack", prompt: "Create a compelling bonus stack for [MAIN OFFER]. Write descriptions for 5 bonuses that make the total package feel like an obvious yes at [PRICE]." },

  // ═══════════════════════════════════════
  // BUSINESS & MONEY MAKING (59-76)
  // ═══════════════════════════════════════
  { id: 59, category: "Business & Money", title: "Business Idea Generator", prompt: "Generate 10 online business ideas for someone with skills in [YOUR SKILLS] and interests in [YOUR INTERESTS]. Include startup cost, earning potential, and first step." },
  { id: 60, category: "Business & Money", title: "Freelance Service Offer", prompt: "Write a freelance service offer for [SKILL] targeting [NICHE]. Include: clear deliverables, timeline, pricing options, and what makes you different. No fluff." },
  { id: 61, category: "Business & Money", title: "Digital Product Ideas", prompt: "Generate 15 digital product ideas I can sell for [PRICE RANGE] based on my knowledge of [TOPIC]. Include product type, target buyer, and estimated demand." },
  { id: 62, category: "Business & Money", title: "Income Stream Map", prompt: "Create a roadmap for building 5 income streams around [YOUR MAIN SKILL/NICHE]. Order from easiest/fastest to hardest/highest paying. Include realistic timelines." },
  { id: 63, category: "Business & Money", title: "Client Proposal", prompt: "Write a professional client proposal for [SERVICE] to [TYPE OF BUSINESS]. Include: executive summary, scope of work, deliverables, timeline, pricing, and next steps." },
  { id: 64, category: "Business & Money", title: "Pricing Strategy", prompt: "Help me price [SERVICE/PRODUCT]. My costs are [X], target market is [Y], competitors charge [Z]. Suggest 3 pricing strategies with pros and cons of each." },
  { id: 65, category: "Business & Money", title: "Niche Finder", prompt: "I want to build a business around [BROAD TOPIC]. Find 5 profitable sub-niches with lower competition. For each: target audience, pain points, monetization methods." },
  { id: 66, category: "Business & Money", title: "Content to Cash", prompt: "Create a content monetization strategy for someone posting about [NICHE] on [PLATFORM]. Include 4 revenue streams that work specifically for this niche and platform." },
  { id: 67, category: "Business & Money", title: "Agency Pitch Deck", prompt: "Write a 10-slide pitch deck outline for a [TYPE] agency. Include: problem, solution, services, case studies, team, pricing, and next steps. Slide by slide." },
  { id: 68, category: "Business & Money", title: "Passive Income Plan", prompt: "Design a 90-day plan to build passive income in [NICHE] starting with [BUDGET/SKILLS]. Week by week. Be specific and realistic, not hype." },
  { id: 69, category: "Business & Money", title: "Product Launch Plan", prompt: "Create a 30-day launch plan for [PRODUCT]. Include: pre-launch content, email sequence, launch week tactics, and post-launch optimization. Day by day breakdown." },
  { id: 70, category: "Business & Money", title: "Competitor Analysis", prompt: "Analyze [COMPETITOR] for me. Find their: strengths, weaknesses, pricing, marketing strategy, and gaps I can exploit. Format as a strategic report." },
  { id: 71, category: "Business & Money", title: "Outsourcing Guide", prompt: "Help me outsource [TASK] for my [BUSINESS TYPE]. Include: where to find talent, how to write the job post, interview questions, and pricing benchmarks." },
  { id: 72, category: "Business & Money", title: "Brand Name Ideas", prompt: "Generate 20 brand name ideas for a [TYPE] business in the [NICHE] space. Mix: descriptive, abstract, and creative names. Check for availability vibes." },
  { id: 73, category: "Business & Money", title: "SOP Creator", prompt: "Create a Standard Operating Procedure for [BUSINESS TASK]. Include: purpose, step-by-step instructions, tools needed, quality checks, and troubleshooting tips." },
  { id: 74, category: "Business & Money", title: "Pitch to Investors", prompt: "Write a 2-minute investor pitch for [BUSINESS IDEA]. Include: problem, solution, market size, traction, business model, team, and ask. Compelling and concise." },
  { id: 75, category: "Business & Money", title: "Side Hustle Starter", prompt: "I have [TIME PER WEEK] hours and [SKILLS]. Suggest the fastest side hustle I can start this week to make [TARGET INCOME]. Give exact first 3 steps." },
  { id: 76, category: "Business & Money", title: "Profit Calculator Script", prompt: "Help me create a profit calculation for [BUSINESS MODEL]. Variables: price, cost, volume, refund rate. Show me breakeven point and scaling projections." },

  // ═══════════════════════════════════════
  // EMAIL MARKETING (77-88)
  // ═══════════════════════════════════════
  { id: 77, category: "Email Marketing", title: "Welcome Email", prompt: "Write a welcome email for new subscribers to [NEWSLETTER/LIST]. Include: warm greeting, what they'll get, your story in 2 sentences, and a quick win they can use today." },
  { id: 78, category: "Email Marketing", title: "5-Day Nurture Sequence", prompt: "Write a 5-day email nurture sequence for [LEAD MAGNET TOPIC] leading to a soft pitch for [PRODUCT]. Day 1: Welcome + win. Days 2-4: Value. Day 5: Offer." },
  { id: 79, category: "Email Marketing", title: "Re-engagement Email", prompt: "Write a re-engagement email for subscribers who haven't opened in 60 days. Be honest about the gap, remind them of value, give a reason to stay. Offer an out." },
  { id: 80, category: "Email Marketing", title: "Newsletter Template", prompt: "Create a weekly newsletter template for [NICHE]. Include: opener hook, main value section (tip/story/insight), quick wins, and CTA. Engaging but scannable." },
  { id: 81, category: "Email Marketing", title: "Broadcast Sales Email", prompt: "Write a single broadcast email promoting [PRODUCT] to a warm list. Tell a story, transition naturally to the offer, create urgency, and close strong." },
  { id: 82, category: "Email Marketing", title: "Segmentation Survey", prompt: "Write a short email survey to segment my list for [BUSINESS TYPE]. Include 3-5 questions that reveal buying intent and content preferences. Make it feel personal." },
  { id: 83, category: "Email Marketing", title: "Event Invitation Email", prompt: "Write an email invitation for [EVENT TYPE: webinar/workshop/launch]. Include: what, when, why attend, what they'll get, and a clear RSVP CTA." },
  { id: 84, category: "Email Marketing", title: "Referral Email", prompt: "Write an email asking subscribers to refer [YOUR NEWSLETTER/PRODUCT] to friends. Make the reward clear, the ask easy, and give them shareable text to copy-paste." },
  { id: 85, category: "Email Marketing", title: "Thank You Email", prompt: "Write a post-purchase thank you email for [PRODUCT]. Confirm delivery, set expectations, give a quick-start tip, and invite them to connect on [PLATFORM]." },
  { id: 86, category: "Email Marketing", title: "Testimonial Follow-up", prompt: "Write a follow-up email 7 days after purchase asking for a testimonial. Make it easy: give them specific questions to answer. Offer a bonus for responding." },
  { id: 87, category: "Email Marketing", title: "List Cleaning Email", prompt: "Write an email to clean my list. Ask inactive subscribers if they want to stay. Give a compelling reason to re-engage. Auto-remove non-responders after X days." },
  { id: 88, category: "Email Marketing", title: "Deadline Reminder", prompt: "Write a 3-email deadline sequence (48hr, 24hr, 2hr) for the close of [OFFER]. Escalate urgency naturally. Each email different angle: scarcity, loss, final push." },

  // ═══════════════════════════════════════
  // PERSONAL BRAND (89-100+)
  // ═══════════════════════════════════════
  { id: 89, category: "Personal Brand", title: "Origin Story", prompt: "Help me write my personal brand origin story for [NICHE]. Include: where I started, the struggle, the turning point, and where I am now. Authentic, not perfect." },
  { id: 90, category: "Personal Brand", title: "LinkedIn About Section", prompt: "Write my LinkedIn About section as a [JOB TITLE/CREATOR] in [INDUSTRY]. Include: hook, who I help, how I help, results I've achieved, and CTA. Under 300 words." },
  { id: 91, category: "Personal Brand", title: "Twitter/X Bio", prompt: "Write 5 Twitter/X bio options for a [TYPE] creator. Under 160 characters. Include personality, what I tweet about, and one credibility marker. Stand out." },
  { id: 92, category: "Personal Brand", title: "Personal Brand Statement", prompt: "Write a clear personal brand statement for [YOUR NAME] who helps [TARGET AUDIENCE] achieve [RESULT] through [YOUR METHOD]. Make it memorable and specific." },
  { id: 93, category: "Personal Brand", title: "Thought Leadership Post", prompt: "Write a thought leadership post for [PLATFORM] sharing my contrarian take on [TOPIC IN YOUR INDUSTRY]. Back it up with logic. Invite respectful debate." },
  { id: 94, category: "Personal Brand", title: "Media Kit Bio", prompt: "Write 3 versions of my bio (short: 50 words, medium: 100 words, long: 250 words) for press/media kit. Focus on [MY SPECIALTY] and key achievements." },
  { id: 95, category: "Personal Brand", title: "Speaker Introduction", prompt: "Write a 60-second speaker introduction for [YOUR NAME] speaking about [TOPIC] at [EVENT TYPE]. Build credibility, create anticipation, and warm up the audience." },
  { id: 96, category: "Personal Brand", title: "Podcast Guest Pitch", prompt: "Write a podcast guest pitch email to [PODCAST NAME]. Show you've listened, propose 3 topic angles, list your credibility, and explain listener value." },
  { id: 97, category: "Personal Brand", title: "Content Pillars", prompt: "Define 5 content pillars for my personal brand around [YOUR NICHE]. For each pillar: theme, content types, posting frequency, and 3 example post ideas." },
  { id: 98, category: "Personal Brand", title: "Viral Thread Formula", prompt: "Write a viral Twitter/X thread about [TOPIC] in my niche. Start with a bold claim. Use numbered points. End with a call to follow. 10 tweets minimum." },
  { id: 99, category: "Personal Brand", title: "Comment Strategy", prompt: "Write 10 high-value comments I can leave on [INFLUENCER TYPE]'s posts about [TOPIC]. Each comment adds value, shows expertise, and makes people click my profile." },
  { id: 100, category: "Personal Brand", title: "Collaboration Proposal", prompt: "Write a collaboration proposal for [PROJECT TYPE] between my brand and [PARTNER TYPE]. Include vision, roles, revenue split model, and timeline. Professional yet exciting." },
  { id: 101, category: "Personal Brand", title: "Crisis Response", prompt: "Help me respond to [NEGATIVE SITUATION/CRITICISM] publicly on [PLATFORM]. Be: accountable, not defensive, show what I've learned, and rebuild trust. Genuine tone." },
  { id: 102, category: "Personal Brand", title: "Lead Magnet Ideas", prompt: "Generate 10 lead magnet ideas for [YOUR NICHE] audience. Mix: checklists, templates, mini-courses, swipe files. For each: title, format, and why it converts." },
  { id: 103, category: "Personal Brand", title: "YouTube Description", prompt: "Write a YouTube video description for a video about [TOPIC]. Include: hook, what viewers will learn, timestamps, links, and SEO keywords naturally." },
  { id: 104, category: "Personal Brand", title: "Guest Blog Pitch", prompt: "Write a guest blog post pitch to [WEBSITE/PUBLICATION] about [TOPIC]. Show familiarity with their audience, propose 3 title options, include your credentials." },
  { id: 105, category: "Personal Brand", title: "Community Post", prompt: "Write a Facebook/Discord community post introducing [TOPIC] that sparks discussion. Ask an engaging question at the end. Position yourself as a helpful expert." },

  // ═══════════════════════════════════════
  // YOUTUBE & LONG FORM (106-110)
  // ═══════════════════════════════════════
  { id: 106, category: "YouTube & Long Form", title: "Viral Title Generator", prompt: "Write 15 YouTube video title options for a video about [TOPIC]. Mix formulas: numbers, questions, curiosity gaps, 'How I...', and 'Why...' structures. Each must be under 70 characters and optimized for clicks." },
  { id: 107, category: "YouTube & Long Form", title: "Video SEO Description", prompt: "Write a YouTube video description for [VIDEO TITLE/TOPIC]. Include: a strong first 2 lines for the fold, key timestamps, 3 relevant keywords used naturally, links section, and subscribe CTA. Under 500 words." },
  { id: 108, category: "YouTube & Long Form", title: "Faceless Script", prompt: "Write a faceless YouTube/TikTok script for [NICHE TOPIC] that requires no face on camera. Include: voiceover text, B-roll directions, text overlay cues, and background music mood. 3-5 minutes." },
  { id: 109, category: "YouTube & Long Form", title: "Long-Form Hook Sequence", prompt: "Write the first 60 seconds of a YouTube video about [TOPIC]. Include: pattern interrupt, curiosity hook, credibility line, and preview of what's coming. Make it impossible to click away." },
  { id: 110, category: "YouTube & Long Form", title: "End Screen CTA Script", prompt: "Write 5 different YouTube end screen CTA scripts for a channel about [NICHE]. Each must encourage subscribe, watch next, and engagement — under 20 seconds each." },

  // ═══════════════════════════════════════
  // AI TOOLS & PRODUCTIVITY (111-115)
  // ═══════════════════════════════════════
  { id: 111, category: "AI Tools & Productivity", title: "Custom System Prompt", prompt: "Create a custom ChatGPT/Claude system prompt that makes it act as a specialist in [YOUR NICHE]. Include: role definition, tone, what to always do, what to never do, and output format." },
  { id: 112, category: "AI Tools & Productivity", title: "Batch Content Factory", prompt: "I have 1 core idea about [TOPIC]. Repurpose it into: 1 TikTok script, 1 Twitter thread, 1 LinkedIn post, 1 newsletter section, and 3 Instagram captions. Keep the core message, adapt the format." },
  { id: 113, category: "AI Tools & Productivity", title: "AI Workflow Builder", prompt: "Design an AI-powered content workflow for a [TYPE] creator posting [FREQUENCY] times per week. Map out: which tasks to AI-automate, which to keep human, tools needed, and time saved per week." },
  { id: 114, category: "AI Tools & Productivity", title: "Competitor Gap Analyzer", prompt: "I create content about [NICHE]. My top 3 competitors are [LIST THEM]. Analyze content gaps they're missing. Find 10 content ideas no one in my niche is doing well. Back each idea with WHY it could win." },
  { id: 115, category: "AI Tools & Productivity", title: "Content Repurpose Chain", prompt: "Take this long-form content: [PASTE YOUR CONTENT]. Create: 5 short-form clips (with timestamps), 3 carousels, 10 quote graphics, 1 newsletter edition, and 20 micro-captions. All from one source." },

  // ═══════════════════════════════════════
  // AFFILIATE & SIDE HUSTLE (116-120)
  // ═══════════════════════════════════════
  { id: 116, category: "Affiliate & Side Hustle", title: "Affiliate Review Script", prompt: "Write an honest affiliate product review video script for [PRODUCT NAME]. Include: what it is, who it's for, real pros and cons, who should NOT buy it, and your affiliate CTA. Authentic, not salesy." },
  { id: 117, category: "Affiliate & Side Hustle", title: "Pinterest SEO Pins", prompt: "Write 10 Pinterest pin titles and descriptions for [TOPIC/NICHE]. Each pin must include target keywords naturally, a curiosity hook, and a CTA. Optimized for Pinterest search, not just aesthetics." },
  { id: 118, category: "Affiliate & Side Hustle", title: "Digital Product Sales Page", prompt: "Write a complete mini sales page for a [DIGITAL PRODUCT TYPE] priced at [PRICE]. Include: headline, 3 bullet benefits, who it's for, what's included, testimonial placeholder, and buy button copy. Mobile-first." },
  { id: 119, category: "Affiliate & Side Hustle", title: "Black Friday Campaign", prompt: "Write a complete Black Friday promotional campaign for [PRODUCT] at [DISCOUNT]% off. Include: teaser email, announcement post, SMS text, 3 social media posts, and a final-hour urgency email." },
  { id: 120, category: "Affiliate & Side Hustle", title: "Newsletter Monetization", prompt: "I have a newsletter about [TOPIC] with [SUBSCRIBER COUNT] subscribers. Create 5 monetization strategies specifically for this audience. For each: implementation steps, realistic earning estimate, and first action to take this week." },
];

export const CATEGORIES = [...new Set(PROMPTS.map(p => p.category))];
export const TOTAL = PROMPTS.length;
