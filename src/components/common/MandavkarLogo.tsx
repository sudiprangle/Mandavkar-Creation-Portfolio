import React from 'react';

interface MandavkarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const MandavkarLogo: React.FC<MandavkarLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  // Height configurations with maximum responsive width limits to never overflow mobile
  const heightClasses = {
    sm: 'h-9 sm:h-11 max-w-[190px] sm:max-w-[220px]',
    md: 'h-12 sm:h-15 max-w-[240px] sm:max-w-[290px]',
    lg: 'h-16 sm:h-22 max-w-[270px] sm:max-w-[360px]',
    xl: 'h-22 sm:h-28 max-w-[300px] sm:max-w-[420px]',
  };

  return (
    <div className={`inline-flex items-center justify-center select-none bg-transparent ${className}`}>
      <img
        src="/mandavkar-logo.svg"
        alt="Mandavkar Creation Logo"
        className={`${heightClasses[size]} w-auto object-contain bg-transparent drop-shadow-md`}
        loading="eager"
      />
    </div>
  );
};
