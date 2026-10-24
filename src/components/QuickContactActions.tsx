import { contact } from "../data";
import { MessageCircle, PhoneCall } from "../icons";

export default function QuickContactActions() {
  return (
    <div className="quick-contact-actions" aria-label="Quick contact">
      <a
        className="quick-contact-call"
        href={`tel:${contact.phoneLink}`}
        aria-label={`Call Raraju Electrical at ${contact.phoneDisplay}`}
      >
        <PhoneCall size={17} /> <span>Call</span>
      </a>
      <a
        className="quick-contact-whatsapp"
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Raraju Electrical on WhatsApp (opens in a new tab)"
      >
        <MessageCircle size={18} /> <span>WhatsApp</span>
      </a>
    </div>
  );
}
