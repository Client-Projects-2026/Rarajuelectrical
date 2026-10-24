import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { services, socialLinks } from "../data";
import type { SiteSettings } from "../content/types";
import EnquiriesPanel from "./EnquiriesPanel";
import OverviewPanel from "./OverviewPanel";
import ProjectsPanel from "./ProjectsPanel";
import SiteContentPanel from "./SiteContentPanel";
import UsersPanel from "./UsersPanel";
import type { Inquiry, ProjectDraft, SignIn } from "./types";

const initialSettings: SiteSettings = {
  business_name: "Raraju Electrical Engineering Power Solution Works",
  phone_display: "+91 79935 01001",
  phone_link: "+917993501001",
  whatsapp: "917993501001",
  email: "pkrarajuele7yam@gmail.com",
  location:
    "5.36/5, Ground Floor, Kotta Colony, Venturu, Rayavaram Mandal, East Godavari, Andhra Pradesh 533225",
  hero_title: "Electrical systems, built for what's next.",
  hero_description:
    "Industrial electrical engineering and power solutions across Andhra Pradesh.",
  projects_title: "Electrical work built around uptime",
  projects_description:
    "Typical scopes of work across control panels, cable systems, lighting and drives. Contact us to discuss your site requirements.",
  about_title: "Electrical work planned around your site.",
  about_description:
    "Raraju Electrical Engineering Power Solution Works provides control panel board and cable works, electronic systems, cable management, lightning protection, industrial lighting and preventive maintenance.",
  socials: socialLinks,
  services,
};

const tabs = ["Overview", "Projects", "Enquiries", "Site content", "Admin users"] as const;
type Tab = (typeof tabs)[number];

