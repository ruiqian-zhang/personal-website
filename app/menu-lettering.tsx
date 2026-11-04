// Fixed seeds keep the ink texture stable through navigation and hydration.
function grain(seed: number) {
  let value = (seed ^ 0x9e3779b9) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
  value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
  return ((value ^ (value >>> 15)) >>> 0) / 4294967296;
}

function InkLine({ length, seed, transform }: { length: number; seed: number; transform?: string }) {
  const steps = Math.ceil(length / 2);
  const edge = (side: number) => Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const taper = Math.min(1, t * 9, (1 - t) * 9);
    const pressure = .18 + .65 * grain(seed + Math.floor(index / 7));
    const width = (pressure + grain(seed + index * 3 + side) * .48) * taper;
    const drift = Math.sin(t * 8 + seed) * .4;
    return `${(t * length).toFixed(2)},${(drift + side * width).toFixed(2)}`;
  });
  return <g transform={transform}>
    <path d={`M${edge(1).join("L")}L${edge(-1).reverse().join("L")}Z`} />
    {/* Dry-brush fragments alongside the main impression. */}
    <path d={`M${length * .12} 1.6l${length * .16} -.3m${length * .24} -2.6l${length * .13} .2`} fill="none" stroke="currentColor" strokeWidth=".35" opacity=".3" />
  </g>;
}

export function MenuLettering({ label, corner }: { label: string; corner?: "start" | "end" }) {
  label = label.toUpperCase();
  const columns = 8;
  const width = label.length * 40;
  const fadeUpperRight = corner !== "end";
  const fadeId = `menu-upper-right-${label.toLowerCase()}`;
  const seed = Array.from(label).reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
  return <span className="mobile-menu-title" aria-hidden="true">
    <svg className="menu-ink-grid" viewBox={`0 0 ${columns * 40} 40`} preserveAspectRatio="none" aria-hidden="true">
      {fadeUpperRight && <defs>
        <radialGradient id={`${fadeId}-gradient`} gradientUnits="userSpaceOnUse" cx={width} cy="0" r="64">
          <stop offset="0" stopColor="#111" />
          <stop offset=".35" stopColor="#444" />
          <stop offset=".75" stopColor="#ccc" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <mask id={`${fadeId}-mask`} maskUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="120">
          <rect x="-40" y="-40" width="400" height="120" fill={`url(#${fadeId}-gradient)`} />
        </mask>
      </defs>}
      <g mask={fadeUpperRight ? `url(#${fadeId}-mask)` : undefined}>
      <InkLine length={width + (corner === "start" ? 42 : 20)} seed={seed} transform={`translate(${corner === "start" ? -32 : -10} 0)`} />
      <InkLine length={width + (corner === "end" ? 44 : 20)} seed={seed + 17} transform="translate(-10 40)" />
      {Array.from({ length: label.length + 1 }, (_, index) => {
        const topBleed = corner === "start" && index === 0 ? 32 : 9 + grain(seed + index) * 3;
        const bottomBleed = corner === "end" && index === label.length ? 34 : 9 + grain(seed + index + 9) * 3;
        return <InkLine key={index} length={40 + topBleed + bottomBleed} seed={seed + index * 23} transform={`translate(${index * 40 + (grain(seed + index * 7) - .5) * .8} -${topBleed}) rotate(90)`} />;
      })}
      {Array.from({ length: label.length * 7 }, (_, index) => {
        const junction = Math.floor(grain(seed + index * 13) * (label.length + 1)) * 40;
        const x = junction + (grain(seed + index * 19) - .5) * 12;
        const y = (index % 2 ? 40 : 0) + (grain(seed + index * 29) - .5) * 14;
        return <ellipse key={index} cx={x} cy={y} rx={.2 + grain(seed + index * 31) * .6} ry={.19 + grain(seed + index * 37) * .4} opacity={.12 + grain(seed + index * 41) * .36} />;
      })}
      </g>
    </svg>
    {Array.from({ length: columns }, (_, index) => <span className="mobile-menu-letter" key={index}>{label[index] || ""}</span>)}
  </span>;
}
