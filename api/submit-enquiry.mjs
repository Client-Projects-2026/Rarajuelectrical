import { createClient } from "@supabase/supabase-js";
import { createHmac } from "node:crypto";

const json = (status, message) =>
  Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json(405, "Method not allowed.");
    }

    const expectedOrigin = process.env.SITE_ORIGIN;
    const requestOrigin = request.headers.get("origin");
    if (!expectedOrigin || !requestOrigin) {
      return json(503, "Enquiry service is not configured.");
    }

    let originMatches = false;
    try {
      originMatches =
        new URL(requestOrigin).origin === new URL(expectedOrigin).origin;
    } catch {
      originMatches = false;
    }
    if (!originMatches) return json(403, "Request origin is not allowed.");

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 12000) return json(413, "Request is too large.");

    let payload;
    try {
      const body = await request.text();
      if (body.length > 12000) return json(413, "Request is too large.");
      payload = JSON.parse(body || "{}");
    } catch {
      return json(400, "Invalid request.");
    }

    // Quietly accept bot submissions so the honeypot does not reveal itself.
    if (typeof payload.botField === "string" && payload.botField.trim()) {
      return json(200, "Enquiry received.");
    }

    const inquiry = {
      name: String(payload.name || "").trim(),
      phone: String(payload.phone || "").trim(),
      company: String(payload.company || "").trim(),
      email: String(payload.email || "").trim(),
      customer_type: String(payload.customerType || "").trim(),
      service: String(payload.service || "").trim(),
      project_location: String(payload.projectLocation || "").trim(),
      message: String(payload.message || "").trim(),
    };

    if (
      inquiry.name.length < 1 || inquiry.name.length > 120 ||
      inquiry.phone.length < 6 || inquiry.phone.length > 32 ||
      !/^[+()\d\s.-]+$/.test(inquiry.phone) ||
      inquiry.company.length > 160 || inquiry.email.length > 254 ||
      (inquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) ||
      !inquiry.customer_type || inquiry.customer_type.length > 100 ||
      !inquiry.service || inquiry.service.length > 140 ||
      inquiry.project_location.length > 120 ||
      inquiry.message.length < 1 || inquiry.message.length > 3000
    ) {
      return json(400, "Please check the enquiry fields and try again.");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const rateLimitSecret = process.env.RATE_LIMIT_SECRET;
    if (!supabaseUrl || !secretKey || !rateLimitSecret || rateLimitSecret.length < 32) {
      return json(503, "Enquiry service is not configured.");
    }

    const supabase = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    // Vercel overwrites x-forwarded-for with the connecting client IP.
    const clientIp = request.headers.get("x-forwarded-for") || "unknown-client";
    const fingerprint = createHmac("sha256", rateLimitSecret)
      .update(clientIp)
      .digest("hex");
    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "claim_inquiry_slot",
      { p_fingerprint: fingerprint },
    );
    if (rateLimitError) {
      console.error("Enquiry rate limit check failed", rateLimitError.code);
      return json(503, "Enquiry service is temporarily unavailable.");
    }
    if (!allowed) return json(429, "Too many enquiries. Please try again later.");

    const { error } = await supabase.from("inquiries").insert(inquiry);
    if (error) {
      console.error("Enquiry could not be stored", error.code);
      return json(500, "Could not send the enquiry. Please try again.");
    }

    return json(200, "Enquiry received.");
  },
};
