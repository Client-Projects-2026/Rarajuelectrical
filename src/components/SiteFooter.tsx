import { ArrowUpRight } from "../icons";
import Brand from "./Brand";
import SocialProfileIcon from "./SocialProfileIcon";
import { usePublicContent } from "../content/PublicContentProvider";

export default function SiteFooter() {
  const { settings } = usePublicContent();

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
            {settings.socials.map((profile) => (
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
          © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
        </span>
        <span>Built around reliability.</span>
      </div>
    </footer>
  );
}
