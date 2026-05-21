import Groq from "groq-sdk";

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return _groq;
}

export async function generateProposal(input: {
  skills: string;
  projectDesc: string;
  yourName: string;
  clientName: string;
  tone: "professional" | "friendly" | "creative" | "confident" | "urgent";
  platform: "upwork" | "fiverr" | "email" | "linkedin";
  length: "short" | "medium" | "long";
  language?: string;
  mode?: "proposal" | "cover-letter";
}): Promise<{ proposal: string; score: number | null }> {
  const toneGuide = {
    professional: "formal, confident, and business-focused",
    friendly: "warm, conversational, and personable",
    creative: "enthusiastic, innovative, and expressive",
    confident: "bold, direct, and results-focused — lead with your strongest value proposition immediately",
    urgent: "creates a sense of urgency and opportunity — emphasize fast delivery, limited availability, and quick wins for the client",
  }[input.tone];

  const isCoverLetter = input.mode === "cover-letter";

  const platformGuide = isCoverLetter
    ? "This is a job application cover letter. Follow standard cover letter format: opening paragraph (why you're excited), middle paragraph (your relevant experience and achievements), closing paragraph (call to action). Address the hiring manager or company professionally."
    : {
        upwork: "This is an Upwork proposal. Start with the client's name, show you read their post carefully, keep it conversational and direct.",
        fiverr: "This is a Fiverr offer message. Be brief, highlight what you deliver and how fast, make it easy to say yes.",
        email: "This is a cold email proposal. Open with a strong subject-line style hook, be professional, include a clear call to action.",
        linkedin: "This is a LinkedIn InMail message. Keep it short (3-4 paragraphs max), focus on mutual value and a soft ask to connect.",
      }[input.platform];

  const wordLimit = { short: 150, medium: 300, long: 500 }[input.length];
  const langInstruction = input.language && input.language !== "English"
    ? `IMPORTANT: Write the entire ${isCoverLetter ? "cover letter" : "proposal"} in ${input.language}. Do not use English.`
    : "";

  const userPrompt = isCoverLetter
    ? `Write a job application cover letter:
- Applicant name: ${input.yourName}
- Company / Hiring Manager: ${input.clientName}
- My skills and experience: ${input.skills}
- Job description / requirements: ${input.projectDesc}`
    : `Write a freelance proposal:
- My name: ${input.yourName}
- Client name: ${input.clientName}
- My skills: ${input.skills}
- Project description: ${input.projectDesc}`;

  const chat = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert ${isCoverLetter ? "cover letter" : "freelance proposal"} writer. Write compelling, personalized content that wins opportunities.
Tone: ${toneGuide}.
Context: ${platformGuide}
Length: Keep it under ${wordLimit} words.
Do NOT use placeholders like [X] — fill everything in with the provided details.
${langInstruction}
After writing, on a new line write EXACTLY this (always in English): SCORE:[number 1-10]
Rate the strength based on: personalization, clarity, relevance to the job.`,
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1100,
  });

  const raw = chat.choices[0]?.message?.content ?? "";

  const scoreMatch = raw.match(/SCORE:(\d+)/i);
  const score = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : null;
  const proposal = raw.replace(/\n?SCORE:\d+\s*$/i, "").trim();

  return { proposal, score };
}

export async function generateFollowUp(input: {
  originalProposal: string;
  clientName: string;
  yourName: string;
  daysSince: number;
}): Promise<string> {
  const chat = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a follow-up message writer for freelancers. Write a short, polite follow-up message (3-5 sentences max) that does NOT sound desperate or pushy. Sound natural, warm, and confident. Reference the original proposal briefly. End with a soft, easy call-to-action.`,
      },
      {
        role: "user",
        content: `Write a follow-up message:
- From: ${input.yourName}
- To: ${input.clientName}
- Days since proposal sent: ${input.daysSince}
- Original proposal summary: ${input.originalProposal.slice(0, 400)}`,
      },
    ],
    temperature: 0.75,
    max_tokens: 350,
  });
  return chat.choices[0]?.message?.content?.trim() ?? "";
}

export async function rewriteProposal(input: {
  oldProposal: string;
  feedback?: string;
}): Promise<{ improved: string; tip: string }> {
  const chat = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert proposal coach. Rewrite the given proposal to be significantly stronger:
- More personalized and specific
- Confident and direct — no fluff
- Clear value proposition up front
- Strong, specific call to action at the end
- Remove any generic filler phrases

After the improved proposal, on a new line write EXACTLY: TIP:[one specific key improvement you made, in one sentence]`,
      },
      {
        role: "user",
        content: `Rewrite this proposal to be much stronger:

${input.oldProposal}${input.feedback ? `\n\nSpecifically focus on: ${input.feedback}` : ""}`,
      },
    ],
    temperature: 0.75,
    max_tokens: 1200,
  });

  const raw = chat.choices[0]?.message?.content?.trim() ?? "";
  const tipIdx = raw.lastIndexOf("\nTIP:");
  const tip = tipIdx >= 0 ? raw.slice(tipIdx + 5).trim() : "Made it more direct and client-focused.";
  const improved = tipIdx >= 0 ? raw.slice(0, tipIdx).trim() : raw.trim();

  return { improved, tip };
}
