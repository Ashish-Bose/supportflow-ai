"use client";

import { useState } from "react";

export default function TicketForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      setSuccessMessage(
        "Ticket submitted successfully! AI analysis completed automatically."
      );

      setFormData({
        name: "",
        email: "",
        issue: "",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit ticket";

      setErrorMessage(
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        Submit Support Ticket
      </h2>

      <p className="text-gray-500 mb-6">
        Our AI will automatically analyze
        your issue, determine priority,
        assess sentiment, and suggest a
        response.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Issue Description
          </label>

          <textarea
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe your issue in detail..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Submitting & Analyzing..."
            : "Submit Ticket"}
        </button>
      </form>

      {successMessage && (
        <div className="mt-5 p-4 rounded-xl bg-green-100 text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-5 p-4 rounded-xl bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
