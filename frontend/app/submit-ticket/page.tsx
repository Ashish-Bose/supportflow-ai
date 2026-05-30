import TicketForm from "@/components/TicketForm";

export default function SubmitTicketPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-4">
          Submit Support Ticket
        </h1>

        <p className="text-center text-gray-400 mb-12">
          Describe your issue and our AI assistant will analyze it automatically.
        </p>

        <TicketForm />
      </div>
    </main>
  );
}