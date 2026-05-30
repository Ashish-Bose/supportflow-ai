"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Ticket = {
  id: string;
  name: string;
  email: string;
  priority: string;
  issue: string;
  status: string;
  aiStatus?: string;

  aiSummary?: string;
  sentiment?: string;
  aiReply?: string;
  aiSource?: string;
  category?: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;

  createdAt: string;
};

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [lastRefresh, setLastRefresh] =
  useState<Date | null>(null);

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

  useEffect(() => {
  fetchTickets();

  const interval = setInterval(() => {
    fetchTickets();
    setLastRefresh(new Date());
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;
  const highPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "HIGH"
  ).length;

  const mediumPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "MEDIUM"
  ).length;

  const lowPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "LOW"
  ).length;

  const negativeSentimentTickets = tickets.filter(
    (ticket) =>
      ticket.sentiment?.toLowerCase() ===
      "negative"
  ).length;
  const pendingAI = tickets.filter(
  (ticket) =>
    ticket.aiStatus === "PENDING"
).length;

const completedAI = tickets.filter(
  (ticket) =>
    ticket.aiStatus === "COMPLETED"
).length;

const failedAI = tickets.filter(
  (ticket) =>
    ticket.aiStatus === "FAILED"
).length;

const ticketsWithFirstResponse =
  tickets.filter(
    (ticket) => ticket.firstResponseAt
  );

const ticketsWithResolution =
  tickets.filter(
    (ticket) => ticket.resolvedAt
  );

const avgResponseMinutes =
  ticketsWithFirstResponse.length === 0
    ? 0
    : Math.round(
        ticketsWithFirstResponse.reduce(
          (total, ticket) =>
            total +
            (new Date(
              ticket.firstResponseAt as string
            ).getTime() -
              new Date(
                ticket.createdAt
              ).getTime()),
          0
        ) /
          ticketsWithFirstResponse.length /
          60000
      );

const avgResolutionHours =
  ticketsWithResolution.length === 0
    ? 0
    : Math.round(
        ticketsWithResolution.reduce(
          (total, ticket) =>
            total +
            (new Date(
              ticket.resolvedAt as string
            ).getTime() -
              new Date(
                ticket.createdAt
              ).getTime()),
          0
        ) /
          ticketsWithResolution.length /
          3600000
      );

  const statusChartData = [
    {
      name: "Open",
      tickets: openTickets,
    },
    {
      name: "In Progress",
      tickets: inProgressTickets,
    },
    {
      name: "Closed",
      tickets: closedTickets,
    },
  ];

  const priorityChartData = [
    {
      name: "High",
      tickets: highPriorityTickets,
    },
    {
      name: "Medium",
      tickets: mediumPriorityTickets,
    },
    {
      name: "Low",
      tickets: lowPriorityTickets,
    },
  ];

  const recentTickets = [...tickets]
  
  .filter(
    (ticket) =>
      ticket.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ticket.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ticket.issue
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 5);

  const priorityCounts = {
    HIGH: highPriorityTickets,
    MEDIUM: mediumPriorityTickets,
    LOW: lowPriorityTickets,
  };

  const sentimentCounts = tickets.reduce(
    (acc, ticket) => {
      const sentiment =
        ticket.sentiment || "Unknown";

      acc[sentiment] =
        (acc[sentiment] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const aiSourceCounts = tickets.reduce(
    (acc, ticket) => {
      const source =
        ticket.aiSource || "Unknown";

      acc[source] =
        (acc[source] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommonPriority =
    Object.entries(priorityCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  const mostCommonSentiment =
    Object.entries(sentimentCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  const primaryAIProvider =
    Object.entries(aiSourceCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  const categoryCounts = tickets.reduce(
    (acc, ticket) => {
      const category =
        ticket.category || "GENERAL";

      acc[category] =
        (acc[category] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const topCategory =
    Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  function getPriorityBadge(
    priority: string
  ) {
    switch (priority) {
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

  function getSentimentBadge(
    sentiment?: string
  ) {
    switch (
      sentiment?.toLowerCase()
    ) {
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
    <div className="dark:text-white">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          AI-powered support
          intelligence dashboard
        </p>
        <p className="text-sm text-gray-400 mt-1">
  Last Refresh:
  {lastRefresh
    ? ` ${lastRefresh.toLocaleTimeString()}`
    : " Loading..."}
</p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Total Tickets
          </p>

          <p className="text-4xl font-bold mt-2">
            {totalTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Open
          </p>

          <p className="text-4xl font-bold text-yellow-500 mt-2">
            {openTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <p className="text-4xl font-bold text-blue-500 mt-2">
            {inProgressTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Closed
          </p>

          <p className="text-4xl font-bold text-green-500 mt-2">
            {closedTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Avg First Response
          </p>

          <p className="text-4xl font-bold text-blue-500 mt-2">
            {avgResponseMinutes}m
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Avg Resolution
          </p>

          <p className="text-4xl font-bold text-green-500 mt-2">
            {avgResolutionHours}h
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Top Category
          </p>

          <p className="text-2xl font-bold mt-3">
            {topCategory.replace("_", " ")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            High Priority
          </p>

          <p className="text-4xl font-bold text-red-500 mt-2">
            {highPriorityTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Medium Priority
          </p>

          <p className="text-4xl font-bold text-yellow-500 mt-2">
            {mediumPriorityTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Low Priority
          </p>

          <p className="text-4xl font-bold text-green-500 mt-2">
            {lowPriorityTickets}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-500">
            Negative Sentiment
          </p>

          <p className="text-4xl font-bold text-red-500 mt-2">
            {negativeSentimentTickets}
          </p>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <p className="text-sm text-gray-500">
    AI Pending
  </p>

  <p className="text-4xl font-bold text-yellow-500 mt-2">
    {pendingAI}
  </p>
</div>

<div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <p className="text-sm text-gray-500">
    AI Completed
  </p>

  <p className="text-4xl font-bold text-green-500 mt-2">
    {completedAI}
  </p>
</div>

<div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <p className="text-sm text-gray-500">
    AI Failed
  </p>
  

  <p className="text-4xl font-bold text-red-500 mt-2">
    {failedAI}
  </p>
</div>
        </div>

      </div>
      

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Status Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={statusChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Priority Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={priorityChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* AI INSIGHTS */}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-10">

        <h2 className="text-2xl font-bold mb-6">
          AI Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-gray-500 text-sm">
              Most Common Priority
            </p>

            <p className="text-2xl font-bold mt-2">
              {mostCommonPriority}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Most Common Sentiment
            </p>

            <p className="text-2xl font-bold mt-2">
              {mostCommonSentiment}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Primary AI Provider
            </p>

            <p className="text-2xl font-bold mt-2">
              {primaryAIProvider}
            </p>
          </div>

        </div>

      </div>

      {/* RECENT TICKETS */}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

        <div className="flex items-center justify-between mb-6">
          <div className="mb-6">
  <input
    type="text"
    placeholder="Search recent tickets..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    className="w-full border dark:border-gray-700 rounded-xl px-4 py-2 bg-white dark:bg-gray-800"
  />
</div>
  <h2 className="text-2xl font-bold">
    Recent Tickets
  </h2>

  <Link
    href="/tickets"
    className="text-sm font-medium text-blue-600 hover:underline"
  >
    View All →
  </Link>
</div>

        {recentTickets.length === 0 ? (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">
      🎫
    </div>

    <h3 className="text-xl font-semibold mb-2">
      No Tickets Found
    </h3>

    <p className="text-gray-500 dark:text-gray-400">
      New support tickets will appear here automatically.
    </p>
  </div>
) : (
          <div className="space-y-4">

            {recentTickets.map(
              (ticket) => (
                <div
                  key={ticket.id}
                  className="border dark:border-gray-800 rounded-xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>
  <h3 className="font-bold text-lg">
    {ticket.name}
  </h3>

  <p className="text-sm text-gray-500">
    {ticket.email}
  </p>

  <p className="text-xs text-gray-400 mt-1">
    {new Date(ticket.createdAt).toLocaleDateString()}
  </p>
</div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>

                      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800">
                        {ticket.status}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getSentimentBadge(
                          ticket.sentiment
                        )}`}
                      >
                        {ticket.sentiment ||
                          "Unknown"}
                      </span>

                      <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                        {ticket.aiSource ||
                          "AI"}
                      </span>
                      <span
  className={`px-3 py-1 rounded-full text-sm ${
    ticket.aiStatus === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : ticket.aiStatus === "FAILED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {ticket.aiStatus || "PENDING"}
</span>

                    </div>

                  </div>

                  <div className="mt-4">
                    <p className="font-semibold mb-1">
                      AI Summary
                    </p>

                    <p className="text-gray-600 dark:text-gray-300">
                      {ticket.aiStatus === "PENDING"
  ? "AI analysis in progress..."
  : ticket.aiSummary ||
    "No AI summary available"}
                    </p>
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}
