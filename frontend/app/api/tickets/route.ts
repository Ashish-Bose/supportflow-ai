import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  sendCustomerEmail,
  sendAdminEmail,
} from "@/lib/email";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

async function analyzeTicket(issue: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a customer support AI.

Analyze the following support ticket.

Issue:
"${issue}"

Return ONLY JSON:

{
  "summary": "short summary",
  "sentiment": "Positive | Neutral | Negative",
  "priority": "LOW | MEDIUM | HIGH",
  "reply": "professional support response"
}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const text = response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis =
      JSON.parse(text);

    return {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      priority: analysis.priority,
      reply: analysis.reply,
      source: "gemini",
    };
  } catch (error) {
    console.error(
      "Gemini error:",
      error
    );

    throw error;
  }
}

async function processTicket(
  ticketId: string
) {
  try {
    console.log(
      "PROCESSING TICKET:",
      ticketId
    );

    const ticket =
      await prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

    if (!ticket) {
      return;
    }

    console.log(
      "CALLING GEMINI"
    );

    const aiAnalysis =
      await analyzeTicket(
        ticket.issue
      );

    console.log(
      "GEMINI SUCCESS",
      aiAnalysis
    );

    console.log(
      "UPDATING DATABASE"
    );

    const updatedTicket =
      await prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          priority:
            aiAnalysis.priority,

          aiSummary:
            aiAnalysis.summary,

          sentiment:
            aiAnalysis.sentiment,

          aiReply:
            aiAnalysis.reply,

          aiSource:
            aiAnalysis.source,

          aiStatus:
            "COMPLETED",
        },
      });

    console.log(
      "DATABASE UPDATED"
    );

    console.log(
      "SENDING EMAILS"
    );

    await Promise.allSettled([
      sendCustomerEmail({
        id: updatedTicket.id,
        name: updatedTicket.name,
        email: updatedTicket.email,
        issue:
          updatedTicket.issue,
        priority:
          updatedTicket.priority,
        status:
          updatedTicket.status,
      }),

      sendAdminEmail({
        id: updatedTicket.id,
        name:
          updatedTicket.name,
        email:
          updatedTicket.email,
        issue:
          updatedTicket.issue,
        priority:
          updatedTicket.priority,
        sentiment:
          updatedTicket.sentiment,
        aiSummary:
          updatedTicket.aiSummary,
      }),
    ]);

    console.log(
      "EMAILS COMPLETED"
    );

    console.log(
      `Ticket ${ticketId} processed successfully`
    );
  } catch (error) {
    console.error(
      "BACKGROUND PROCESSING FAILED"
    );

    console.error(error);

    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        aiStatus: "FAILED",
      },
    });
  }
}

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      name,
      email,
      issue,
    } = body;

    const ticket =
      await prisma.ticket.create({
        data: {
          name,
          email,
          issue,

          priority:
            "MEDIUM",

          status:
            "OPEN",

          aiStatus:
            "PENDING",
        },
      });

    console.log(
  "PROCESS TICKET STARTED:",
  ticket.id
);

processTicket(ticket.id);

    return NextResponse.json(
      ticket,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Ticket creation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create ticket",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const tickets =
  await prisma.ticket.findMany({
    include: {
      history: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      createdAt:
        "desc",
    },
  });

    return NextResponse.json(
      tickets
    );
  } catch (error) {
    console.error(
      "Fetch tickets error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch tickets",
      },
      {
        status: 500,
      }
    );
  }
}
export async function PATCH(
  req: Request
) {
  try {
      const body =
  await req.json();

const {
  id,
  status,
} = body;

const existingTicket =
  await prisma.ticket.findUnique({
    where: {
      id,
    },
  });

if (!existingTicket) {
  return NextResponse.json(
    {
      error:
        "Ticket not found",
    },
    {
      status: 404,
    }
  );
}

const updatedTicket =
  await prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

await prisma.ticketHistory.create({
  data: {
    ticketId: id,
    oldStatus:
      existingTicket.status,
    newStatus: status,
  },
});

return NextResponse.json(
  updatedTicket
);
  } catch (error) {
    console.error(
      "Update ticket error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update ticket",
      },
      {
        status: 500,
      }
    );
  }
}