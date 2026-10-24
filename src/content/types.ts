export type SocialLink = { name: string; href: string };
export type ServiceCard = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type SiteSettings = {
  business_name: string;
  phone_display: string;
  phone_link: string;
  whatsapp: string;
  email: string;
  location: string;
  hero_title: string;
  hero_description: string;
  projects_title: string;
  projects_description: string;
  about_title: string;
  about_description: string;
  socials: SocialLink[];
  services: ServiceCard[];
};
