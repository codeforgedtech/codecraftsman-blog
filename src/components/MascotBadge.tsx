// src/components/MascotBadge.tsx
import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  featured?: boolean;
};

const MascotBadge: React.FC<Props> = ({ featured = false, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    width={40}
    height={40}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <defs>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD54A" />
        <stop offset="100%" stopColor="#FF9D00" />
      </linearGradient>
    </defs>

    {/* FEATURED STAR (bakom) */}
    {featured && (
      <g opacity="0.9" filter="url(#glow)">
        <polygon
          points="32,6 38,24 58,24 42,35 48,54 32,43 16,54 22,35 6,24 26,24"
          fill="url(#gold)"
        />
      </g>
    )}

    {/* Badge-platta */}
    <circle cx="32" cy="32" r="28" fill="#06141a" stroke="#00e0ff" strokeWidth="2" filter="url(#glow)"/>

    {/* Enkel 2D neon-robot (huvud + korslagda armar) */}
    <g stroke="#00e0ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 20 h20 v10 c0 5-5 9-10 9s-10-4-10-9z" />
      <path d="M28 24 h8" />
      <path d="M26 28 h12" />
      <path d="M18 40 c6-6 22-6 28 0" />
      <path d="M20 44 l10-6 10 6" />
      <path d="M20 44 h24" />
      <path d="M30 36 l2-2 2 2-2 2z" />
    </g>
  </svg>
);

export default MascotBadge;
