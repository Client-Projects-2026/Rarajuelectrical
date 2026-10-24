import AboutSection from "./components/AboutSection";
import HeroSection from "./components/HeroSection";
import ProofStrip from "./components/ProofStrip";
import ProjectsSection from "./components/ProjectsSection";
import QuickContactActions from "./components/QuickContactActions";
import ServicesSection from "./components/ServicesSection";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import ContactSection from "./contact/ContactSection";
import { usePublicContent } from "./content/PublicContentProvider";

function App() {
  const { settings, projects } = usePublicContent();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <ProofStrip />
        <ServicesSection />
        <ProjectsSection settings={settings} projects={projects} />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <QuickContactActions />
    </>
  );
}

export default App;
