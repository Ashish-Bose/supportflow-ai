import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updatedTicket =
      await prisma.ticket.update({
        where: {
          id,
        },
        data: {
          status: body.status,
        },
      });

    return NextResponse.json(
      updatedTicket
    );
  } catch (error) {
    console.error(
      "Update error:",
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

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    await prisma.ticket.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete ticket",
      },
      {
        status: 500,
      }
    );
  }
}