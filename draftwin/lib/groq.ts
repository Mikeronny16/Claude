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
}): Promise<string> {
  const toneGuide = {
    professional: "formal, confident, and business-focused",
    friendly: "warm, conversational, and personable",
    creative: "enthusiastic, innovative, and expressive",
  }[input.tone];

  const chat = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert freelance proposal writer. Write compelling, personalized proposals that win clients.
Tone: ${toneGuide}.
Format: Start with a strong opening line, then understanding of the project, your relevant experience, proposed approach, and a confident closing.
Use the client's name naturally. Keep it under 350 words. Do NOT use placeholders like [X] — fill everything in.`,
      },
      {
        role: "user",
        content: `Write a freelance proposal with these details:
- My name: ${input.yourName}
- Client name: ${input.clientName}
- My skills: ${input.skills}
- Project description: ${input.projectDesc}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 800,
  });

  return chat.choices[0]?.message?.content ?? "";
}
