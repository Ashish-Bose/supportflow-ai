import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY is missing"
    );
  }

  return new Resend(
    process.env.RESEND_API_KEY
  );
}

interface CustomerTicket {
  id: string;
  name: string;
  email: string;
  issue: string;
  priority: string;
  status: string;
}

interface AdminTicket {
  id: string;
  name: string;
  email: string;
  issue: string;
  priority: string;
  sentiment?: string | null;
  aiSummary?: string | null;
}

export async function sendCustomerEmail(
  ticket: CustomerTicket
) {
  try {
    const resend = getResend();

    const result =
      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          "SupportFlow AI <onboarding@resend.dev>",

        to: ticket.email,

        subject: `SupportFlow AI - Ticket Created (#${ticket.id.slice(
          0,
          8
        )})`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>Support Ticket Received</h2>

            <p>Hello ${ticket.name},</p>

            <p>
              Thank you for contacting SupportFlow AI.
              Your support request has been successfully created.
            </p>

            <hr />

            <p>
              <strong>Ticket ID:</strong>
              ${ticket.id}
            </p>

            <p>
              <strong>Priority:</strong>
              ${ticket.priority}
            </p>

            <p>
              <strong>Status:</strong>
              ${ticket.status}
            </p>

            <p>
              <strong>Issue:</strong>
              ${ticket.issue}
            </p>

            <hr />

            <p>
              Our support team will review your request shortly.
            </p>

            <p>
              Thanks,<br />
              SupportFlow AI
            </p>
          </div>
        `,
      });

    console.log(
      "Customer email sent:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "Customer email error:",
      error
    );
  }
}

export async function sendAdminEmail(
  ticket: AdminTicket
) {
  try {
    const resend = getResend();

    const result =
      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          "SupportFlow AI <onboarding@resend.dev>",

        to:
          process.env.ADMIN_EMAIL ||
          "",

        subject: `🚨 New Support Ticket (${ticket.priority})`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px;">
            <h2>New Ticket Created</h2>

            <hr />

            <p>
              <strong>Ticket ID:</strong>
              ${ticket.id}
            </p>

            <p>
              <strong>Customer:</strong>
              ${ticket.name}
            </p>

            <p>
              <strong>Email:</strong>
              ${ticket.email}
            </p>

            <p>
              <strong>Priority:</strong>
              ${ticket.priority}
            </p>

            <p>
              <strong>Sentiment:</strong>
              ${ticket.sentiment || "N/A"}
            </p>

            <p>
              <strong>Issue:</strong>
            </p>

            <p>
              ${ticket.issue}
            </p>

            <hr />

            <p>
              <strong>AI Summary:</strong>
            </p>

            <p>
              ${ticket.aiSummary || "N/A"}
            </p>
          </div>
        `,
      });

    console.log(
      "Admin email sent:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "Admin email error:",
      error
    );
  }
}