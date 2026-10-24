import { usePublicContent } from "../content/PublicContentProvider";

export default function AboutSection() {
  const { settings } = usePublicContent();

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
          <h2 id="about-title">{settings.about_title}</h2>
        </div>
        <div className="about-copy">
          <p>{settings.about_description}</p>
        </div>
      </div>
    </section>
  );
}
