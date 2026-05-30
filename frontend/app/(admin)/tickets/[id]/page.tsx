"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

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
  category?: string;
  createdAt: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;

  history?: {
    id: string;
    oldStatus: string;
    newStatus: string;
    createdAt: string;
  }[];

  comments?: {
    id: string;
    author: string;
    body: string;
    createdAt: string;
  }[];
};

type CurrentUser = {
  role: "admin" | "viewer";
};

export default function TicketDetailPage() {
  const params = useParams();

  const ticketId =
    params.id as string;

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [loading, setLoading] =
    useState(true);
    
    const [selectedStatus, setSelectedStatus] =
  useState("");

  const [saving, setSaving] =
  useState(false);
  const [comment, setComment] =
    useState("");
  const [commentSaving, setCommentSaving] =
    useState(false);
  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const fetchTicket = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/tickets"
      );

      const data = await response.json();

      const foundTicket =
        data.find(
          (t: Ticket) =>
            t.id === ticketId
        );

setTicket(foundTicket);

if (foundTicket) {
  setSelectedStatus(
    foundTicket.status
  );
}    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);
async function handleStatusUpdate() {
  try {
    setSaving(true);

    const response =
      await fetch(
        "/api/tickets",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: ticketId,
            status:
              selectedStatus,
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to update ticket"
      );
    }

    await fetchTicket();

          toast.success(
  "Ticket status updated successfully"
);
  } catch (error) {
    console.error(error);

    toast.error(
  "Failed to update ticket"
);
  } finally {
    setSaving(false);
  }
}
  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    fetch("/api/me")
      .then((response) =>
        response.ok
          ? response.json()
          : null
      )
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

async function handleAddComment() {
  if (!comment.trim()) {
    return;
  }

  try {
    setCommentSaving(true);

    const response =
      await fetch(
        `/api/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            body: comment,
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to add comment"
      );
    }

    setComment("");
    await fetchTicket();
    toast.success("Comment added");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add comment");
  } finally {
    setCommentSaving(false);
  }
}

function formatElapsed(
  start: string,
  end?: string | null
) {
  if (!end) {
    return "Not yet";
  }

  const minutes = Math.max(
    0,
    Math.round(
      (new Date(end).getTime() -
        new Date(start).getTime()) /
        60000
    )
  );

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.round(minutes / 60)}h`;
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        Ticket not found
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Ticket Details
        </h1>

        <p className="text-gray-500 mt-2">
          Ticket ID: {ticket.id}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          Customer Information
        </h2>

        <p>
          <strong>Name:</strong>{" "}
          {ticket.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {ticket.email}
        </p>

      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          Ticket Information
        </h2>

        <p>
          <strong>Priority:</strong>{" "}
          {ticket.priority}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {ticket.status}
        </p>

        <p>
          <strong>Sentiment:</strong>{" "}
          {ticket.sentiment ||
            "Unknown"}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {(ticket.category ||
            "GENERAL"
          ).replace("_", " ")}
        </p>

        <p>
          <strong>AI Status:</strong>{" "}
          {ticket.aiStatus ||
            "Pending"}
        </p>

        <p>
          <strong>AI Provider:</strong>{" "}
          {ticket.aiSource ||
            "Unknown"}
        </p>

      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          SLA Tracking
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">
              First Response Time
            </p>
            <p className="text-2xl font-bold">
              {formatElapsed(
                ticket.createdAt,
                ticket.firstResponseAt
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Resolution Time
            </p>
            <p className="text-2xl font-bold">
              {formatElapsed(
                ticket.createdAt,
                ticket.resolvedAt
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Created
            </p>
            <p className="text-base font-semibold">
              {new Date(
                ticket.createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
<div className="mt-6">

  <label className="block text-sm font-medium mb-2">
    Update Status
  </label>

  <select
    value={selectedStatus}
    onChange={(e) =>
      setSelectedStatus(
        e.target.value
      )
    }
    className="border rounded-lg px-3 py-2 dark:bg-gray-800"
  >
    <option value="OPEN">
      OPEN
    </option>

    <option value="IN_PROGRESS">
      IN_PROGRESS
    </option>

    <option value="CLOSED">
      CLOSED
    </option>
  </select>
  <button
  onClick={handleStatusUpdate}
  disabled={
    saving ||
    user?.role === "viewer"
  }
  className="ml-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
>
  {saving
    ? "Saving..."
    : "Save Status"}
</button>

</div>
<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

  <h2 className="text-2xl font-bold mb-4">
    Admin Comments
  </h2>

  {user?.role === "viewer" ? (
    <p className="text-sm text-blue-600 mb-4">
      Demo viewers can read comments but cannot add new ones.
    </p>
  ) : (
    <div className="mb-6">
      <textarea
        value={comment}
        onChange={(event) =>
          setComment(event.target.value)
        }
        rows={4}
        className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700"
        placeholder="Add an internal comment..."
      />
      <button
        type="button"
        onClick={handleAddComment}
        disabled={
          commentSaving ||
          !comment.trim()
        }
        className="mt-3 bg-black disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
      >
        {commentSaving
          ? "Saving..."
          : "Add Comment"}
      </button>
    </div>
  )}

  {ticket.comments &&
  ticket.comments.length > 0 ? (
    <div className="space-y-4">
      {ticket.comments.map((item) => (
        <div
          key={item.id}
          className="border dark:border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="font-semibold">
              {item.author}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">
      No comments yet.
    </p>
  )}
</div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          Customer Issue
        </h2>

        <p>{ticket.issue}</p>

      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          AI Summary
        </h2>

        <p>
          {ticket.aiSummary ||
            "No AI summary available"}
        </p>

      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          Suggested Reply
        </h2>

        <p>
          {ticket.aiReply ||
            "No AI reply available"}
        </p>

      </div>

<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

  <h2 className="text-2xl font-bold mb-4">
    Status History
  </h2>

  {ticket.history &&
  ticket.history.length > 0 ? (

    <div className="space-y-4">

      {ticket.history.map(
        (item) => (
          <div
            key={item.id}
            className="border-l-4 border-blue-500 pl-4"
          >
            <p className="font-medium">
              {item.oldStatus}
              {" → "}
              {item.newStatus}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </p>
          </div>
        )
      )}

    </div>

  ) : (

    <p className="text-gray-500">
      No status changes yet.
    </p>

  )}

</div>

      <div className="text-sm text-gray-500">

        Created:

        {" "}

        {new Date(
          ticket.createdAt
        ).toLocaleString()}

      </div>

    </div>
  );
}
