import React from 'react';

const Logo = ({ height = 36, style = {}, className = '' }) => {
  return (
    <div 
      className={`brand-logo ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      {/* Systematic Vector Icon */}
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 52 52" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="brandFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="brandBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
          </linearGradient>
          <clipPath id="brandCardClip">
            <rect x="4" y="6" width="44" height="42" rx="11" />
          </clipPath>
        </defs>

        {/* Back layered card */}
        <rect 
          x="8" 
          y="2" 
          width="40" 
          height="38" 
          rx="10" 
          transform="rotate(6 28 21)" 
          fill="url(#brandBackGrad)" 
        />

        {/* Main front card */}
        <rect 
          x="4" 
          y="6" 
          width="44" 
          height="42" 
          rx="11" 
          fill="url(#brandFrontGrad)" 
        />

        {/* Inner mountain & sun clipped to front card */}
        <g clipPath="url(#brandCardClip)">
          {/* Sun circle */}
          <circle cx="16" cy="18" r="4.2" fill="#FFFFFF" />
          
          {/* Left smaller mountain */}
          <path d="M0 48 L16 28 L32 48 Z" fill="#FFFFFF" fillOpacity="0.9" />
          
          {/* Right taller mountain */}
          <path d="M12 48 L28 19 L48 48 Z" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Brand Typography */}
      <span style={{ 
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontSize: '1.45rem', 
        fontWeight: 800, 
        letterSpacing: '-0.5px', 
        color: '#4F46E5', 
        lineHeight: 1 
      }}>
        imgly
      </span>
    </div>
  );
};

export default Logo;
