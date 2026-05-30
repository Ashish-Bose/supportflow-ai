import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ollama from "ollama";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

async function ollamaAnalysis(issue: string) {
  const prompt = `
You are an expert customer support analyst.

Analyze the following customer issue and return ONLY valid JSON.

Customer Issue:
"${issue}"

Return exactly:

{
  "summary": "short summary",
  "sentiment": "Positive | Neutral | Negative",
  "priority": "LOW | MEDIUM | HIGH",
  "reply": "professional customer support response"
}

Rules:
- Return JSON only.
- No markdown.
- No code blocks.
- No explanations.
`;

  const response = await ollama.chat({
    model: "mistral",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const issue = body.issue || "";

    if (!issue.trim()) {
      return NextResponse.json(
        {
          error: "Issue description is required",
        },
        {
          status: 400,
        }
      );
    }

    // TRY GEMINI FIRST
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const prompt = `
You are an expert customer support analyst.

Analyze the following customer issue and return ONLY valid JSON.

Customer Issue:
"${issue}"

Return exactly:

{
  "summary": "short summary",
  "sentiment": "Positive | Neutral | Negative",
  "priority": "LOW | MEDIUM | HIGH",
  "reply": "professional customer support response"
}

Rules:
- Return JSON only.
- No markdown.
- No code blocks.
- No explanations.
`;

      const result = await model.generateContent(prompt);

      const response = await result.response;

      const text = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const analysis = JSON.parse(text);

      return NextResponse.json({
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        priority: analysis.priority,
        reply: analysis.reply,
        source: "gemini",
      });
    } catch (geminiError) {
      console.error(
        "Gemini Failed - Switching to Ollama",
        geminiError
      );

      try {
        const analysis =
          await ollamaAnalysis(issue);

        return NextResponse.json({
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          priority: analysis.priority,
          reply: analysis.reply,
          source: "ollama",
        });
      } catch (ollamaError) {
        console.error(
          "Ollama Failed",
          ollamaError
        );

        return NextResponse.json(
          {
            error:
              "Both Gemini and Ollama failed",
          },
          {
            status: 500,
          }
        );
      }
    }
  } catch (error) {
    console.error(
      "AI Analysis Error",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to analyze ticket",
      },
      {
        status: 500,
      }
    );
  }
}