"use client";

import { useEffect, useMemo, useState } from "react";

type Ticket = {
  id: string;
  name: string;
  email: string;
  priority: string;
  issue: string;
  status: string;
  createdAt: string;
};

type Customer = {
  email: string;
  name: string;
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  lastActivity: string;
  healthScore: string;
};

export default function CustomersPage() {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const customers = useMemo(() => {

    const customerMap: Record<
      string,
      Customer
    > = {};

    tickets.forEach((ticket) => {

      if (!customerMap[ticket.email]) {

        customerMap[ticket.email] = {
  email: ticket.email,
  name: ticket.name,
  totalTickets: 0,
  openTickets: 0,
  closedTickets: 0,
  lastActivity: ticket.createdAt,
  healthScore: "Healthy",
};
      }

      customerMap[ticket.email].totalTickets += 1;

      if (ticket.status === "OPEN") {
        customerMap[ticket.email].openTickets += 1;
      }

      if (ticket.status === "CLOSED") {
        customerMap[ticket.email].closedTickets += 1;
      }

      if (
  customerMap[ticket.email].openTickets >= 5
) {
  customerMap[ticket.email].healthScore =
    "Critical";
} else if (
  customerMap[ticket.email].openTickets >= 3
) {
  customerMap[ticket.email].healthScore =
    "At Risk";
} else {
  customerMap[ticket.email].healthScore =
    "Healthy";
}

      if (
        new Date(ticket.createdAt) >
        new Date(
          customerMap[ticket.email]
            .lastActivity
        )
      ) {

        customerMap[
          ticket.email
        ].lastActivity = ticket.createdAt;

      }

    });

    return Object.values(customerMap);

  }, [tickets]);

  const filteredCustomers = useMemo(() => {

    return customers.filter((customer) => {

      return (
        customer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.email
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    });

  }, [customers, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Customers...
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Customers
        </h1>

        <p className="text-gray-500 mt-2">
          Manage customer activity and support history
        </p>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border p-4 rounded-lg"
        />

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Total Customers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {customers.length}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Total Tickets
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {tickets.length}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 text-sm">
            Active Customers
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-500">
            {
              customers.filter(
                (customer) =>
                  customer.openTickets > 0
              ).length
            }
          </h2>

        </div>

      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Customer
                </th>

                <th className="text-left p-4">
                  Total Tickets
                </th>

                <th className="text-left p-4">
                  Open Tickets
                </th>

                <th className="text-left p-4">
                  Closed Tickets
                </th>

                <th className="text-left p-4">
  Last Activity
</th>

<th className="text-left p-4">
  Health
</th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

  <tr
    key={customer.email}
    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
    onClick={() =>
      window.location.href =
        `/customers/${encodeURIComponent(
          customer.email
        )}`
    }
  >

    {/* CUSTOMER */}
                  <td className="p-4">

                    <div>

                      <p className="font-semibold text-lg">
                        {customer.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {customer.email}
                      </p>

                    </div>

                  </td>

                  {/* TOTAL */}
                  <td className="p-4">

                    <span className="font-semibold">
                      {customer.totalTickets}
                    </span>

                  </td>

                  {/* OPEN */}
                  <td className="p-4">

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {customer.openTickets}
                    </span>

                  </td>

                  {/* CLOSED */}
                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {customer.closedTickets}
                    </span>

                  </td>

                  {/* LAST ACTIVITY */}
                  <td className="p-4 text-sm text-gray-500">

                    {new Date(
                      customer.lastActivity
                    ).toLocaleString()}

                  </td>

                  <td className="p-4">

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      customer.healthScore === "Critical"
        ? "bg-red-100 text-red-700"
        : customer.healthScore === "At Risk"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {customer.healthScore}
  </span>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
