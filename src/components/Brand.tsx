type BrandProps = {
  className?: string;
};

export default function Brand({ className = "" }: BrandProps) {
  return (
    <a
      className={`brand ${className}`.trim()}
      href="#home"
      aria-label="Raraju Electrical Engineering Power Solution Works home"
    >
      <span className="brand-mark" aria-hidden="true">
        <img src="/RaRaja.png" alt="" />
      </span>
      <span className="brand-copy">
        RARAJU ELECTRICAL
        <span>ENGINEERING &amp; POWER SOLUTION WORKS</span>
      </span>
    </a>
  );
}
