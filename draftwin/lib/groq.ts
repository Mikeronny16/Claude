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
  tone: "professional" | "friendly" | "creative";
  platform: "upwork" | "fiverr" | "email" | "linkedin";
  length: "short" | "medium" | "long";
}): Promise<string> {
  const toneGuide = {
    professional: "formal, confident, and business-focused",
    friendly: "warm, conversational, and personable",
    creative: "enthusiastic, innovative, and expressive",
  }[input.tone];

  const platformGuide = {
    upwork: "This is an Upwork proposal. Start with the client's name, show you read their post carefully, keep it conversational and direct.",
    fiverr: "This is a Fiverr offer message. Be brief, highlight what you deliver and how fast, make it easy to say yes.",
    email: "This is a cold email proposal. Open with a strong subject-line style hook, be professional, include a clear call to action.",
    linkedin: "This is a LinkedIn InMail message. Keep it short (3-4 paragraphs max), focus on mutual value and a soft ask to connect.",
  }[input.platform];

  const wordLimit = { short: 150, medium: 300, long: 500 }[input.length];

  const chat = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert freelance proposal writer. Write compelling, personalized proposals that win clients.
Tone: ${toneGuide}.
Platform context: ${platformGuide}
Length: Keep it under ${wordLimit} words.
Format: Strong opening, understanding of the project, relevant experience, proposed approach, confident closing.
Use the client's name naturally. Do NOT use placeholders like [X] — fill everything in with the provided details.`,
      },
      {
        role: "user",
        content: `Write a freelance proposal:
- My name: ${input.yourName}
- Client name: ${input.clientName}
- My skills: ${input.skills}
- Project description: ${input.projectDesc}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  return chat.choices[0]?.message?.content ?? "";
}
