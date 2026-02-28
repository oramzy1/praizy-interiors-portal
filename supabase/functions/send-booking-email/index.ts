import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL")!;
const FROM = "Praizy Interior <notifications@praizyinterior.ng>";

async function sendEmail(to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const { type, booking } = await req.json();
  // type: "new" | "accepted" | "rejected" | "proposed"

  const statusMessages: Record<string, { subject: string; clientHtml: string; adminHtml: string }> = {
    new: {
      subject: "Booking Request Received — Praizy Interior",
      clientHtml: `<p>Dear ${booking.client_name},</p><p>Thank you for reaching out! We've received your booking request for <strong>${booking.service_type}</strong> and will get back to you within 24 hours.</p><p>— Praizy Interior Team</p>`,
      adminHtml: `<p>New booking from <strong>${booking.client_name}</strong> (${booking.client_email}, ${booking.client_phone ?? "no phone"}).</p><p>Service: ${booking.service_type}<br/>Budget: ${booking.budget_range ?? "not specified"}<br/>Date: ${booking.preferred_date ?? "flexible"}</p><p>${booking.project_description ?? ""}</p>`,
    },
    accepted: {
      subject: "Your Booking Has Been Accepted — Praizy Interior",
      clientHtml: `<p>Dear ${booking.client_name},</p><p>Great news! Your booking request for <strong>${booking.service_type}</strong> has been <strong>accepted</strong>.</p>${booking.admin_notes ? `<p>Note from our team: ${booking.admin_notes}</p>` : ""}<p>We'll be in touch shortly to finalize details.</p><p>— Praizy Interior Team</p>`,
      adminHtml: `<p>You accepted the booking for <strong>${booking.client_name}</strong> — ${booking.service_type}.</p>`,
    },
    rejected: {
      subject: "Update on Your Booking Request — Praizy Interior",
      clientHtml: `<p>Dear ${booking.client_name},</p><p>Thank you for your interest. Unfortunately, we're unable to accommodate your request for <strong>${booking.service_type}</strong> at this time.</p>${booking.admin_notes ? `<p>${booking.admin_notes}</p>` : ""}<p>We hope to work with you in the future.</p><p>— Praizy Interior Team</p>`,
      adminHtml: `<p>You rejected the booking for <strong>${booking.client_name}</strong>.</p>`,
    },
    proposed: {
      subject: "Alternative Date Proposed — Praizy Interior",
      clientHtml: `<p>Dear ${booking.client_name},</p><p>We'd like to propose an alternative for your <strong>${booking.service_type}</strong> booking.</p><p><strong>Proposed Date:</strong> ${booking.proposed_date ?? ""} ${booking.proposed_time ?? ""}</p>${booking.admin_notes ? `<p>${booking.admin_notes}</p>` : ""}<p>Please reply to confirm or let us know if this works for you.</p><p>— Praizy Interior Team</p>`,
      adminHtml: `<p>You proposed a new date to <strong>${booking.client_name}</strong> — ${booking.proposed_date} ${booking.proposed_time ?? ""}.</p>`,
    },
  };

  const msg = statusMessages[type];
  if (!msg) return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400, headers: corsHeaders });

  await Promise.all([
    sendEmail(booking.client_email, msg.subject, msg.clientHtml),
    sendEmail(ADMIN_EMAIL, `[${type.toUpperCase()}] ${msg.subject}`, msg.adminHtml),
  ]);

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});