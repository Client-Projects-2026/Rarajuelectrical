import { useState } from "react";
import { ArrowUpRight, Menu, X } from "../icons";
import Brand from "./Brand";

const navItems = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          id="primary-nav"
          className={menuOpen ? "primary-nav open" : "primary-nav"}
          aria-label="Main navigation"
        >
          {navItems.map(([label, href]) => (
            <a key={label} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a className="nav-call" href="#contact" onClick={closeMenu}>
            Request a consultation <ArrowUpRight size={15} />
          </a>
        </nav>
      </div>
    </header>
  );
}
