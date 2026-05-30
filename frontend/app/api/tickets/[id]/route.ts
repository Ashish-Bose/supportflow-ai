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

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "CLOSED",
    ];

    if (
      typeof body.status !== "string" ||
      !allowedStatuses.includes(body.status)
    ) {
      return NextResponse.json(
        {
          error:
            "Valid status is required",
        },
        {
          status: 400,
        }
      );
    }

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
      await prisma.$transaction(
        async (tx) => {
          const ticket =
            await tx.ticket.update({
              where: {
                id,
              },
              data: {
                status: body.status,
              },
            });

          if (
            existingTicket.status !==
            body.status
          ) {
            await tx.ticketHistory.create({
              data: {
                ticketId: id,
                oldStatus:
                  existingTicket.status,
                newStatus:
                  body.status,
              },
            });
          }

          return ticket;
        }
      );

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
