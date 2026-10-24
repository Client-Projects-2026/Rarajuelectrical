import { Cable, Lightbulb, Settings } from "../icons";
import { usePublicContent } from "../content/PublicContentProvider";

const proofIcons = [Settings, Cable, Lightbulb];

export default function ProofStrip() {
  const { settings } = usePublicContent();

  return (
    <section className="proof-strip" aria-label="Services at a glance">
      <div className="container proof-grid">
        {settings.services.slice(0, 3).map((service, index) => {
          const Icon = proofIcons[index] ?? Settings;
          return <div className="proof-item" key={service.number}>
            <Icon size={31} />
            <span>
              <strong>{service.title}</strong>
              <small>Electrical service</small>
            </span>
          </div>;
        })}
      </div>
    </section>
  );
}
