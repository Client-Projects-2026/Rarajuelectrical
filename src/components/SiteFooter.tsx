import { ArrowUpRight } from "../icons";
import { socialLinks } from "../data";
import Brand from "./Brand";
import SocialProfileIcon from "./SocialProfileIcon";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <Brand className="brand-footer" />
        <div className="footer-brand-info">
          <p>
            Electrical expertise for
            <br />
            the places where work happens.
          </p>
          <div
            className="footer-socials"
            role="group"
            aria-label="Social media profiles"
          >
            {socialLinks.map((profile) => (
              <a
                key={profile.name}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${profile.name} profile (opens in a new tab)`}
                className={profile.name === "IndiaMART" ? "social-directory" : ""}
              >
                <SocialProfileIcon name={profile.name} />
                {profile.name === "IndiaMART" && (
                  <>
                    <span>IndiaMART</span>
                    <ArrowUpRight size={13} />
                  </>
                )}
              </a>
            ))}
          </div>
        </div>
        <a className="footer-top" href="#home">
          Back to top <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Raraju Electrical Engineering Power
          Solution Works. All rights reserved.
        </span>
        <span>Built around reliability.</span>
      </div>
    </footer>
  );
}
