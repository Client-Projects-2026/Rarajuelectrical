import { Check, ShieldCheck, Zap } from "../icons";

const credentials = [
  { icon: Check, label: "100+ completed projects" },
  { icon: ShieldCheck, label: "Certified electricians" },
  { icon: Zap, label: "24/7 emergency services" },
];

export default function AboutSection() {
  return (
    <section
      className="about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="container about-inner">
        <div>
          <p className="eyebrow">
            <span /> ABOUT RARAJU ELECTRICAL
          </p>
          <h2 id="about-title">
            Engineering that keeps your operation moving.
          </h2>
        </div>
        <div className="about-copy">
          <p>
            Established in 2010, Raraju Electrical Engineering Power Solution
            Works serves Andhra Pradesh with electrical work for industrial,
            commercial and residential customers. Our team handles control
            panels, cable laying, VFD systems, lighting and lightning
            protection, with support from installation through ongoing
            maintenance.
          </p>
          <div className="about-values">
            {credentials.map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={16} /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
