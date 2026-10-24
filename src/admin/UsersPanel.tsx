import { useCallback, useEffect, useState, type FormEvent } from "react";

type AdminRole = "owner" | "admin";
type AdminUser = {
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
};

type UsersPanelProps = { accessToken: string; currentUserId: string };

export default function UsersPanel({ accessToken, currentUserId }: UsersPanelProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const request = useCallback(async (payload: Record<string, string>) => {
    const result = await fetch("/api/manage-admin-users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = (await result.json().catch(() => ({}))) as { message?: string; users?: AdminUser[] };
    if (!result.ok) throw new Error(body.message || "Admin account request failed.");
    return body;
  }, [accessToken]);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const result = await request({ action: "list" });
      setUsers(result.users || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load admin accounts.");
    }
  }, [request]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await request({ action: "invite", email, role });
      setMessage(result.message || "Invitation sent.");
      setEmail("");
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not send the invitation.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(user: AdminUser, nextRole: AdminRole) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await request({ action: "update-role", userId: user.user_id, role: nextRole });
      setMessage(result.message || "Role updated.");
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update the role.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(user: AdminUser) {
    if (!window.confirm(`Remove admin access and sign-in for ${user.email}?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await request({ action: "remove", userId: user.user_id });
      setMessage(result.message || "Admin account removed.");
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not remove the account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-users" aria-labelledby="admin-users-title">
      <div className="admin-panel">
        <h2 id="admin-users-title">Invite an admin</h2>
        <p>We’ll email a secure sign-up link. The person creates their own password; passwords are never shown or stored in this dashboard.</p>
        <form className="admin-user-invite" onSubmit={invite}>
          <label>Email address
            <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>Role
            <select value={role} onChange={(event) => setRole(event.target.value as AdminRole)}>
              <option value="admin">Administrator — manage site content and enquiries</option>
              <option value="owner">Owner — manage admin accounts too</option>
            </select>
          </label>
          <button className="admin-button primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send invitation"}</button>
        </form>
      </div>

      {error && <p className="admin-alert" role="alert">{error}</p>}
      {message && <p className="admin-notice" role="status">{message}</p>}

      <div className="admin-panel">
        <div className="admin-panel-heading"><h2>Admin accounts</h2><button className="admin-button subtle" type="button" onClick={() => void refresh()} disabled={busy}>Refresh</button></div>
        {users.length ? (
          <ul className="admin-user-list">
            {users.map((user) => (
              <li key={user.user_id}>
                <div className="admin-user-details">
                  <strong>{user.email}{user.user_id === currentUserId ? " (you)" : ""}</strong>
                  <span>Added {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <label className="admin-user-role">Role
                  <select aria-label={`Role for ${user.email}`} value={user.role} disabled={busy || user.user_id === currentUserId} onChange={(event) => void changeRole(user, event.target.value as AdminRole)}>
                    <option value="admin">Administrator</option>
                    <option value="owner">Owner</option>
                  </select>
                </label>
                <button className="admin-button danger" type="button" disabled={busy || user.user_id === currentUserId} onClick={() => void remove(user)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : !error ? <p role="status">Loading admin accounts…</p> : null}
      </div>
    </section>
  );
}
