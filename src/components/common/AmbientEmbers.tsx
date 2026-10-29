import React, { useMemo } from 'react';

interface AmbientEmbersProps {
  count?: number;
}

export const AmbientEmbers: React.FC<AmbientEmbersProps> = ({ count = 22 }) => {
  const embers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 4.7 + 2) % 96}%`,
      bottom: `${(i * 7 + 5) % 85}%`,
      size: `${2 + (i % 4)}px`,
      duration: `${4 + (i % 6) * 1.5}s`,
      delay: `${(i % 5) * 0.8}s`,
      opacity: 0.25 + (i % 5) * 0.12,
      color: i % 3 === 0 ? '#FF7518' : i % 3 === 1 ? '#FF9F43' : '#FFC15A',
    }));
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="absolute rounded-full animate-pulse transition-opacity duration-1000"
          style={{
            left: ember.left,
            bottom: ember.bottom,
            width: ember.size,
            height: ember.size,
            backgroundColor: ember.color,
            boxShadow: `0 0 8px ${ember.color}`,
            opacity: ember.opacity,
            animationDuration: ember.duration,
            animationDelay: ember.delay,
          }}
        />
      ))}
    </div>
  );
};
