import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import DarkLanding from "./DarkLanding";
import LightLanding from "./LightLanding";

const Landing: React.FC = () => {
  const { theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Theme transition effect
  useEffect(() => {
    if (currentTheme !== theme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTheme(theme);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  }, [theme, currentTheme]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loading overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-white transition-opacity duration-1000 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Transition overlay: use light or dark tint based on target theme */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out pointer-events-none ${
          isTransitioning 
            ? (theme === 'light' ? 'bg-white/80' : 'bg-black/70')
            : 'bg-transparent opacity-0'
        }`}
        style={{ opacity: isTransitioning ? 1 : 0 }}
      />
      
      {/* Main content with slide transition */}
      <div 
        className={`w-full h-full transition-all duration-500 ease-out transform ${
          isTransitioning 
            ? currentTheme === 'dark' 
              ? 'translate-x-full opacity-0' 
              : '-translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        } ${
          !isLoaded ? 'translate-y-8 opacity-0' : ''
        }`}
      >
        {currentTheme === "dark" ? <DarkLanding /> : <LightLanding />}
      </div>
    </div>
  );
};

export default Landing;
