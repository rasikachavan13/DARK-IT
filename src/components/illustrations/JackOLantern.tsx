import React from 'react';

export type PumpkinExpression = 'mischievous' | 'sleepy' | 'suspicious' | 'excited' | 'possessed' | 'victorious';

interface JackOLanternProps {
  expression?: PumpkinExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glowing?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const JackOLantern: React.FC<JackOLanternProps> = ({
  expression = 'mischievous',
  size = 'md',
  glowing = true,
  className = '',
  onClick,
  title,
}) => {
  return (
    <div
      onClick={onClick}
      title={title || `${expression} Jack-o'-Lantern`}
      className={`inline-block relative shrink-0 transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${SIZE_MAP[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 90"
        className={`w-full h-full overflow-visible transition-all duration-300 ${
          glowing ? 'drop-shadow-[0_0_12px_rgba(255,117,24,0.6)]' : ''
        }`}
      >
        <defs>
          {/* Pumpkin skin gradient */}
          <radialGradient id={`pumpkinGrad-${expression}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFA640" />
            <stop offset="45%" stopColor="#FF7518" />
            <stop offset="85%" stopColor="#C94F12" />
            <stop offset="100%" stopColor="#6C2808" />
          </radialGradient>

          {/* Inner amber candle fire glow */}
          <radialGradient id={`glowGrad-${expression}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="40%" stopColor="#FFC15A" />
            <stop offset="80%" stopColor="#FF7518" />
            <stop offset="100%" stopColor="#7E2405" />
          </radialGradient>

          {/* Stem gradient */}
          <linearGradient id={`stemGrad-${expression}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5E8338" />
            <stop offset="60%" stopColor="#3C5723" />
            <stop offset="100%" stopColor="#253514" />
          </linearGradient>

          {/* Filter for glowing face */}
          <filter id={`faceGlow-${expression}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stem */}
        <path
          d="M 50 16 C 48 8, 43 4, 38 3 C 37 5, 41 9, 44 14 C 42 16, 45 17, 50 16 Z"
          fill={`url(#stemGrad-${expression})`}
        />
        {/* Tendril */}
        <path
          d="M 42 8 Q 36 6 38 12 Q 40 16 35 17"
          fill="none"
          stroke="#5E8338"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Pumpkin Ribs (Outer Lobes) */}
        <ellipse cx="28" cy="52" rx="20" ry="29" fill={`url(#pumpkinGrad-${expression})`} />
        <ellipse cx="72" cy="52" rx="20" ry="29" fill={`url(#pumpkinGrad-${expression})`} />

        {/* Pumpkin Ribs (Mid Lobes) */}
        <ellipse cx="38" cy="54" rx="21" ry="32" fill={`url(#pumpkinGrad-${expression})`} />
        <ellipse cx="62" cy="54" rx="21" ry="32" fill={`url(#pumpkinGrad-${expression})`} />

        {/* Pumpkin Center Lobe */}
        <ellipse cx="50" cy="55" rx="23" ry="33" fill={`url(#pumpkinGrad-${expression})`} />

        {/* Highlights & Grooves */}
        <path
          d="M 32 26 C 26 38, 26 66, 32 78"
          fill="none"
          stroke="#8A340C"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M 43 23 C 39 37, 39 71, 44 85"
          fill="none"
          stroke="#8A340C"
          strokeWidth="1.2"
          opacity="0.3"
        />
        <path
          d="M 57 23 C 61 37, 61 71, 56 85"
          fill="none"
          stroke="#8A340C"
          strokeWidth="1.2"
          opacity="0.3"
        />
        <path
          d="M 68 26 C 74 38, 74 66, 68 78"
          fill="none"
          stroke="#8A340C"
          strokeWidth="1.2"
          opacity="0.4"
        />

        {/* Carved Face depending on expression */}
        <g fill={`url(#glowGrad-${expression})`} filter={`url(#faceGlow-${expression})`}>
          {expression === 'mischievous' && (
            <>
              {/* Slanted mischievous eyes */}
              <polygon points="35,42 45,46 37,49" />
              <polygon points="65,42 55,46 63,49" />
              {/* Nose */}
              <polygon points="50,49 46,55 54,55" />
              {/* Jagged grin */}
              <path d="M 30 63 Q 50 78 70 63 Q 66 69 63 67 L 62 72 Q 50 77 38 72 L 37 67 Z" />
            </>
          )}

          {expression === 'sleepy' && (
            <>
              {/* Curved sleepy closed eyes */}
              <path d="M 33 46 Q 40 40 47 46" fill="none" stroke={`url(#glowGrad-${expression})`} strokeWidth="3" strokeLinecap="round" />
              <path d="M 53 46 Q 60 40 67 46" fill="none" stroke={`url(#glowGrad-${expression})`} strokeWidth="3" strokeLinecap="round" />
              {/* Soft small mouth */}
              <ellipse cx="50" cy="65" rx="5" ry="3" />
            </>
          )}

          {expression === 'suspicious' && (
            <>
              {/* Narrow squinting eye and wide eye */}
              <polygon points="33,45 47,43 45,48 35,48" />
              <circle cx="62" cy="45" r="4.5" />
              {/* Asymmetric mouth */}
              <path d="M 36 67 Q 52 64 64 61 L 62 66 Q 48 69 36 67 Z" />
            </>
          )}

          {expression === 'excited' && (
            <>
              {/* Large round glowing eyes */}
              <polygon points="34,39 46,39 40,49" />
              <polygon points="54,39 66,39 60,49" />
              {/* Triangle nose */}
              <polygon points="50,50 46,56 54,56" />
              {/* Wide open happy grin with teeth */}
              <path d="M 28 62 C 34 76, 66 76, 72 62 C 67 65, 64 63, 62 67 C 58 64, 52 64, 48 68 C 45 64, 40 65, 36 68 Z" />
            </>
          )}

          {expression === 'possessed' && (
            <>
              {/* Swirling/cross eerie eyes */}
              <path d="M 33 41 L 45 49 M 45 41 L 33 49" stroke={`url(#glowGrad-${expression})`} strokeWidth="3" strokeLinecap="round" />
              <path d="M 55 41 L 67 49 M 67 41 L 55 49" stroke={`url(#glowGrad-${expression})`} strokeWidth="3" strokeLinecap="round" />
              {/* Ominous hollow mouth */}
              <path d="M 32 60 Q 50 82 68 60 Q 50 67 32 60 Z" />
            </>
          )}

          {expression === 'victorious' && (
            <>
              {/* Crescent triumphant eyes */}
              <path d="M 33 47 Q 40 37 47 47" fill="none" stroke={`url(#glowGrad-${expression})`} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 53 47 Q 60 37 67 47" fill="none" stroke={`url(#glowGrad-${expression})`} strokeWidth="3.5" strokeLinecap="round" />
              {/* Star nose */}
              <polygon points="50,50 51.5,53 54.5,53 52,55 53,58 50,56 47,58 48,55 45.5,53 48.5,53" />
              {/* Broad champion smile */}
              <path d="M 30 61 Q 50 78 70 61 Q 50 82 30 61 Z" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
