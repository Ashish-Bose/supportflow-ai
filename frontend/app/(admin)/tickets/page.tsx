"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

type Ticket = {
  id: string;
  name: string;
  email: string;
  priority: string;
  issue: string;
  status: string;
  aiStatus?: string;
  createdAt: string;

  aiSummary?: string;
  sentiment?: string;
  aiReply?: string;
  aiSource?: string;
  category?: string;
};

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  async function fetchTickets() {
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    ticketId: string,
    newStatus: string
  ) {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        ticket.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        ticket.issue
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        ticket.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  function getPriorityClasses(priority: string) {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getSentimentClasses(sentiment: string) {
    switch (sentiment?.toLowerCase()) {
      case "negative":
        return "bg-red-100 text-red-700";
      case "positive":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
  return <LoadingSpinner />;
}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Tickets Management
        </h1>

        <p className="text-gray-500 mt-2">
          AI-powered ticket support dashboard
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border p-3 rounded-lg"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">
              IN PROGRESS
            </option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="border p-3 rounded-lg"
          >
            <option value="ALL">
              All Priorities
            </option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">
              MEDIUM
            </option>
            <option value="HIGH">HIGH</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="border p-3 rounded-lg"
          >
            <option value="ALL">
              All Categories
            </option>
            <option value="BILLING">BILLING</option>
            <option value="LOGIN_ISSUE">
              LOGIN ISSUE
            </option>
            <option value="ACCESS">ACCESS</option>
            <option value="TECHNICAL">
              TECHNICAL
            </option>
            <option value="GENERAL">
              GENERAL
            </option>
          </select>

        </div>
      </div>

      <div className="space-y-6">

        {filteredTickets.map((ticket) => (

          <div
  key={ticket.id}
  onClick={() =>
    router.push(
      `/tickets/${ticket.id}`
    )
  }
  className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg transition"
>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {ticket.name}
                </h2>

                <p className="text-gray-500">
                  {ticket.email}
                </p>

                <p className="mt-4">
                  {ticket.issue}
                </p>

              </div>

              <div className="flex flex-wrap gap-2 max-w-md">

  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityClasses(
      ticket.priority
    )}`}
  >
    Priority: {ticket.priority}
  </span>

  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
    Status: {ticket.status.replace("_", " ")}
  </span>

  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${getSentimentClasses(
      ticket.sentiment || ""
    )}`}
  >
    Sentiment: {ticket.sentiment || "Unknown"}
  </span>

  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
    AI: {ticket.aiSource || "AI"}
  </span>

  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
    {(ticket.category || "GENERAL").replace("_", " ")}
  </span>

</div>

            </div>

            <div className="flex flex-wrap gap-3 mt-6">

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateStatus(ticket.id, "OPEN");
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                OPEN
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateStatus(
                    ticket.id,
                    "IN_PROGRESS"
                  );
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                IN PROGRESS
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateStatus(ticket.id, "CLOSED");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                CLOSED
              </button>

            </div>

            <div className="mt-6 bg-gray-50 border rounded-2xl p-5">

              <h3 className="font-bold text-lg mb-2">
                AI Summary
              </h3>

              <p className="mb-6">
                {ticket.aiSummary ||
                  "No AI summary available"}
              </p>

              <h3 className="font-bold text-lg mb-2">
                Suggested Reply
              </h3>

              <div className="bg-white border rounded-xl p-4">
                {ticket.aiReply ||
                  "No AI reply available"}
              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Created:{" "}
              {new Date(
                ticket.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
