import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Mic,
  Activity,
  Music,
  TrendingUp,
  Calendar,
  Home,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface WellnessSidebarProps {
  onSignOut: () => void;
}

const WellnessSidebar: React.FC<WellnessSidebarProps> = ({ onSignOut }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [_isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { t, setLanguage, currentLanguage } = usePageTranslation();

  const menuItems = [
    { 
      icon: Home, 
      label: t('home'), 
      path: "/", 
      color: "text-blue-500 dark:text-blue-400" 
    },
    { 
      icon: Calendar, 
      label: t('daily_checkin'), 
      path: "/daily-checkin", 
      color: "text-green-500 dark:text-green-400" 
    },
    { 
      icon: Heart, 
      label: t('mood_tracking'), 
      path: "/mood-tracking", 
      color: "text-pink-500 dark:text-pink-400" 
    },
    { 
      icon: MessageCircle, 
      label: t('chat'), 
      path: "/chat", 
      color: "text-purple-500 dark:text-purple-400" 
    },
    { 
      icon: Mic, 
      label: t('voice_interaction'), 
      path: "/voice", 
      color: "text-orange-500 dark:text-orange-400" 
    },
    { 
      icon: Activity, 
      label: t('physical_support'), 
      path: "/physical", 
      color: "text-red-500 dark:text-red-400" 
    },
    { 
      icon: Music, 
      label: t('music_relaxation'), 
      path: "/music", 
      color: "text-indigo-500 dark:text-indigo-400" 
    },
    { 
      icon: TrendingUp, 
      label: t('progress_tracking'), 
      path: "/progress", 
      color: "text-cyan-500 dark:text-cyan-400" 
    },
  ];

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const cycleLanguage = () => {
    const languages = ['en', 'es', 'hi'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* Left Edge Hover Trigger Zone - Expanded for better UX */}
      <div 
        className="fixed left-0 top-0 w-8 h-full z-50 bg-transparent"
        onMouseEnter={() => {
          setIsHovered(true);
          setIsCollapsed(false);
        }}
        style={{ 
          background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent)' 
        }}
      />

      {/* Backdrop for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-500 ease-in-out z-40 ${
          isCollapsed ? "w-0 lg:w-16" : "w-80"
        } ${isHomePage ? "lg:hidden" : ""}`}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsCollapsed(true);
        }}
      >
        {/* Logo Area with Close Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-bold text-lg text-gray-900 dark:text-white">Saathi</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('your_wellness_friend')}</p>
                </div>
              )}
            </div>
            
            {/* Close Button inside sidebar */}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-all duration-200"
              >
                <span className="text-sm font-medium">✕</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-sm"
                }`}
                style={{
                  transitionDelay: !isCollapsed ? `${index * 50}ms` : '0ms'
                }}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600 dark:text-blue-400" : item.color} transition-colors duration-200`} />
                {!isCollapsed && (
                  <span className="font-medium transition-all duration-300 ease-out">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={toggleTheme}
            className="w-full justify-start"
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-blue-600" />
            )}
            {!isCollapsed && (
              <span className="ml-3">
                {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
              </span>
            )}
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={cycleLanguage}
            className="w-full justify-start"
          >
            <Globe className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3 uppercase">{currentLanguage}</span>
            )}
          </Button>

          {/* Settings */}
          <Link to="/settings">
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className="w-full justify-start"
            >
              <span className="text-lg">⚙</span>
              {!isCollapsed && <span className="ml-3">{t('settings')}</span>}
            </Button>
          </Link>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={onSignOut}
            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <span className="text-lg">⚡</span>
            {!isCollapsed && <span className="ml-3">{t('sign_out')}</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WellnessSidebar;
