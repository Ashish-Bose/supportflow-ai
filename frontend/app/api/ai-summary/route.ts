import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ollama from "ollama";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

function fallbackAnalysis(issue: string) {
  const lowerIssue = issue.toLowerCase();

  const isHighPriority =
    /\b(urgent|critical|down|outage|failed|failure|broken|cannot|can't|unable|payment|security|breach)\b/.test(
      lowerIssue
    );

  const isLowPriority =
    /\b(question|how do i|how to|feature request|suggestion|minor)\b/.test(
      lowerIssue
    );

  const isNegative =
    /\b(angry|frustrated|bad|terrible|unhappy|disappointed|not working|broken)\b/.test(
      lowerIssue
    );

  const priority = isHighPriority
    ? "HIGH"
    : isLowPriority
    ? "LOW"
    : "MEDIUM";

  const sentiment = isNegative
    ? "Negative"
    : "Neutral";

  const category =
    /\b(invoice|billing|payment|refund|charge|subscription|plan)\b/.test(
      lowerIssue
    )
      ? "BILLING"
      : /\b(login|password|sign in|signin|account locked|reset)\b/.test(
          lowerIssue
        )
      ? "LOGIN_ISSUE"
      : /\b(access|permission|role|invite|admin|authorized)\b/.test(
          lowerIssue
        )
      ? "ACCESS"
      : /\b(error|bug|crash|broken|not working|failed|failure)\b/.test(
          lowerIssue
        )
      ? "TECHNICAL"
      : "GENERAL";

  return {
    summary:
      issue.length > 160
        ? `${issue.slice(0, 157)}...`
        : issue,
    sentiment,
    priority,
    category,
    reply:
      "Thanks for reaching out. We have received your request and our support team will review it shortly. We will follow up with the next steps as soon as possible.",
    source: "rules-fallback",
  };
}

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
  "category": "BILLING | LOGIN_ISSUE | ACCESS | TECHNICAL | GENERAL",
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
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          fallbackAnalysis(issue)
        );
      }

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
        category:
          analysis.category || "GENERAL",
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
          category:
            analysis.category || "GENERAL",
          reply: analysis.reply,
          source: "ollama",
        });
      } catch (ollamaError) {
        console.error(
          "Ollama Failed - Using fallback analysis",
          ollamaError
        );

        return NextResponse.json(
          fallbackAnalysis(issue)
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
