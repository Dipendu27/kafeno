import React from 'react';

interface KafenoLogoProps {
  className?: string;
  showText?: boolean;
  /**
   * If you want to use the inline SVG logo again later set `useSvg` true.
   * Default is false to use the provided image asset.
   */
  useSvg?: boolean;
}

export default function KafenoLogo({ className = '', showText = true, useSvg = false }: KafenoLogoProps) {
  if (!useSvg) {
    const frameClass = showText ? 'aspect-[3.25/1]' : 'aspect-square';
    const imageClass = showText
      ? 'object-cover object-[center_52%]'
      : 'object-cover object-[center_52%]';

    return (
      <div className={`relative overflow-hidden ${frameClass} ${className}`}>
        <img
          src="/assets/kafeno-logo.png"
          alt="Kafeno Cafe & Bistro"
          className={`absolute inset-0 h-full w-full select-none ${imageClass}`}
          loading="eager"
        />
      </div>
    );
  }

  // Lightweight fallback for contexts where a vector placeholder is preferred.
  return (
    <div className={`inline-flex items-center font-sans ${className}`}>
      <svg width="240" height="72" viewBox="0 0 240 72" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kafeno logo">
        <rect width="100%" height="100%" fill="transparent" />
        <text x="8" y="42" style={{ fontFamily: '\"Great Vibes\", cursive, serif', fontSize: '40px', fill: '#2b1b12' }}>Kafeno</text>
      </svg>
    </div>
  );
}
