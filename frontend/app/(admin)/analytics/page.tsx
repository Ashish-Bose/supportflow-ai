"use client";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Ticket = {
  id: string;
  name: string;
  email: string;
  priority: string;
  issue: string;
  status: string;
  createdAt: string;
};

export default function AnalyticsPage() {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);

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
  }, []);

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  const highPriority = tickets.filter(
    (ticket) => ticket.priority === "HIGH"
  ).length;

  const mediumPriority = tickets.filter(
    (ticket) => ticket.priority === "MEDIUM"
  ).length;

  const lowPriority = tickets.filter(
    (ticket) => ticket.priority === "LOW"
  ).length;

  const statusData = [
    {
      name: "OPEN",
      value: openTickets,
    },
    {
      name: "IN PROGRESS",
      value: inProgressTickets,
    },
    {
      name: "CLOSED",
      value: closedTickets,
    },
  ];

  const priorityData = [
    {
      name: "HIGH",
      tickets: highPriority,
    },
    {
      name: "MEDIUM",
      tickets: mediumPriority,
    },
    {
      name: "LOW",
      tickets: lowPriority,
    },
  ];

  const COLORS = [
    "#eab308",
    "#3b82f6",
    "#22c55e",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white">
        Loading Analytics...
      </div>
    );
  }

  return (
  <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Insights and ticket performance metrics
        </p>

      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Total Tickets
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {tickets.length}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Open Tickets
          </p>

          <h2 className="text-4xl font-bold mt-2 text-yellow-500">
            {openTickets}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            In Progress
          </p>

          <h2 className="text-4xl font-bold mt-2 text-blue-500">
            {inProgressTickets}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Closed Tickets
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-500">
            {closedTickets}
          </h2>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-6">
            Ticket Status Distribution
          </h2>

          <div className="w-full h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={140}
                  label
                >

                  {statusData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-6">
            Priority Breakdown
          </h2>

          <div className="w-full h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={priorityData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="tickets" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ADDITIONAL INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-3">
            High Priority Tickets
          </h2>

          <p className="text-5xl font-bold text-red-500">
            {highPriority}
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-3">
            Medium Priority
          </h2>

          <p className="text-5xl font-bold text-yellow-500">
            {mediumPriority}
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-3">
            Low Priority
          </h2>

          <p className="text-5xl font-bold text-green-500">
            {lowPriority}
          </p>

        </div>

      </div>

    </div>
  );
} 