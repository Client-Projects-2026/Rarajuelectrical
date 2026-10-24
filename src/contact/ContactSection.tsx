import { ArrowUpRight, MessageCircle, PhoneCall } from "../icons";
import QuoteRequestForm from "./QuoteRequestForm";
import { usePublicContent } from "../content/PublicContentProvider";

const contactSpecialties = [
  "Control panels",
  "HT/LT cable works",
  "VFD & sensor systems",
  "Lighting & protection",
];

export default function ContactSection() {
  const { settings } = usePublicContent();

  return (
    <section
      className="contact-section section-pad"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow light">
            <span /> SITE &amp; PROJECT ENQUIRIES
          </p>
          <h2 id="contact-title">
            Plan your next
            <br />
            <em>electrical project.</em>
          </h2>
          <p>
            For industrial, commercial and residential customers. Share your
            site location and scope of work so our team can review the right
            next step.
          </p>
          <ul className="contact-specialties" aria-label="Electrical services">
            {contactSpecialties.map((specialty) => (
              <li key={specialty}>{specialty}</li>
            ))}
          </ul>
          <div className="contact-quick-links">
            <a className="button button-accent" href={`tel:${settings.phone_link}`}>
              <PhoneCall size={16} /> Call {settings.phone_display}
            </a>
            <a
              className="button button-whatsapp"
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} /> WhatsApp us
            </a>
          </div>
          <div className="contact-methods">
            {settings.location && (
              <div>
                <span>Business address</span>
                <strong>{settings.location}</strong>
              </div>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`}>
                <span>Email</span>
                <strong>{settings.email}</strong>
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
          {settings.location && (
            <div className="contact-map">
              <div className="contact-map-heading">
                <h3>Find our workshop</h3>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions <ArrowUpRight size={15} />
                </a>
              </div>
              <iframe
                title={`Map showing ${settings.business_name} at ${settings.location}`}
                src={`https://maps.google.com/maps?hl=en&z=16&iwloc=B&output=embed&q=${encodeURIComponent(settings.location)}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
              <p>Map location is based on the business address listed above.</p>
            </div>
          )}
        </div>
        <QuoteRequestForm />
      </div>
    </section>
  );
}
