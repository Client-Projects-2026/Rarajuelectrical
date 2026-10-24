import { createClient } from "@supabase/supabase-js";

const response = (status, body) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

const roles = new Set(["owner", "admin"]);

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return response(405, { message: "Method not allowed." });
    }

    const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const url = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!token || !url || !publishableKey || !secretKey) {
      return response(503, { message: "Admin user management is not configured." });
    }

    let payload;
    try {
      const raw = await request.text();
      if (raw.length > 5000) return response(413, { message: "Request is too large." });
      payload = JSON.parse(raw || "{}");
    } catch {
      return response(400, { message: "Invalid request." });
    }

    const authClient = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const adminClient = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) return response(401, { message: "Sign-in has expired. Sign in again." });

    const actorId = authData.user.id;
    const { data: actor, error: actorError } = await adminClient
      .from("admin_users")
      .select("role")
      .eq("user_id", actorId)
      .maybeSingle();
    if (actorError || actor?.role !== "owner") {
      return response(403, { message: "Only an owner can manage admin accounts." });
    }

    if (payload.action === "list") {
      const { data, error } = await adminClient
        .from("admin_users")
        .select("user_id,email,role,created_at")
        .order("created_at", { ascending: true });
      if (error) return response(500, { message: "Could not load admin accounts." });
      return response(200, { users: data });
    }

    if (payload.action === "invite") {
      const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
      const role = typeof payload.role === "string" ? payload.role : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !roles.has(role)) {
        return response(400, { message: "Enter a valid email address and role." });
      }

      const siteOrigin = process.env.SITE_ORIGIN;
      if (!siteOrigin) return response(503, { message: "Set SITE_ORIGIN in Vercel before sending invitations." });
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: new URL("/admin", siteOrigin).toString(),
      });
      if (error || !data.user) {
        return response(400, {
          message: error?.code === "email_exists"
            ? "This email already has a Supabase account. Ask an owner to link that account using the setup SQL."
            : "Could not send the invitation. Check Supabase email and SMTP settings.",
        });
      }

      const { error: insertError } = await adminClient.from("admin_users").insert({
        user_id: data.user.id,
        email,
        role,
      });
      if (insertError) {
        await adminClient.auth.admin.deleteUser(data.user.id);
        console.error("Invited admin could not be allowlisted", insertError.code);
        return response(500, { message: "The account could not be added. No admin access was granted." });
      }
      return response(201, { message: `Invitation sent to ${email}.` });
    }

    if (payload.action === "update-role") {
      const userId = typeof payload.userId === "string" ? payload.userId : "";
      const role = typeof payload.role === "string" ? payload.role : "";
      if (!userId || !roles.has(role) || userId === actorId) {
        return response(400, { message: "Choose another account and a valid role." });
      }
      const { data: target, error: targetError } = await adminClient
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (targetError || !target) return response(404, { message: "Admin account not found." });
      if (target.role === "owner" && role !== "owner") {
        const { count, error: countError } = await adminClient
          .from("admin_users")
          .select("user_id", { count: "exact", head: true })
          .eq("role", "owner");
        if (countError || (count ?? 0) <= 1) {
          return response(409, { message: "At least one owner must remain." });
        }
      }
      const { error } = await adminClient.from("admin_users").update({ role }).eq("user_id", userId);
      if (error) return response(500, { message: "Could not update the account role." });
      return response(200, { message: "Account role updated." });
    }

    if (payload.action === "remove") {
      const userId = typeof payload.userId === "string" ? payload.userId : "";
      if (!userId || userId === actorId) {
        return response(400, { message: "You cannot remove your own account." });
      }
      const { data: target, error: targetError } = await adminClient
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (targetError || !target) return response(404, { message: "Admin account not found." });
      if (target.role === "owner") {
        const { count, error: countError } = await adminClient
          .from("admin_users")
          .select("user_id", { count: "exact", head: true })
          .eq("role", "owner");
        if (countError || (count ?? 0) <= 1) {
          return response(409, { message: "Promote another administrator to owner before removing the last owner." });
        }
      }
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) return response(500, { message: "Could not remove the admin account." });
      return response(200, { message: "Admin account removed." });
    }

    return response(400, { message: "Unknown admin account action." });
  },
};
