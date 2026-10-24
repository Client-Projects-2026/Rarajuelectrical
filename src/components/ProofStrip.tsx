import { Factory, MapPin, ShieldCheck } from "../icons";

const proofPoints = [
  {
    icon: Factory,
    title: "100+ completed projects",
    detail: "Industrial and commercial facilities",
  },
  {
    icon: MapPin,
    title: "Serving since 2010",
    detail: "Venturu, East Godavari, Andhra Pradesh",
  },
  {
    icon: ShieldCheck,
    title: "Certified electricians",
    detail: "Available for emergency support",
  },
];

export default function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Our experience">
      <div className="container proof-grid">
        {proofPoints.map(({ icon: Icon, title, detail }) => (
          <div className="proof-item" key={title}>
            <Icon size={31} />
            <span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
