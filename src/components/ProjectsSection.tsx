import ProjectCarousel from "../projects/ProjectCarousel";

export default function ProjectsSection() {
  return (
    <section
      className="projects-section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="container project-section-heading">
        <p className="eyebrow light">
          <span /> PROJECT CAPABILITIES
        </p>
        <h2 id="projects-title">Electrical work built around uptime</h2>
        <p>
          Typical scopes of work across control panels, cable systems, lighting
          and drives. Contact us to discuss your site requirements.
        </p>
      </div>
      <ProjectCarousel />
    </section>
  );
}
