import React from 'react';

interface ExpiryLogoProps {
  className?: string;
  size?: number;
  variant?: 'dark' | 'white' | 'lime' | 'blue';
  withBackground?: boolean;
}

export const ExpiryLogo: React.FC<ExpiryLogoProps> = ({
  className = '',
  size = 32,
  variant = 'dark',
  withBackground = false,
}) => {
  // Color configuration
  const getColor = () => {
    switch (variant) {
      case 'white':
        return '#FFFFFF';
      case 'lime':
        return '#C8FF35';
      case 'blue':
        return '#1688D4';
      case 'dark':
      default:
        return '#111111';
    }
  };

  const color = getColor();

  // If withBackground is true, show the black rounded square similar to the avatar in 7KClick.jpeg
  if (withBackground) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-[#111111] shadow-sm shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left detached circular dot */}
          <circle cx="28" cy="28" r="9" fill="#FFFFFF" />

          {/* Stylized geometric 'e' arc and loop matching 7KClick.jpeg */}
          <path
            d="M 54 20 C 74 20 86 32 86 48 L 22 48 C 22 48 22 66 38 78 C 50 86 70 84 82 72"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Top-left dot */}
      <circle cx="28" cy="28" r="9.5" fill={color} />

      {/* Main geometric 'e' loop & curve */}
      <path
        d="M 54 20 C 74 20 86 32 86 48 L 22 48 C 22 48 22 66 38 78 C 50 86 70 84 82 72"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
