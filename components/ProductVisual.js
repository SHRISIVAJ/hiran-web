import { themes } from "@/data/products";

// Deterministic pseudo-random so server and client render identically.
function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Heap({ type, accent }) {
  const r = rand(type === "powder" ? 7 : type === "flakes" ? 13 : 29);
  if (type === "powder") {
    return (
      <g>
        <ellipse cx="200" cy="318" rx="150" ry="20" fill="#0f172a" opacity="0.12" />
        <path d="M60 318 C110 250 160 214 200 212 C240 214 290 250 340 318 Z" fill="url(#powderFill)" />
        {Array.from({ length: 90 }).map((_, i) => {
          const x = 80 + r() * 240;
          const yTop = 318 - (1 - Math.abs(x - 200) / 140) * 100;
          const y = yTop + r() * (318 - yTop);
          return <circle key={i} cx={x} cy={y} r={0.8 + r() * 1.2} fill="#cbd5e1" opacity="0.7" />;
        })}
      </g>
    );
  }
  if (type === "flakes") {
    return (
      <g>
        <ellipse cx="200" cy="320" rx="150" ry="20" fill="#0f172a" opacity="0.12" />
        {Array.from({ length: 70 }).map((_, i) => {
          const x = 70 + r() * 260;
          const h = (1 - Math.abs(x - 200) / 140) * 95;
          const y = 318 - r() * Math.max(h, 8);
          const w = 14 + r() * 18;
          const rot = r() * 180;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <path
                d={`M${-w / 2} 0 L${-w / 4} ${-w / 4} L${w / 2} ${-w / 6} L${w / 3} ${w / 5} Z`}
                fill={i % 3 ? "#f8fafc" : "#e2e8f0"}
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
              <path d={`M${-w / 4} ${-w / 4} L${w / 3} ${w / 5}`} stroke="#fff" strokeWidth="1" opacity="0.9" />
            </g>
          );
        })}
      </g>
    );
  }
  // crystals
  return (
    <g>
      <ellipse cx="200" cy="320" rx="150" ry="20" fill="#0f172a" opacity="0.12" />
      {Array.from({ length: 110 }).map((_, i) => {
        const x = 70 + r() * 260;
        const h = (1 - Math.abs(x - 200) / 140) * 90;
        const y = 318 - r() * Math.max(h, 6);
        const s = 4 + r() * 6;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r() * 90})`}>
            <rect x={-s / 2} y={-s / 2} width={s} height={s} rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.7" />
            <path d={`M${-s / 2} ${-s / 2} L${s / 2} ${s / 2}`} stroke="#e2e8f0" strokeWidth="0.6" />
          </g>
        );
      })}
      {/* lemon slice for food-grade cue */}
      <g transform="translate(320 270)">
        <circle r="30" fill="#facc15" />
        <circle r="25" fill="#fef9c3" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d="M0 0 L0 -22" stroke="#facc15" strokeWidth="2" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </g>
  );
}

function Bag({ product, accent, deep }) {
  return (
    <g transform="translate(118 40)">
      <path d="M8 20 Q82 4 156 20 L164 196 Q82 212 0 196 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* woven texture */}
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M${6 + i * 7.5} 18 L${2 + i * 7.6} 200`} stroke="#e2e8f0" strokeWidth="0.8" />
      ))}
      <path d="M8 20 Q82 4 156 20" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />
      {/* label */}
      <rect x="20" y="52" width="124" height="112" rx="6" fill="#fff" stroke={accent} strokeWidth="1.5" />
      <rect x="20" y="52" width="124" height="24" rx="6" fill={accent} />
      <rect x="20" y="66" width="124" height="10" fill={accent} />
      <text x="82" y="69" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="sans-serif">
        {product.formula}
      </text>
      <text x="82" y="98" textAnchor="middle" fontSize="12" fontWeight="800" fill={deep} fontFamily="sans-serif">
        {product.name.split(" ").slice(0, 2).join(" ").toUpperCase()}
      </text>
      <text x="82" y="114" textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155" fontFamily="sans-serif">
        {product.grade}
      </text>
      <line x1="34" y1="126" x2="130" y2="126" stroke="#e2e8f0" />
      <text x="82" y="142" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">
        NET WT. 25 KG
      </text>
      <text x="82" y="155" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">
        HS {product.hsCode}
      </text>
      {product.hazard && (
        <g transform="translate(130 176)">
          <path d="M0 -12 L12 0 L0 12 L-12 0 Z" fill="#fff" stroke="#dc2626" strokeWidth="2" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626" fontFamily="sans-serif">!</text>
        </g>
      )}
    </g>
  );
}

export default function ProductVisual({ product, className = "", showBag = true }) {
  const t = themes[product.theme];
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.name} className={`h-full w-full object-cover ${className}`} />;
  }
  const id = product.slug;
  return (
    <svg
      viewBox="0 0 400 360"
      className={className}
      role="img"
      aria-label={`${product.name} — ${product.form}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={t.soft} />
        </radialGradient>
        <linearGradient id="powderFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect width="400" height="360" fill={`url(#bg-${id})`} />
      <circle cx="340" cy="60" r="90" fill={t.accent} opacity="0.07" />
      <circle cx="40" cy="320" r="70" fill={t.accent} opacity="0.06" />
      {showBag && <Bag product={product} accent={t.accent} deep={t.deep} />}
      <g transform={showBag ? "translate(0 20)" : "translate(0 -20) scale(1)"}>
        <Heap type={product.visual} accent={t.accent} />
      </g>
    </svg>
  );
}
