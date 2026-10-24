import { createClient } from "@supabase/supabase-js";

const json = (status, message) =>
  Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export default {
  async fetch(request) {
    if (request.method !== "POST") return json(405, "Method not allowed.");

    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!token || !supabaseUrl || !publishableKey || !secretKey) {
      return json(401, "Sign-in could not be verified.");
    }

    const authClient = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const adminClient = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);
    if (authError || !user) {
      return json(401, "Sign-in could not be verified.");
    }

    const { data: admin, error: adminError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (adminError || !admin) return json(403, "Admin access is required.");

    const { error } = await adminClient
      .from("admin_sign_ins")
      .insert({ admin_user_id: user.id, admin_email: user.email || "Unknown admin" });
    if (error) {
      console.error("Admin sign-in event could not be recorded", error.code);
      return json(500, "Sign-in event could not be recorded.");
    }

    return json(200, "Sign-in recorded.");
  },
};
