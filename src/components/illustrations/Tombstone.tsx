import React from 'react';
import { JackOLantern } from './JackOLantern.js';

interface TombstoneProps {
  title?: string;
  subtitle?: string;
  severity?: 'Curse' | 'Specter' | 'Poltergeist' | 'Wisp';
  withPumpkin?: boolean;
  className?: string;
}

const SEVERITY_COLORS = {
  Curse: { border: '#FF5B57', accent: '#FF5B57', label: 'CURSE' },
  Specter: { border: '#FF7518', accent: '#FF9F43', label: 'SPECTER' },
  Poltergeist: { border: '#FFC15A', accent: '#FFC15A', label: 'POLTERGEIST' },
  Wisp: { border: '#776C64', accent: '#B4A69A', label: 'WISP' },
};

export const Tombstone: React.FC<TombstoneProps> = ({
  title = 'R.I.P.',
  subtitle = 'Unresolved Bug',
  severity = 'Specter',
  withPumpkin = true,
  className = '',
}) => {
  const conf = SEVERITY_COLORS[severity] || SEVERITY_COLORS.Specter;

  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 100 120" className="w-24 h-28 overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
        <defs>
          <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E2824" />
            <stop offset="50%" stopColor="#1E1917" />
            <stop offset="100%" stopColor="#15110F" />
          </linearGradient>

          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15110F" stopOpacity="0" />
            <stop offset="30%" stopColor="#261A13" />
            <stop offset="70%" stopColor="#261A13" />
            <stop offset="100%" stopColor="#15110F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Earthen mound at base */}
        <ellipse cx="50" cy="112" rx="46" ry="7" fill="url(#groundGrad)" />

        {/* Granite Tombstone arched slab */}
        <path
          d="M 20 110
             L 20 40
             C 20 15, 80 15, 80 40
             L 80 110
             Z"
          fill="url(#stoneGrad)"
          stroke="#392820"
          strokeWidth="2"
        />

        {/* Weathered Stone Crack */}
        <path
          d="M 32 28 L 38 36 L 34 42 L 40 48"
          fill="none"
          stroke="#110F0E"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Cross / Skull motif */}
        <g stroke={conf.accent} strokeWidth="1.5" opacity="0.65" fill="none">
          <line x1="50" y1="30" x2="50" y2="44" />
          <line x1="43" y1="35" x2="57" y2="35" />
        </g>

        {/* Carved text */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#F4EDE5"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="1"
        >
          {title}
        </text>

        <text
          x="50"
          y="74"
          textAnchor="middle"
          fill={conf.accent}
          fontSize="6.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {conf.label}
        </text>

        <text
          x="50"
          y="86"
          textAnchor="middle"
          fill="#776C64"
          fontSize="5.5"
          fontFamily="sans-serif"
        >
          {subtitle.slice(0, 14)}
        </text>
      </svg>

      {/* Tiny Pumpkin resting beside the tombstone */}
      {withPumpkin && (
        <div className="absolute -bottom-1 -right-2">
          <JackOLantern expression="mischievous" size="xs" />
        </div>
      )}
    </div>
  );
};
