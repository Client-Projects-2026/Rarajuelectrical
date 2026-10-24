import ProjectCarousel from "../projects/ProjectCarousel";
import type { Project, SiteSettings } from "../content/types";

export default function ProjectsSection({
  settings,
  projects,
}: {
  settings: SiteSettings;
  projects: Project[];
}) {
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
        <h2 id="projects-title">{settings.projects_title}</h2>
        <p>{settings.projects_description}</p>
      </div>
      <ProjectCarousel projects={projects} />
    </section>
  );
}
