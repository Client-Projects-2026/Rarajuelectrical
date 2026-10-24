import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import { PublicContentProvider } from "./content/PublicContentProvider";
import "./styles.css";
import "./admin/admin.css";

const isAdminRoute = window.location.pathname.replace(/\/$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isAdminRoute ? (
      <AdminApp />
    ) : (
      <PublicContentProvider>
        <App />
      </PublicContentProvider>
    )}
  </React.StrictMode>,
);
