
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", showText = true, variant = 'light' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Isotipo: Cabeza con circuitos */}
      <svg viewBox="0 0 100 100" className="h-full w-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M75.5 48.5C75.5 65.3452 61.8452 79 45 79C28.1548 79 14.5 65.3452 14.5 48.5C14.5 31.6548 28.1548 18 45 18C61.8452 18 75.5 31.6548 75.5 48.5Z" 
          fill="#004185" 
        />
        <path 
          d="M75.5 48.5C75.5 55 72 65 65 72L60 85L45 80L35 85L30 72C20 65 14.5 55 14.5 48.5" 
          fill="#004185" 
        />
        {/* Circuitos internos */}
        <circle cx="40" cy="38" r="3" fill="white" />
        <circle cx="52" cy="35" r="3" fill="white" />
        <circle cx="58" cy="45" r="3" fill="white" />
        <circle cx="52" cy="55" r="3" fill="white" />
        <circle cx="40" cy="52" r="3" fill="white" />
        <path d="M40 38L45 45M52 35L45 45M58 45L45 45M52 55L45 45M40 52L45 45" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Logotipo: Texto EntrevistIA */}
      {showText && (
        <div className="flex font-bold tracking-tighter text-2xl items-baseline">
          <span className={variant === 'light' ? "text-white/90" : "text-slate-800"}>Entrevist</span>
          <span className="text-[#00A3FF] italic ml-0.5">IA</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
