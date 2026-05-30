ALTER TABLE "Ticket" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "Ticket" ADD COLUMN "firstResponseAt" TIMESTAMP(3);
ALTER TABLE "Ticket" ADD COLUMN "resolvedAt" TIMESTAMP(3);

CREATE TABLE "TicketComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
