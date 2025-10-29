import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div 
      className={`flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={handleClick}
    >
      {/* Location Pin with Briefcase Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location Pin Background */}
          <path
            d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30S24 16 24 10C24 5.6 20.4 2 16 2Z"
            fill="#00BCD4"
          />
          
          {/* White Circle Background for Briefcase */}
          <circle
            cx="16"
            cy="10"
            r="6"
            fill="white"
          />
          
          {/* Briefcase Icon */}
          <g transform="translate(10, 6)">
            {/* Briefcase Body */}
            <rect
              x="2"
              y="4"
              width="8"
              height="6"
              rx="0.5"
              fill="#1A237E"
            />
            
            {/* Briefcase Handle */}
            <rect
              x="4"
              y="2"
              width="4"
              height="2"
              rx="1"
              fill="#1A237E"
            />
            
            {/* Briefcase Clasp */}
            <rect
              x="5"
              y="6"
              width="2"
              height="1"
              rx="0.5"
              fill="#1A237E"
            />
          </g>
        </svg>
      </div>

      {/* GigSync Text */}
      {showText && (
        <h1 className={`${textSizes[size]} font-bold text-[#1A237E]`}>
          GigSync
        </h1>
      )}
    </div>
  );
};

export default Logo;
