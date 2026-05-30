"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

type Ticket = {
  id: string;
  name: string;
  email: string;
  issue: string;
  priority: string;
  status: string;
  aiStatus?: string;
  aiSummary?: string;
  aiReply?: string;
  sentiment?: string;
  aiSource?: string;
  createdAt: string;
};

export default function CustomerDetailPage() {
  const params = useParams();

  const email = decodeURIComponent(
    params.email as string
  );

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/tickets"
      );

      const data = await response.json();

      const customerTickets =
        data.filter(
          (ticket: Ticket) =>
            ticket.email === email
        );

      setTickets(
  customerTickets.sort(
    (a: Ticket, b: Ticket) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Customer...
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20">
        Customer not found
      </div>
    );
  }

  const customer = tickets[0];

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (t) => t.status === "OPEN"
  ).length;

  const closedTickets = tickets.filter(
    (t) => t.status === "CLOSED"
  ).length;

  const negativeTickets =
  tickets.filter(
    (t) =>
      t.sentiment === "Negative"
  ).length;

const healthScore =
  Math.max(
    0,
    100 -
      openTickets * 10 -
      negativeTickets * 15
  );

const healthStatus =
  healthScore >= 80
    ? "Healthy"
    : healthScore >= 50
    ? "Warning"
    : "At Risk";

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-bold">
          {customer.name}
        </h1>

        <p className="text-gray-500 mt-2">
          {customer.email}
        </p>
      </div>

      {/* OVERVIEW */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Total Tickets
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalTickets}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Open Tickets
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            {openTickets}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <p className="text-sm text-gray-500">
    Closed Tickets
  </p>

  <h2 className="text-4xl font-bold text-green-500 mt-2">
    {closedTickets}
  </h2>
</div>

<div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <p className="text-sm text-gray-500">
    Customer Health
  </p>

  <h2 className="text-3xl font-bold mt-2">
    {healthScore}%
  </h2>

  <p className="mt-2 text-sm">
    {healthStatus}
  </p>
</div>

</div>

      {/* TICKET HISTORY */}

      <div className="space-y-6">

        {tickets.map((ticket) => (

          <div
            key={ticket.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
          >

            <div className="flex flex-wrap gap-2 mb-4">

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                {ticket.status}
              </span>

              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                {ticket.priority}
              </span>

              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                {ticket.sentiment || "Unknown"}
              </span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {ticket.aiStatus || "Pending"}
              </span>

            </div>

            <h3 className="font-bold mb-2">
              Issue
            </h3>

            <p className="mb-4">
              {ticket.issue}
            </p>

            <h3 className="font-bold mb-2">
              AI Summary
            </h3>

            <p className="mb-4">
              {ticket.aiSummary ||
                "AI analysis pending"}
            </p>

            <h3 className="font-bold mb-2">
              AI Reply
            </h3>

            <p className="mb-4">
              {ticket.aiReply ||
                "AI reply pending"}
            </p>

            <div className="text-sm text-gray-500">
              {new Date(
                ticket.createdAt
              ).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
