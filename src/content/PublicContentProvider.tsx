import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { contact, services, socialLinks } from "../data";
import { projects as defaultProjects } from "../projects/data";
import { supabase } from "../lib/supabase";
import type { Project, SiteSettings } from "./types";

const defaultSettings: SiteSettings = {
  business_name: "Raraju Electrical Engineering Power Solution Works",
  phone_display: contact.phoneDisplay,
  phone_link: contact.phoneLink,
  whatsapp: contact.whatsapp,
  email: contact.email,
  location: contact.location,
  hero_title: "Electrical systems, built for what's next.",
  hero_description:
    "Industrial electrical engineering and power solutions across Andhra Pradesh.",
  projects_title: "Electrical work built around uptime",
  projects_description:
    "Typical scopes of work across control panels, cable systems, lighting and drives. Contact us to discuss your site requirements.",
  about_title: "Electrical work planned around your site.",
  about_description:
    "Raraju Electrical Engineering Power Solution Works provides control panel board and cable works, electronic systems, cable management, lightning protection, industrial lighting and preventive maintenance.",
  socials: socialLinks,
  services,
};

const fallbackProjects: Project[] = defaultProjects.map((project, index) => ({
  ...project,
  id: `fallback-${index + 1}`,
}));

type PublicContent = {
  settings: SiteSettings;
  projects: Project[];
  refresh: () => Promise<void>;
};

const PublicContentContext = createContext<PublicContent>({
  settings: defaultSettings,
  projects: fallbackProjects,
  refresh: async () => undefined,
});

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [projects, setProjects] = useState(fallbackProjects);

  const refresh = async () => {
    if (!supabase) return;
    const [settingsResult, projectsResult] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("projects")
        .select("id,title,category,description,image_url,image_alt")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsResult.data) {
      setSettings({ ...defaultSettings, ...settingsResult.data });
    }
    if (!projectsResult.error && projectsResult.data) {
      setProjects(
        projectsResult.data.map((project) => ({
          ...project,
          image: project.image_url,
          imageAlt: project.image_alt,
        })),
      );
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <PublicContentContext.Provider value={{ settings, projects, refresh }}>
      {children}
    </PublicContentContext.Provider>
  );
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}
