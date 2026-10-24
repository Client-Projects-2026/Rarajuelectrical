import type { Inquiry } from "./types";

type EnquiriesPanelProps = {
  inquiries: Inquiry[];
  inquiryCount: number;
  changeStatus: (id: string, status: Inquiry["status"]) => void;
};

export default function EnquiriesPanel({
  inquiries,
  inquiryCount,
  changeStatus,
}: EnquiriesPanelProps) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Project enquiries</h2>
          <p>
            {inquiryCount} total · displaying the latest {inquiries.length}
          </p>
        </div>
      </div>

      {inquiries.length ? (
        <div className="admin-inquiry-list">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="admin-inquiry">
              <div className="admin-inquiry-heading">
                <div>
                  <h3>{inquiry.name}</h3>
                  <time dateTime={inquiry.created_at}>
                    {new Date(inquiry.created_at).toLocaleString()}
                  </time>
                </div>
                <label>
                  <span className="admin-visually-hidden">Enquiry status for {inquiry.name}</span>
                  <select
                    value={inquiry.status}
                    onChange={(event) =>
                      changeStatus(inquiry.id, event.target.value as Inquiry["status"])
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </div>
              <div className="admin-inquiry-details">
                <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
                {inquiry.email && <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>}
                <span>{inquiry.service} · {inquiry.customer_type}</span>
                {inquiry.company && <span>{inquiry.company}</span>}
                {inquiry.project_location && <span>{inquiry.project_location}</span>}
              </div>
              <p>{inquiry.message}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No enquiries have been received yet.</p>
      )}
    </section>
  );
}
