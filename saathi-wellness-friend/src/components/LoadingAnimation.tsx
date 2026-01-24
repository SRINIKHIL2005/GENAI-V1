import React from 'react';

interface LoadingAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = ''
}) => {
  const getAnimationName = () => {
    switch (direction) {
      case 'up': return 'animate-in slide-in-from-bottom-4 fade-in';
      case 'down': return 'animate-in slide-in-from-top-4 fade-in';
      case 'left': return 'animate-in slide-in-from-right-4 fade-in';
      case 'right': return 'animate-in slide-in-from-left-4 fade-in';
      case 'fade': return 'animate-in fade-in';
      default: return 'animate-in slide-in-from-bottom-4 fade-in';
    }
  };

  return (
    <div
      className={`${getAnimationName()} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration * 1000}ms`,
        animationFillMode: 'both',
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

export default LoadingAnimation;