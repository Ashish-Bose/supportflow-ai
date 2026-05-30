import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getUserFromRequest,
  isReadOnlyUser,
} from "@/lib/auth";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    if (isReadOnlyUser(req)) {
      return NextResponse.json(
        {
          error:
            "Demo account has view-only access",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const body = await req.json();

    if (
      typeof body.body !== "string" ||
      !body.body.trim()
    ) {
      return NextResponse.json(
        {
          error: "Comment is required",
        },
        {
          status: 400,
        }
      );
    }

    const user = getUserFromRequest(req);

    const comment =
      await prisma.ticketComment.create({
        data: {
          ticketId: id,
          author:
            user?.name || "Admin",
          body: body.body.trim(),
        },
      });

    return NextResponse.json(
      comment,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create comment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create comment",
      },
      {
        status: 500,
      }
    );
  }
}
