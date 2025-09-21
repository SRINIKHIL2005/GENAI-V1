import React, { useState } from "react";
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
import { logoutUser } from "@/services/firebase.service";

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
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setShowLogoutMenu(false);
      // Redirect to login page or refresh
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* EXACT REPLICA - Two-Layer Navigation Container */}
        <div className="relative">
          {/* OUTER BOX - Advanced Professional UI Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/40 via-blue-200/35 to-purple-200/30 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl shadow-indigo-500/25 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-50"></div>
          
          {/* Premium Glow Effect Layer */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-indigo-600/10 blur-sm"></div>
          
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 animate-pulse opacity-60"></div>
          
          {/* Content Layer - Exact Layout */}
          <div className="relative flex items-center justify-between px-6 py-3 z-10">
            
            {/* Left Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Saathi</span>
            </div>

            {/* Center Navigation - TWO LAYER STRUCTURE */}
            <div className="flex items-center">
              {/* INNER BOX - Professional Navigation Container */}
              <div className="relative bg-gradient-to-r from-indigo-400/30 via-blue-400/35 to-cyan-400/30 backdrop-blur-2xl rounded-full p-1.5 border border-white/25 shadow-xl shadow-blue-500/30">
                {/* Inner Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm"></div>
                
                {/* Navigation Items Container */}
                <div className="relative flex items-center space-x-1 z-10">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                          active 
                            ? 'bg-white text-gray-700 shadow-md' 
                            : 'text-white/70 hover:text-white hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-400/20'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Advanced Settings Button */}
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/30 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 group-hover:scale-110">
                  <span className="text-lg">⚙️</span>
                  {/* Inner Glow */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                </button>
              </div>
              
              {/* Advanced User Profile */}
              {userName && (
                <div className="relative group">
                  {/* Profile Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="relative flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/15 via-white/10 to-white/5 border border-white/30 backdrop-blur-xl text-white cursor-pointer hover:bg-gradient-to-r hover:from-indigo-400/20 hover:via-purple-400/15 hover:to-pink-400/20 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-400/25 transition-all duration-300 group-hover:scale-105"
                    onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                  >
                    {/* Avatar with Gradient */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">SRI</span>
                    
                    {/* Profile Inner Glow */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                  </div>
                </div>
              )}

              {/* Sign In Button - Show when not authenticated */}
              {showAuthButtons && !userName && onAuthClick && (
                <div className="relative group">
                  {/* Sign In Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 via-blue-400/30 to-purple-400/30 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <button
                    onClick={onAuthClick}
                    className="relative flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl text-white cursor-pointer hover:bg-gradient-to-r hover:from-green-400/30 hover:via-blue-400/30 hover:to-purple-400/30 hover:border-green-400/40 hover:shadow-xl hover:shadow-green-400/25 transition-all duration-300 group-hover:scale-105"
                  >
                    {/* Sign In Icon */}
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">Sign In</span>
                    
                    {/* Button Inner Glow */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                  </button>
                </div>
              )}

              {/* Advanced Logout Dropdown */}
              {showLogoutMenu && (
                <div className="absolute top-full right-0 mt-3 z-50">
                  {/* Dropdown Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-pink-400/20 to-red-500/30 blur-lg rounded-xl"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-2xl rounded-xl border border-white/30 shadow-2xl shadow-red-500/20 p-3 min-w-[140px]">
                    {/* Inner Glow Layer */}
                    <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-gradient-to-r hover:from-red-500/25 hover:to-pink-500/20 hover:shadow-lg hover:shadow-red-400/25 hover:border hover:border-red-400/30 transition-all duration-300 group"
                    >
                      {/* Logout Icon with Gradient */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-md">
                        <span className="text-xs">🚪</span>
                      </div>
                      <span className="text-sm font-medium group-hover:text-red-200">Logout</span>
                      
                      {/* Button Inner Glow */}
                      <div className="absolute inset-1 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              )}

              {/* Theme Toggle */}
              <div 
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full cursor-pointer transition-all duration-300 p-0.5 ${
                  theme === 'dark' 
                    ? 'bg-slate-700' 
                    : 'bg-orange-400'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-0' : 'translate-x-7'
                }`}>
                  {theme === 'dark' ? (
                    <Moon className="h-3 w-3 text-slate-600" />
                  ) : (
                    <Sun className="h-3 w-3 text-orange-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
