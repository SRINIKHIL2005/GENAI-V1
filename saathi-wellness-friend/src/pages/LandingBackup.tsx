import React, { useState } from "react";
import { Heart, Shield, Globe, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import EnhancedAuth from "./EnhancedAuth";
import NavigationHeader from "@/components/NavigationHeader";

// This is your backup of the ORIGINAL working Landing.tsx with professional design
const LandingBackup: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { theme } = useTheme();

  const features = [
    {
      icon: Heart,
      title: "Mental Wellness Support",
      description: "AI-powered emotional support and mood tracking to help you understand and improve your mental health.",
      color: "text-pink-500"
    },
    {
      icon: Shield,
      title: "Personalized Care",
      description: "Tailored recommendations based on your unique needs, preferences, and wellness journey.",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Connect in your preferred language with real-time translation for inclusive wellness support.",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "24/7 Availability",
      description: "Your wellness companion is always here when you need support, guidance, or just someone to talk to.",
      color: "text-purple-500"
    }
  ];

  if (showAuth) {
    return <EnhancedAuth onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <video 
          key={theme} 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            filter: 'brightness(1.25) contrast(1.05) saturate(1.05)'
          }}
        >
          <source 
            src={theme === "light" 
              ? "/Videos/A_breathtaking_waterfall_cascades_dramatically_down_a_rugged_clif_921805d3-52ef-4963-86d6-f5b190b664a1.mp4" 
              : "/Videos/solar_system_journey.mp4"
            } 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 transition-all duration-1000" style={{zIndex: 2}}></div>
        
        {/* Animated particles overlay */}
        <div className="absolute inset-0 overflow-hidden" style={{zIndex: 2}}>
          <div className="animate-pulse absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="animate-pulse absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300/30 rounded-full" style={{animationDelay: '1s'}}></div>
          <div className="animate-pulse absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-300/20 rounded-full" style={{animationDelay: '2s'}}></div>
          <div className="animate-pulse absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-300/25 rounded-full" style={{animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <NavigationHeader 
          showAuthButtons={true}
          onAuthClick={() => setShowAuth(true)}
        />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            
            {/* Professional Hero Container */}
            <div className="text-center mb-16">
              {/* Status badge */}
              <div className="inline-flex items-center px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-full mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-slate-300 text-sm font-medium">AI Mental Health Platform • Live</span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Mental Health
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  with AI-Powered Saathi
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Experience personalized mental wellness support through advanced AI technology, 
                therapeutic conversations, and evidence-based interventions designed for your unique journey.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg"
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-slate-400 text-slate-200 hover:bg-slate-800/50 px-8 py-3 text-lg font-semibold"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comprehensive Mental Wellness Platform
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Our AI-powered platform provides personalized support, evidence-based interventions, 
                and 24/7 availability for your mental health journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-700 hover:bg-slate-800/80 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center mb-4">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/80 border-t border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-white">Saathi</span>
            </div>
            <p className="text-slate-400">
              Your AI-powered mental wellness companion
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingBackup;