export default function AdminApp() {
  const client = supabase;
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<"owner" | "admin" | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("Overview");
  const [settings, setSettings] = useState(initialSettings);
  const [projects, setProjects] = useState<ProjectDraft[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [signIns, setSignIns] = useState<SignIn[]>([]);
  const [signInCount, setSignInCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin | Raraju Electrical";
    if (!client) {
      setCheckingSession(false);
      return;
    }
    void client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setAuthorized(false);
    });
    return () => data.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (!client || !session?.user.id) {
      setAuthorized(false);
      return;
    }
    let active = true;
    void client
      .from("admin_users")
      .select("user_id,role")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(async ({ data, error: accessError }) => {
        if (!active) return;
        if (accessError) {
          setError(
            `Could not verify admin access in Supabase (${accessError.message}). Confirm the site URL/key and database migration use the same Supabase project.`,
          );
          await client.auth.signOut();
          return;
        }
        if (!data) {
          setError(
            "This Supabase user is not in the admin allowlist. Add this Auth user's exact UUID to public.admin_users.",
          );
          await client.auth.signOut();
          return;
        }
        if (data.role !== "owner" && data.role !== "admin") {
          setError("This account has no active admin role.");
          await client.auth.signOut();
          return;
        }
        setUserRole(data.role);
        setAuthorized(true);
      });
    return () => {
      active = false;
    };
  }, [client, session]);

  useEffect(() => {
    if (!session) setUserRole(null);
  }, [session]);

  const loadDashboard = useCallback(async () => {
    if (!client) return;
    setError("");
    const [settingsResult, projectsResult, inquiriesResult, inquiryCountResult, signInResult] =
      await Promise.all([
        client.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        client.from("projects").select("*").order("sort_order", { ascending: true }),
        client.from("inquiries").select("*").order("created_at", { ascending: false }).limit(100),
        client.from("inquiries").select("id", { count: "exact", head: true }),
        client
          .from("admin_sign_ins")
          .select("id,admin_user_id,admin_email,signed_in_at", { count: "exact" })
          .order("signed_in_at", { ascending: false })
          .limit(25),
      ]);

    const failed = [settingsResult, projectsResult, inquiriesResult, inquiryCountResult, signInResult].find(
      (result) => result.error,
    );
    if (failed?.error) {
      setError(`Could not load admin data: ${failed.error.message}`);
      return;
    }
    if (settingsResult.data) {
      setSettings({ ...initialSettings, ...settingsResult.data });
    }
    setProjects((projectsResult.data || []).map((project) => ({
      ...project,
      image: project.image_url,
      imageAlt: project.image_alt,
    })));
    setInquiries((inquiriesResult.data || []) as Inquiry[]);
    setInquiryCount(inquiryCountResult.count || 0);
    setSignIns((signInResult.data || []) as SignIn[]);
    setSignInCount(signInResult.count || 0);
  }, [client]);

  useEffect(() => {
    if (authorized) void loadDashboard();
  }, [authorized, loadDashboard]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { data, error: signInError } = await client.auth.signInWithPassword({
      email: emailInput.trim(),
      password,
    });
    setBusy(false);
    if (signInError || !data.session) {
      setError("Sign-in failed. Check your email and password, then try again.");
      return;
    }

    setSession(data.session);
    if (import.meta.env.DEV) {
      setMessage(
        "Local preview: admin sign-in counting starts when the Vercel Function is running.",
      );
    } else {
      const auditResponse = await fetch("/api/record-admin-sign-in", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      }).catch(() => null);
      if (!auditResponse?.ok) {
        setMessage(
          "Signed in. The sign-in count could not be updated; check Vercel function configuration.",
        );
      } else {
        await loadDashboard();
      }
    }
    setPassword("");
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    const invalidSocial = settings.socials.some((link) => {
      try {
        return new URL(link.href).protocol !== "https:";
      } catch {
        return true;
      }
    });
    const invalidServiceImage = settings.services.some((service) => {
      if (service.image.startsWith("/") && !service.image.startsWith("//")) {
        return false;
      }
      try {
        const imageUrl = new URL(service.image);
        return imageUrl.protocol !== "https:" ||
          !imageUrl.hostname.endsWith(".supabase.co") ||
          !imageUrl.pathname.includes("/storage/v1/object/public/project-images/");
      } catch {
        return true;
      }
    });
    if (invalidSocial || invalidServiceImage) {
      setBusy(false);
      setError(
        invalidSocial
          ? "Social links must be valid HTTPS URLs."
          : "Service images must use a local site path or an uploaded Supabase project image.",
      );
      return;
    }
    const { error: updateError } = await client
      .from("site_settings")
      .update({
        business_name: settings.business_name.trim(),
        phone_display: settings.phone_display.trim(),
        phone_link: settings.phone_link.trim(),
        whatsapp: settings.whatsapp.replace(/\D/g, ""),
        email: settings.email.trim(),
        location: settings.location.trim(),
        hero_title: settings.hero_title.trim(),
        hero_description: settings.hero_description.trim(),
        about_title: settings.about_title.trim(),
        about_description: settings.about_description.trim(),
        projects_title: settings.projects_title.trim(),
        projects_description: settings.projects_description.trim(),
        socials: settings.socials,
        services: settings.services,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setBusy(false);
    if (updateError) setError(updateError.message);
    else setMessage("Site content saved and is now live.");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !draft) return;
    setBusy(true);
    setError("");
    let imageUrl = draft.image;

    if (imageFile && (!imageFile.type.match(/^image\/(jpeg|png|webp)$/) || imageFile.size > 5 * 1024 * 1024)) {
      setBusy(false);
      setError("Choose a JPG, PNG, or WebP image smaller than 5 MB.");
      return;
    }

    if (imageFile) {
      const safeExtension = imageFile.type === "image/png" ? "png" : imageFile.type === "image/webp" ? "webp" : "jpg";
      const storagePath = `${crypto.randomUUID()}.${safeExtension}`;
      const { error: uploadError } = await client.storage
        .from("project-images")
        .upload(storagePath, imageFile, {
          contentType: imageFile.type,
          cacheControl: "31536000",
          upsert: false,
        });
      if (uploadError) {
        setBusy(false);
        setError(`Image upload failed: ${uploadError.message}`);
        return;
      }
      imageUrl = client.storage.from("project-images").getPublicUrl(storagePath).data.publicUrl;
    }

    const localImage = imageUrl.startsWith("/") && !imageUrl.startsWith("//");
    const supabaseImage = imageUrl.startsWith(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-images/`);
    if (!localImage && !supabaseImage) {
      setBusy(false);
      setError("Use a local site image or upload a project image to Supabase Storage.");
      return;
    }

    const values = {
      title: draft.title.trim(),
      category: draft.category.trim(),
      description: draft.description.trim(),
      image_url: imageUrl.trim(),
      image_alt: draft.imageAlt.trim(),
      sort_order: Number(draft.sort_order) || 0,
      is_published: draft.is_published,
      updated_at: new Date().toISOString(),
    };
    const query = draft.id
      ? client.from("projects").update(values).eq("id", draft.id)
      : client.from("projects").insert(values);
    const { error: saveError } = await query;
    setBusy(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setDraft(null);
    setImageFile(null);
    setMessage("Project saved.");
    await loadDashboard();
  }

  async function deleteProject(project: ProjectDraft) {
    if (!client || !project.id || !window.confirm(`Delete “${project.title}”?`)) return;
    const { error: deleteError } = await client.from("projects").delete().eq("id", project.id);
    if (deleteError) setError(deleteError.message);
    else {
      setMessage("Project deleted.");
      await loadDashboard();
    }
  }

  async function changeInquiryStatus(id: string, status: Inquiry["status"]) {
    if (!client) return;
    const { error: statusError } = await client.from("inquiries").update({ status }).eq("id", id);
    if (statusError) setError(statusError.message);
    else await loadDashboard();
  }

  if (!isSupabaseConfigured || !client) {
    return (
      <AdminShell>
        <h1>Admin setup required</h1>
        <p>Connect this site to Supabase by following the setup steps in README.md. No admin credentials are stored in the website code.</p>
      </AdminShell>
    );
  }

  if (checkingSession || (session && !authorized)) {
    return <AdminShell><p role="status">Checking secure admin access…</p></AdminShell>;
  }

  if (!session || !authorized) {
    return (
      <AdminShell>
        <a className="admin-back-link" href="/">← Back to website</a>
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <p className="admin-eyebrow">PRIVATE ADMIN AREA</p>
          <h1 id="admin-login-title">Sign in to manage the website</h1>
          <p>Admin accounts are created privately. Public registration is disabled.</p>
          <form onSubmit={signIn}>
            <label>Email address<input type="email" autoComplete="username" required value={emailInput} onChange={(event) => setEmailInput(event.target.value)} /></label>
            <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p className="admin-alert" role="alert">{error}</p>}
            {message && <p className="admin-notice" role="status">{message}</p>}
            <button className="admin-button primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        </section>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <header className="admin-header">
        <a className="admin-brand" href="/">RARAJU <span>ADMIN</span></a>
        <div><span>{session.user.email}</span><button className="admin-button subtle" onClick={() => void client.auth.signOut()}>Sign out</button></div>
      </header>
      <main className="admin-main">
        <div className="admin-title-row"><div><p className="admin-eyebrow">WEBSITE MANAGEMENT</p><h1>Dashboard</h1></div><button className="admin-button subtle" onClick={() => void loadDashboard()}>Refresh data</button></div>
        <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.filter((item) => item !== "Admin users" || userRole === "owner").map((item) => <button key={item} className={tab === item ? "active" : ""} aria-current={tab === item ? "page" : undefined} onClick={() => { setTab(item); setError(""); setMessage(""); }}>{item}</button>)}
        </nav>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        {message && <p className="admin-notice" role="status">{message}</p>}
        {tab === "Overview" && <OverviewPanel inquiryCount={inquiryCount} projectCount={projects.length} signInCount={signInCount} signIns={signIns} />}
        {tab === "Projects" && <ProjectsPanel projects={projects} draft={draft} setDraft={setDraft} setImageFile={setImageFile} saveProject={saveProject} deleteProject={deleteProject} busy={busy} />}
        {tab === "Enquiries" && <EnquiriesPanel inquiries={inquiries} inquiryCount={inquiryCount} changeStatus={changeInquiryStatus} />}
        {tab === "Site content" && <SiteContentPanel settings={settings} setSettings={setSettings} saveSettings={saveSettings} busy={busy} />}
        {tab === "Admin users" && userRole === "owner" && session.access_token && <UsersPanel accessToken={session.access_token} currentUserId={session.user.id} />}
      </main>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-page">
      <div className="admin-frame">{children}</div>
    </div>
  );
}
