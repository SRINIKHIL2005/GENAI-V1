import React from "react";
import {
  Home,
  MessageCircle,
  Mic,
  TrendingUp,
  Heart,
  Sun,
  Moon,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface NavigationHeaderProps {
  showAuthButtons?: boolean;
  onAuthClick?: () => void;
  userName?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  showAuthButtons = false, 
  onAuthClick,
  userName 
}) => {
  const locationPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const { theme, setTheme } = useTheme();
  const { setLanguage, currentLanguage } = usePageTranslation();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: "/", 
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      path: "/chat", 
    },
    { 
      icon: Mic, 
      label: 'Voice', 
      path: "/voice", 
    },
    { 
      icon: TrendingUp, 
      label: 'Progress', 
      path: "/progress", 
    },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const cycleLanguage = () => {
    const languages = ['en', 'es', 'hi'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const isActive = (path: string) => locationPath === path;

  return (
    <header className="w-full z-50 transition-all duration-500">
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* Main Navigation Container - Premium Glassmorphism */}
        <div className="relative">
          {/* Multi-layer Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] via-white/[0.12] to-white/[0.07] backdrop-blur-3xl rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-purple-500/[0.04] to-cyan-500/[0.02] rounded-2xl"></div>
          <div className="absolute inset-0 border border-white/[0.15] rounded-2xl shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl"></div>
          
          {/* Content Layer */}
          <div className="relative flex items-center justify-between px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-105 transition-transform duration-300">
                  <Heart className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
                Saathi
              </span>
            </div>

            {/* Center Navigation - Premium Design */}
            <div className="hidden md:flex items-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/[0.12] via-black/[0.18] to-black/[0.12] backdrop-blur-2xl rounded-xl border border-white/[0.08] shadow-2xl"></div>
              
              <div className="relative flex items-center px-2 py-2 space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      className="relative group"
                    >
                      {/* Active State Background */}
                      {active && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white rounded-lg shadow-xl border border-white/40"></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 rounded-lg"></div>
                        </>
                      )}
                      
                      {/* Hover State Background */}
                      {!active && (
                        <div className="absolute inset-0 bg-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"></div>
                      )}
                      
                      {/* Content */}
                      <div className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 transform group-hover:scale-105 ${
                        active ? "text-gray-900" : "text-gray-200 group-hover:text-white"
                      }`}>
                        <Icon className="h-4 w-4 drop-shadow-sm" />
                        <span className="text-sm font-semibold drop-shadow-sm">{item.label}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Controls - Advanced Glassmorphism */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-md rounded-lg border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleLanguage}
                  className="relative h-10 w-10 rounded-lg text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-105 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                  title={`Language: ${currentLanguage.toUpperCase()}`}
                >
                  <Globe className="h-4 w-4 drop-shadow-sm" />
                </Button>
              </div>

              {/* Settings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-md rounded-lg border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-lg text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-105 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                >
                  <span className="text-base drop-shadow-sm">⚙️</span>
                </Button>
              </div>

              {/* User Profile */}
              {userName && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.15] to-purple-500/[0.15] rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  <div className="relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.12] backdrop-blur-2xl text-white border border-white/[0.15] shadow-xl hover:from-white/[0.12] hover:to-white/[0.16] transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-sm"></div>
                      <User className="relative h-4 w-4 drop-shadow-sm" />
                    </div>
                    <span className="text-sm font-semibold drop-shadow-sm">SRI</span>
                  </div>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-md rounded-lg border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="relative h-10 w-10 rounded-lg text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-105 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 drop-shadow-sm" />
                  ) : (
                    <Sun className="h-4 w-4 drop-shadow-sm" />
                  )}
                </Button>
              </div>

              {/* Auth Buttons */}
              {showAuthButtons && (
                <div className="flex items-center space-x-3 ml-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-md rounded-lg border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"></div>
                    <Button 
                      variant="ghost" 
                      onClick={onAuthClick}
                      className="relative px-6 py-3 rounded-lg text-base font-semibold text-gray-200 hover:text-white transition-all duration-300 transform hover:scale-105 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                    >
                      Sign In
                    </Button>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <Button 
                      onClick={onAuthClick}
                      className="relative bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-xl hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/30"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Premium Glassmorphism */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] via-white/[0.12] to-white/[0.07] backdrop-blur-3xl rounded-xl border border-white/[0.15] shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-purple-500/[0.04] to-cyan-500/[0.02] rounded-xl"></div>
            
            <nav className="relative flex items-center justify-between space-x-1 p-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className="relative group flex-1"
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-lg border border-white/40"></div>
                    )}
                    
                    {!active && (
                      <div className="absolute inset-0 bg-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    )}
                    
                    <div className={`relative flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105 ${
                      active ? "text-gray-900" : "text-gray-200 group-hover:text-white"
                    }`}>
                      <Icon className="h-4 w-4 drop-shadow-sm" />
                      <span className="text-xs font-semibold drop-shadow-sm">{item.label}</span>
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
