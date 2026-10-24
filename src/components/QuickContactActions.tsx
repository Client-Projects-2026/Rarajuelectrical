import { MessageCircle, PhoneCall } from "../icons";
import { usePublicContent } from "../content/PublicContentProvider";

export default function QuickContactActions() {
  const { settings } = usePublicContent();

  return (
    <div className="quick-contact-actions" aria-label="Quick contact">
      <a
        className="quick-contact-call"
        href={`tel:${settings.phone_link}`}
        aria-label={`Call ${settings.business_name} at ${settings.phone_display}`}
      >
        <PhoneCall size={17} /> <span>Call</span>
      </a>
      <a
        className="quick-contact-whatsapp"
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Raraju Electrical on WhatsApp (opens in a new tab)"
      >
        <MessageCircle size={18} /> <span>WhatsApp</span>
      </a>
    </div>
  );
}
