import { ArrowUpRight, MessageCircle, PhoneCall } from "../icons";
import { contact } from "../data";
import QuoteRequestForm from "./QuoteRequestForm";

const contactSpecialties = [
  "Control panels",
  "HT/LT cable works",
  "VFD & sensor systems",
  "Lighting & protection",
];

export default function ContactSection() {
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
            <a className="button button-accent" href={`tel:${contact.phoneLink}`}>
              <PhoneCall size={16} /> Call {contact.phoneDisplay}
            </a>
            <a
              className="button button-whatsapp"
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} /> WhatsApp us
            </a>
          </div>
          <div className="contact-methods">
            {contact.location && (
              <div>
                <span>Business address</span>
                <strong>{contact.location}</strong>
              </div>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}>
                <span>Email</span>
                <strong>{contact.email}</strong>
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
          {contact.location && (
            <div className="contact-map">
              <div className="contact-map-heading">
                <h3>Find our workshop</h3>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions <ArrowUpRight size={15} />
                </a>
              </div>
              <iframe
                title={`Map showing Raraju Electrical at ${contact.location}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(contact.location)}&output=embed`}
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
