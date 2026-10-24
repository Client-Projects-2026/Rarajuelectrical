import type { FormEvent } from "react";
import type { ProjectDraft } from "./types";

type ProjectsPanelProps = {
  projects: ProjectDraft[];
  draft: ProjectDraft | null;
  busy: boolean;
  setDraft: (value: ProjectDraft | null) => void;
  setImageFile: (value: File | null) => void;
  saveProject: (event: FormEvent<HTMLFormElement>) => void;
  deleteProject: (project: ProjectDraft) => void;
};

export default function ProjectsPanel({
  projects,
  draft,
  busy,
  setDraft,
  setImageFile,
  saveProject,
  deleteProject,
}: ProjectsPanelProps) {
  function updateDraft<K extends keyof ProjectDraft>(
    key: K,
    value: ProjectDraft[K],
  ) {
    if (draft) setDraft({ ...draft, [key]: value });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Projects and capabilities</h2>
          <p>Add, update, publish, or remove project cards shown on the public site.</p>
        </div>
        <button
          className="admin-button primary"
          type="button"
          onClick={() => {
            setImageFile(null);
            setDraft({
              title: "",
              category: "",
              description: "",
              image: "",
              imageAlt: "",
              sort_order: projects.length + 1,
              is_published: false,
            });
          }}
        >
          Add project
        </button>
      </div>

      {draft && (
        <form className="admin-edit-form" onSubmit={saveProject}>
          <h3>{draft.id ? "Edit project" : "New project"}</h3>
          <div className="admin-form-grid">
            <label>
              Title
              <input
                required
                maxLength={140}
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
              />
            </label>
            <label>
              Category
              <input
                required
                maxLength={80}
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
              />
            </label>
            <label className="wide">
              Description
              <textarea
                required
                maxLength={800}
                rows={3}
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
              />
            </label>
            <label className="wide">
              Upload a project image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              />
              <small>JPG, PNG, or WebP. Maximum 5 MB.</small>
            </label>
            <label className="wide">
              Image URL
              <input
                required
                maxLength={1000}
                value={draft.image}
                onChange={(event) => updateDraft("image", event.target.value)}
              />
            </label>
            <label className="wide">
              Image description
              <input
                maxLength={250}
                value={draft.imageAlt}
                onChange={(event) => updateDraft("imageAlt", event.target.value)}
              />
            </label>
            <label>
              Display order
              <input
                type="number"
                min={0}
                step={1}
                value={draft.sort_order}
                onChange={(event) => updateDraft("sort_order", Number(event.target.value))}
              />
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(event) => updateDraft("is_published", event.target.checked)}
              />
              Published on website
            </label>
          </div>
          <div className="admin-actions">
            <button className="admin-button primary" disabled={busy}>
              {busy ? "Saving…" : "Save project"}
            </button>
            <button
              className="admin-button subtle"
              type="button"
              onClick={() => {
                setDraft(null);
                setImageFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length ? (
        <div className="admin-project-list">
          {projects.map((project) => (
            <article key={project.id} className="admin-project-row">
              <img src={project.image} alt="" />
              <div>
                <strong>{project.title}</strong>
                <span>
                  {project.category} · {project.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <button
                className="admin-button subtle"
                onClick={() => {
                  setImageFile(null);
                  setDraft({ ...project });
                }}
              >
                Edit
              </button>
              <button
                className="admin-button danger"
                onClick={() => void deleteProject(project)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p>No project entries yet.</p>
      )}
    </section>
  );
}
