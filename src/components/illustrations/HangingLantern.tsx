import React from 'react';

interface HangingLanternProps {
  size?: 'sm' | 'md' | 'lg';
  withChain?: boolean;
  chainHeight?: number;
  flicker?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-14',
  md: 'w-12 h-20',
  lg: 'w-16 h-28',
};

export const HangingLantern: React.FC<HangingLanternProps> = ({
  size = 'md',
  withChain = true,
  chainHeight = 40,
  flicker = true,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block overflow-visible shrink-0 ${
        flicker ? 'animate-lantern-flicker' : ''
      } ${className}`}
    >
      <svg
        viewBox={`0 0 60 ${65 + (withChain ? chainHeight : 0)}`}
        className={`${SIZE_MAP[size]} overflow-visible`}
      >
        <defs>
          {/* Flame glow radial gradient */}
          <radialGradient id="lanternFire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFAD4" />
            <stop offset="35%" stopColor="#FFC15A" />
            <stop offset="70%" stopColor="#FF7518" />
            <stop offset="100%" stopColor="#7A2202" stopOpacity="0.4" />
          </radialGradient>

          {/* Cast amber light pool */}
          <radialGradient id="lightPool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FF7518" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0D0B0A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Chain links */}
        {withChain && (
          <g stroke="#554238" strokeWidth="2" fill="none">
            {Array.from({ length: Math.max(1, Math.floor(chainHeight / 10)) }).map((_, i) => (
              <ellipse key={i} cx="30" cy={5 + i * 9} rx="2.5" ry="4.5" />
            ))}
          </g>
        )}

        <g transform={`translate(0, ${withChain ? chainHeight : 0})`}>
          {/* Light pool glow behind lantern */}
          <circle cx="30" cy="36" r="28" fill="url(#lightPool)" />

          {/* Hanging ring */}
          <circle cx="30" cy="6" r="4.5" fill="none" stroke="#554238" strokeWidth="2.5" />

          {/* Roof canopy */}
          <polygon points="12,18 48,18 36,9 24,9" fill="#2E211A" stroke="#554238" strokeWidth="1.5" />
          {/* Chimney cap */}
          <rect x="27" y="6" width="6" height="4" fill="#3D2D24" />

          {/* Glass chamber frame */}
          <rect
            x="16"
            y="18"
            width="28"
            height="32"
            rx="3"
            fill="rgba(255, 193, 90, 0.22)"
            stroke="#554238"
            strokeWidth="2"
          />

          {/* Glass pane dividers */}
          <line x1="30" y1="18" x2="30" y2="50" stroke="#554238" strokeWidth="1.5" />
          <line x1="16" y1="34" x2="44" y2="34" stroke="#554238" strokeWidth="1.2" opacity="0.7" />

          {/* Inner candle post */}
          <rect x="28" y="38" width="4" height="10" fill="#E8E2DC" />

          {/* Flickering Flame */}
          <path
            d="M 30 26 C 27 31, 27 36, 30 38 C 33 36, 33 31, 30 26 Z"
            fill="url(#lanternFire)"
            className="animate-pulse"
          />

          {/* Lantern base baseplate */}
          <polygon points="13,50 47,50 43,56 17,56" fill="#2E211A" stroke="#554238" strokeWidth="1.5" />
          {/* Bottom finial */}
          <circle cx="30" cy="58" r="2.5" fill="#3D2D24" />
        </g>
      </svg>
    </div>
  );
};
