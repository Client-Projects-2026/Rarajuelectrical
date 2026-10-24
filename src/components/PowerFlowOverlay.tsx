const routes = [
  {
    viewBox: "0 0 1440 610",
    paths: [
      "M0 136h550q28 0 42 21l58 68q16 15 40 15h310c45 0 60-33 100-33h340",
      "M0 168h558q26 0 46 21l46 47q15 16 40 16h290q40 0 60-32l40-42q15-18 40-18h360",
      "M0 365h480q35 0 56-20l48-46q16-16 42-16h274q43 0 66 21l42 40q17 18 44 18h388",
      "M0 401h600q35 0 54-20l36-40q18-20 45-20h135q44 0 70 29l40 46q17 19 45 19h415",
    ],
    nodes: [
      [650, 225],
      [1000, 230],
      [966, 304],
      [940, 350],
    ],
  },
  {
    viewBox: "0 0 1672 708",
    paths: [
      "M1038 205h250q28 0 42-17l22-25q14-16 34-16h250",
      "M1018 241h90q25 0 43 14l26 19q17 12 40 12h193q22 0 37-16l31-35q15-16 37-16h160",
      "M883 324h134q25 0 42 17l23 24q17 17 42 17h290q25 0 39-21l20-32q14-22 38-22h147",
      "M900 343h111q25 0 42 17l25 25q17 16 41 16h244q27 0 41-23l18-29q14-22 39-22h160",
    ],
    nodes: [
      [1364, 164],
      [1320, 278],
      [1024, 341],
      [1065, 401],
    ],
  },
] as const;

type PowerFlowOverlayProps = {
  slideIndex: number;
};

export default function PowerFlowOverlay({ slideIndex }: PowerFlowOverlayProps) {
  const routeSet = routes[slideIndex];

  return (
    <svg
      className="powerflow-overlay"
      viewBox={routeSet.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {routeSet.paths.map((path, index) => (
        <g key={path}>
          <path className="powerflow-track" d={path} />
          <path
            className={`powerflow-pulse pulse-${["one", "two", "three", "four"][index]}`}
            pathLength="1000"
            d={path}
          />
        </g>
      ))}
      {routeSet.nodes.map(([cx, cy], index) => (
        <circle
          className={`powerflow-node node-${["one", "two", "three", "four"][index]}`}
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3"
        />
      ))}
    </svg>
  );
}
