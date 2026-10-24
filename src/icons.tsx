import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  children: ReactNode;
  fill?: string;
  className?: string;
};

function Icon({ size = 18, children, fill = "none", className }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const ArrowDown = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M12 4v15m-6-6 6 6 6-6" />
  </Icon>
);
export const ArrowLeft = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M20 12H5m6 6-6-6 6-6" />
  </Icon>
);
export const ArrowRight = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </Icon>
);
export const Pause = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M8 5v14M16 5v14" />
  </Icon>
);
export const Play = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="m8 5 12 7-12 7z" />
  </Icon>
);
export const ArrowUpRight = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);
export const Check = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
);
export const Menu = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);
export const X = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);
export const Zap = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7z" />
  </Icon>
);

export const Cable = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="5" />
    <path d="M17.7 17.7 21 21M4 12H2" />
  </Icon>
);

export const Settings = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path
      d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"
      transform="translate(-1 -1)"
    />
  </Icon>
);

export const Lightbulb = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.7c.9.7 1.4 1.5 1.5 2.3h5c.1-.8.6-1.6 1.5-2.3A7 7 0 0 0 12 2Z" />
  </Icon>
);

export const Factory = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M3 21V9l6 3V9l6 3V5h4v16H3Z" />
    <path d="M19 9h2v12h-2M7 16h.01M12 16h.01M17 16h.01" />
  </Icon>
);

export const MapPin = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const PhoneCall = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 10.2 18a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.5 3.2 2 2 0 0 1 3.5 1h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.4 9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.3 2.6Z" />
  </Icon>
);

export const MessageCircle = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
  </Icon>
);

export const ShieldCheck = (props: Omit<IconProps, "children">) => (
  <Icon {...props}>
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
