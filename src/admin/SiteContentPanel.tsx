import type { FormEvent } from "react";
import type { ServiceCard, SiteSettings } from "../content/types";

type SiteContentPanelProps = {
  settings: SiteSettings;
  busy: boolean;
  setSettings: (value: SiteSettings) => void;
  saveSettings: (event: FormEvent<HTMLFormElement>) => void;
};

type TextField = Exclude<keyof SiteSettings, "services" | "socials">;

export default function SiteContentPanel({
  settings,
  busy,
  setSettings,
  saveSettings,
}: SiteContentPanelProps) {
  function updateText(field: TextField, value: string) {
    setSettings({ ...settings, [field]: value });
  }

  function updateSocial(index: number, href: string) {
    setSettings({
      ...settings,
      socials: settings.socials.map((link, linkIndex) =>
        linkIndex === index ? { ...link, href } : link,
      ),
    });
  }

  function updateService(index: number, patch: Partial<ServiceCard>) {
    setSettings({
      ...settings,
      services: settings.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, ...patch } : service,
      ),
    });
  }

  return (
    <form className="admin-panel admin-settings-form" onSubmit={saveSettings}>
      <h2>Business details and page content</h2>
      <div className="admin-form-grid">
        <label className="wide">
          Business name
          <input required maxLength={180} value={settings.business_name} onChange={(event) => updateText("business_name", event.target.value)} />
        </label>
        <label>
          Display phone
          <input required maxLength={32} value={settings.phone_display} onChange={(event) => updateText("phone_display", event.target.value)} />
        </label>
        <label>
          Call link number
          <input required maxLength={32} value={settings.phone_link} onChange={(event) => updateText("phone_link", event.target.value)} />
        </label>
        <label>
          WhatsApp number (country code, digits only)
          <input required maxLength={20} value={settings.whatsapp} onChange={(event) => updateText("whatsapp", event.target.value)} />
        </label>
        <label>
          Email
          <input required type="email" maxLength={254} value={settings.email} onChange={(event) => updateText("email", event.target.value)} />
        </label>
        <label className="wide">
          Address
          <input required maxLength={300} value={settings.location} onChange={(event) => updateText("location", event.target.value)} />
        </label>
      </div>

      <h3>Hero and section copy</h3>
      <div className="admin-form-grid">
        <label className="wide">
          Hero headline
          <input required maxLength={180} value={settings.hero_title} onChange={(event) => updateText("hero_title", event.target.value)} />
        </label>
        <label className="wide">
          Hero description
          <textarea required maxLength={500} rows={2} value={settings.hero_description} onChange={(event) => updateText("hero_description", event.target.value)} />
        </label>
        <label className="wide">
          About heading
          <input required maxLength={180} value={settings.about_title} onChange={(event) => updateText("about_title", event.target.value)} />
        </label>
        <label className="wide">
          About description
          <textarea required maxLength={1000} rows={3} value={settings.about_description} onChange={(event) => updateText("about_description", event.target.value)} />
        </label>
        <label className="wide">
          Project section heading
          <input required maxLength={180} value={settings.projects_title} onChange={(event) => updateText("projects_title", event.target.value)} />
        </label>
        <label className="wide">
          Project section description
          <textarea required maxLength={800} rows={3} value={settings.projects_description} onChange={(event) => updateText("projects_description", event.target.value)} />
        </label>
      </div>

      <h3>Services</h3>
      <div className="admin-service-editor">
        {settings.services.map((service, index) => (
          <fieldset key={service.number}>
            <legend>{service.number}</legend>
            <label>
              Service title
              <input maxLength={120} required value={service.title} onChange={(event) => updateService(index, { title: event.target.value })} />
            </label>
            <label>
              Description
              <textarea maxLength={600} rows={3} required value={service.description} onChange={(event) => updateService(index, { description: event.target.value })} />
            </label>
            <label>
              Image URL (site asset or uploaded project image)
              <input maxLength={1000} required value={service.image} onChange={(event) => updateService(index, { image: event.target.value })} />
            </label>
            <label>
              Image description
              <input maxLength={250} value={service.imageAlt} onChange={(event) => updateService(index, { imageAlt: event.target.value })} />
            </label>
          </fieldset>
        ))}
      </div>

      <h3>Social and directory links</h3>
      <div className="admin-form-grid">
        {settings.socials.map((link, index) => (
          <label key={link.name}>
            {link.name} URL
            <input type="url" maxLength={500} required value={link.href} onChange={(event) => updateSocial(index, event.target.value)} />
          </label>
        ))}
      </div>

      <div className="admin-actions">
        <button className="admin-button primary" disabled={busy}>
          {busy ? "Saving…" : "Save site content"}
        </button>
      </div>
    </form>
  );
}
