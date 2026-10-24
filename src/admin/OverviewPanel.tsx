import type { SignIn } from "./types";

type OverviewPanelProps = {
  inquiryCount: number;
  projectCount: number;
  signInCount: number;
  signIns: SignIn[];
};

export default function OverviewPanel({
  inquiryCount,
  projectCount,
  signInCount,
  signIns,
}: OverviewPanelProps) {
  return (
    <section aria-label="Site summary">
      <div className="admin-stat-grid">
        <Stat label="Admin sign-ins" value={signInCount} />
        <Stat label="Enquiries received" value={inquiryCount} />
        <Stat label="Projects listed" value={projectCount} />
      </div>

      <div className="admin-panel">
        <h2>Recent admin sign-ins</h2>
        {signIns.length ? (
          <ul className="admin-activity-list">
            {signIns.slice(0, 10).map((entry) => (
              <li key={entry.id}>
                <span>{entry.admin_email}</span>
                <time dateTime={entry.signed_in_at}>
                  {new Date(entry.signed_in_at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sign-ins recorded yet. New successful admin sessions will appear here.</p>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
