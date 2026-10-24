import type { ComponentType } from "react";
import {
  ArrowUpRight,
  Cable,
  Factory,
  Lightbulb,
  Settings,
  ShieldCheck,
  Zap,
} from "../icons";
import { usePublicContent } from "../content/PublicContentProvider";

const serviceIcons: Record<
  string,
  ComponentType<{ className?: string; size?: number }>
> = {
  "01": Settings,
  "02": Zap,
  "03": Cable,
  "04": ShieldCheck,
  "05": Lightbulb,
  "06": Factory,
};

export default function ServicesSection() {
  const { settings } = usePublicContent();

  return (
    <section
      className="services-section section-pad"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span /> OUR SERVICES
            </p>
            <h2 id="services-title">Powering complex environments</h2>
          </div>
          <p>
            Industrial, commercial and residential electrical services, from
            control panels and automation to lighting, protection and preventive
            maintenance.
          </p>
        </div>
        <div className="services-grid">
          {settings.services.map((service) => {
            const ServiceIcon = serviceIcons[service.number] ?? Zap;
            return (
              <article className="service-card" key={service.number}>
                <img
                  className="service-image"
                  src={service.image}
                  alt={service.imageAlt}
                  loading="lazy"
                />
                <div className="service-body">
                  <h3>
                    <ServiceIcon className="service-icon" size={20} />
                    {service.title}
                  </h3>
                  <p>{service.description}</p>
                  <a
                    href="#contact"
                    aria-label={`Enquire about ${service.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
