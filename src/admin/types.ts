import type { Project } from "../content/types";

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  customer_type: string;
  service: string;
  project_location: string;
  message: string;
  status: "new" | "contacted" | "closed";
};

export type SignIn = {
  id: number;
  admin_user_id: string;
  admin_email: string;
  signed_in_at: string;
};

export type ProjectDraft = Omit<Project, "id"> & {
  id?: string;
  sort_order: number;
  is_published: boolean;
};
