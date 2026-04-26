interface Props {
  wrong: number;
}

// Replaces the gallows with a Hextech rune circle that fills as you fail.
// 6 stages — each rune lights up.
export function HangmanFigure({ wrong }: Props) {
  const runes = Array.from({ length: 6 }, (_, i) => i < wrong);

  return (
    <div className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
      {/* Outer rotating rune ring */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-rune"
      >
        <defs>
          <radialGradient id="ringGrad">
            <stop offset="0%" stopColor="oklch(0.65 0.18 230)" stopOpacity="0" />
            <stop offset="80%" stopColor="oklch(0.65 0.18 230)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 80)" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#ringGrad)" />
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="oklch(0.7 0.13 80)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.7"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="oklch(0.7 0.13 80 / 0.4)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Inner static rune symbols */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {runes.map((active, i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 70;
          const y = 100 + Math.sin(angle) * 70;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="10"
                fill={active ? "oklch(0.55 0.22 25)" : "oklch(0.22 0.04 240)"}
                stroke={active ? "oklch(0.78 0.2 25)" : "oklch(0.4 0.07 80)"}
                strokeWidth="1.5"
                style={{
                  filter: active
                    ? "drop-shadow(0 0 8px oklch(0.7 0.25 25))"
                    : "none",
                  transition: "all 0.4s ease",
                }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={active ? "oklch(0.96 0.02 85)" : "oklch(0.5 0.05 80)"}
                style={{ transition: "all 0.4s" }}
              >
                {["ᚠ", "ᚱ", "ᚷ", "ᛉ", "ᛏ", "ᛟ"][i]}
              </text>
            </g>
          );
        })}

        {/* Center crystal */}
        <g style={{ transformOrigin: "100px 100px" }}>
          <polygon
            points="100,70 120,100 100,130 80,100"
            fill={wrong >= 6 ? "oklch(0.5 0.22 22)" : "oklch(0.55 0.18 230)"}
            stroke={wrong >= 6 ? "oklch(0.7 0.25 22)" : "oklch(0.78 0.2 220)"}
            strokeWidth="2"
            style={{
              filter: `drop-shadow(0 0 ${10 + wrong * 3}px ${
                wrong >= 6 ? "oklch(0.6 0.25 22)" : "oklch(0.65 0.2 230)"
              })`,
              transition: "all 0.5s",
            }}
            className={wrong >= 6 ? "animate-shake" : "animate-pulse-glow"}
          />
          <polygon
            points="100,80 112,100 100,120 88,100"
            fill="oklch(0.96 0.02 85 / 0.3)"
          />
        </g>
      </svg>
    </div>
  );
}
