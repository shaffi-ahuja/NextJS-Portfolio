import { NextRequest, NextResponse } from "next/server";

// Supported AI assist actions
type AssistAction =
  | "generate_summary"
  | "improve_bullet"
  | "improve_description";

interface AssistRequest {
  action: AssistAction;

  // For generate_summary
  workExperiences?: Array<{
    company: string;
    title: string;
    description: string;
    isCurrentJob?: boolean;
  }>;
  skills?: string[];

  // For improve_bullet / improve_description
  text?: string;
  context?: string;
}

const SYSTEM_PROMPT = `You are an expert resume and portfolio writer specialising in tech roles.
You write concise, impactful, ATS-friendly content.
- Use active voice and strong action verbs
- Lead with impact and metrics where possible
- Keep language professional but natural
- Never add fictional information — only rewrite what is given
- Respond with ONLY the requested content, no preamble or explanation`;

const ACTION_PROMPTS: Record<AssistAction, (req: AssistRequest) => string> = {
  generate_summary: (r) => {
    const workLines = (r.workExperiences ?? [])
      .map(
        (w) =>
          `- ${w.title} at ${w.company}${
            w.isCurrentJob ? " (current)" : ""
          }: ${w.description.split("\n")[0]}`,
      )
      .join("\n");

    const skillsList = (r.skills ?? []).join(", ");

    return `Write a 2-sentence professional summary for a tech professional with the following experience and skills.
Be specific to their actual background. Do not add anything not mentioned.

Work experience:
${workLines}

Key skills: ${skillsList}

Write only the summary paragraph. No bullet points, no heading.`;
  },

  improve_bullet: (r) => {
    return `Rewrite this resume bullet point to be more impactful.
Add quantification or specificity if the original implies it. Keep it to one sentence.
${r.context ? `Context: ${r.context}` : ""}

Original: ${r.text}

Improved bullet point only:`;
  },

  improve_description: (r) => {
    return `Rewrite this work/project description to be more professional and impactful.
Keep all facts. Improve clarity and impact. Keep roughly the same length.
${r.context ? `Context: ${r.context}` : ""}

Original:
${r.text}

Improved version only:`;
  },
};

export async function POST(req: NextRequest) {
  let body: AssistRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.action || !ACTION_PROMPTS[body.action]) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY" },
      { status: 500 },
    );
  }

  const userPrompt = ACTION_PROMPTS[body.action](body);

  // Combine system + user prompt (Gemini requirement)
  const finalPrompt = `${SYSTEM_PROMPT}

Task:
${userPrompt}

Output strictly:
- No explanation
- No headings
- Only final content`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: finalPrompt }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[ai/assist]", err);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 },
      );
    }

    const data = await response.json();

    const result =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("")
        .trim() || "";

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[ai/assist]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
