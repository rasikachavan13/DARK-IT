import React from 'react';

export type GhostVariant = 'idle' | 'detective' | 'bugnet' | 'wrench' | 'lantern' | 'sleepy' | 'waving' | 'excited';

interface GhostCompanionProps {
  variant?: GhostVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
  hero: 'w-44 h-44',
};

export const GhostCompanion: React.FC<GhostCompanionProps> = ({
  variant = 'idle',
  size = 'md',
  glow = true,
  className = '',
  onClick,
  title,
}) => {
  return (
    <div
      onClick={onClick}
      title={title || `${variant} Ghost Companion`}
      className={`inline-block relative shrink-0 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${SIZE_MAP[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 110"
        className={`w-full h-full overflow-visible ${
          glow ? 'drop-shadow-[0_0_16px_rgba(255,159,67,0.45)]' : ''
        }`}
      >
        <defs>
          {/* Ghost body soft translucent spectral gradient */}
          <linearGradient id={`ghostBody-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="60%" stopColor="#F5ECE4" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#D9C9BF" stopOpacity="0.75" />
          </linearGradient>

          {/* Blush gradient */}
          <radialGradient id={`blushGrad-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF9F43" stopOpacity="0" />
          </radialGradient>

          {/* Eye glow */}
          <radialGradient id={`eyeGlow-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#301A10" />
            <stop offset="100%" stopColor="#120A06" />
          </radialGradient>
        </defs>

        {/* Floating wisp shadow beneath ghost */}
        <ellipse cx="50" cy="104" rx="20" ry="4" fill="#FF7518" opacity="0.15" />

        {/* Ghost Main Body with undulating ripples at the base */}
        <path
          d="M 50 12
             C 28 12, 22 34, 22 55
             C 22 68, 20 86, 26 95
             C 28 98, 33 97, 36 92
             C 39 88, 43 89, 46 95
             C 49 100, 53 100, 56 94
             C 59 88, 63 88, 66 93
             C 70 98, 75 97, 77 92
             C 80 84, 78 68, 78 55
             C 78 34, 72 12, 50 12 Z"
          fill={`url(#ghostBody-${variant})`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.2"
        />

        {/* Soft Cheeks Blush */}
        <circle cx="34" cy="52" r="5" fill={`url(#blushGrad-${variant})`} />
        <circle cx="66" cy="52" r="5" fill={`url(#blushGrad-${variant})`} />

        {/* Ghost Arms based on variant */}
        {variant === 'waving' && (
          <>
            {/* Waving left arm raised high */}
            <path
              d="M 23 48 C 12 40, 8 28, 14 24 C 18 22, 22 30, 24 40"
              fill={`url(#ghostBody-${variant})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
            {/* Right arm resting */}
            <path
              d="M 77 52 C 84 56, 85 64, 80 67 C 76 69, 74 62, 75 56"
              fill={`url(#ghostBody-${variant})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
          </>
        )}

        {variant !== 'waving' && (
          <>
            {/* Left little stubby ghost arm */}
            <path
              d="M 23 52 C 16 56, 15 64, 20 67 C 24 69, 26 62, 25 56"
              fill={`url(#ghostBody-${variant})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
            {/* Right little stubby ghost arm */}
            <path
              d="M 77 52 C 84 56, 85 64, 80 67 C 76 69, 74 62, 75 56"
              fill={`url(#ghostBody-${variant})`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
          </>
        )}

        {/* Eyes & Mouth depending on state */}
        {variant === 'sleepy' ? (
          <>
            {/* Closed curved sleepy eyes */}
            <path d="M 33 46 Q 39 41 45 46" fill="none" stroke="#2B1810" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 55 46 Q 61 41 67 46" fill="none" stroke="#2B1810" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="50" cy="56" rx="2.5" ry="1.5" fill="#2B1810" />
            {/* Tiny Zzz */}
            <text x="75" y="30" fill="#FF9F43" fontSize="12" fontWeight="bold" fontFamily="monospace">z</text>
            <text x="83" y="20" fill="#FFC15A" fontSize="9" fontWeight="bold" fontFamily="monospace">z</text>
          </>
        ) : variant === 'excited' ? (
          <>
            {/* Wide happy eyes */}
            <circle cx="38" cy="44" r="4.5" fill={`url(#eyeGlow-${variant})`} />
            <circle cx="62" cy="44" r="4.5" fill={`url(#eyeGlow-${variant})`} />
            <circle cx="36" cy="42" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="42" r="1.5" fill="#FFFFFF" />
            {/* Big happy mouth */}
            <path d="M 44 52 Q 50 63 56 52 Z" fill="#2B1810" />
          </>
        ) : (
          <>
            {/* Curious friendly eyes with sparkle */}
            <circle cx="39" cy="45" r="4" fill={`url(#eyeGlow-${variant})`} />
            <circle cx="61" cy="45" r="4" fill={`url(#eyeGlow-${variant})`} />
            <circle cx="37.5" cy="43.5" r="1.4" fill="#FFFFFF" />
            <circle cx="59.5" cy="43.5" r="1.4" fill="#FFFFFF" />
            {/* Little smiling mouth */}
            <path d="M 46 54 Q 50 58 54 54" fill="none" stroke="#2B1810" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* VARIANT-SPECIFIC ACCESSORIES */}

        {/* Detective: Deerstalker cap and magnifying glass */}
        {variant === 'detective' && (
          <g>
            {/* Detective Hat */}
            <path d="M 32 18 Q 50 6 68 18 Q 50 14 32 18 Z" fill="#7A4C2E" />
            <ellipse cx="50" cy="18" rx="22" ry="4" fill="#5B341B" />
            <circle cx="50" cy="9" r="2.5" fill="#FF9F43" />
            {/* Magnifying Glass */}
            <g transform="translate(18, 54) rotate(-20)">
              <circle cx="0" cy="0" r="11" fill="rgba(255, 255, 255, 0.25)" stroke="#FF9F43" strokeWidth="2.5" />
              <line x1="7" y1="7" x2="18" y2="18" stroke="#FF7518" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M -5 -3 Q 0 -6 5 -3" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* Bug Net: Holding net with trapped glowing bug */}
        {variant === 'bugnet' && (
          <g transform="translate(68, 36) rotate(15)">
            {/* Handle */}
            <line x1="0" y1="20" x2="24" y2="-10" stroke="#B48248" strokeWidth="3" strokeLinecap="round" />
            {/* Hoop */}
            <ellipse cx="24" cy="-10" rx="12" ry="6" fill="none" stroke="#FF9F43" strokeWidth="2" />
            {/* Net mesh */}
            <path d="M 14 -10 Q 24 16 34 -10 Z" fill="rgba(255, 117, 24, 0.15)" stroke="#FFA640" strokeWidth="1" strokeDasharray="2,2" />
            {/* Trapped glowing bug */}
            <circle cx="24" cy="2" r="3" fill="#FFC15A" className="animate-pulse" />
          </g>
        )}

        {/* Wrench: Developer holding crossed wrenches */}
        {variant === 'wrench' && (
          <g transform="translate(50, 68)">
            {/* Wrench 1 */}
            <path
              d="M -16 6 L 16 -12"
              stroke="#B4A69A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Wrench 2 */}
            <path
              d="M 16 6 L -16 -12"
              stroke="#FF9F43"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Lantern: Holding a glowing amber lantern */}
        {variant === 'lantern' && (
          <g transform="translate(18, 56)">
            {/* Thin suspension wire */}
            <line x1="0" y1="0" x2="0" y2="10" stroke="#FFC15A" strokeWidth="1.5" />
            {/* Lantern top cap */}
            <polygon points="-8,10 8,10 5,6 -5,6" fill="#392820" />
            {/* Lantern glass frame */}
            <rect x="-7" y="10" width="14" height="15" rx="2" fill="rgba(255, 193, 90, 0.35)" stroke="#FF7518" strokeWidth="1.5" />
            {/* Inner flame */}
            <ellipse cx="0" cy="18" rx="3" ry="5" fill="#FFF490" className="animate-pulse" />
            {/* Bottom cap */}
            <rect x="-8" y="25" width="16" height="3" rx="1" fill="#392820" />
          </g>
        )}
      </svg>
    </div>
  );
};
