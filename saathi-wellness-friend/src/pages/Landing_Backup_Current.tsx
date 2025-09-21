import React, { useState, useEffect } from "react";
import { 
  Heart, 
  ArrowRight, 
  Play,
  Activity,
  MessageCircle,
  Mic,
  BarChart3,
  Shield,
  Globe,
  User,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import EnhancedAuth from "./EnhancedAuth";
import NavigationHeader from "@/components/NavigationHeader";

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const darkFeatures = [
    {
      icon: MessageCircle,
      title: "NEURAL_CHAT.EXE",
      description: "Advanced AI consciousness with quantum emotional processing capabilities",
      gradient: "from-cyan-500 to-blue-500",
      code: "0x4F2A"
    },
    {
      icon: Mic,
      title: "VOICE_SYNC.SYS",
      description: "Real-time neural voice interface with biometric authentication",
      gradient: "from-purple-500 to-pink-500",
      code: "0x7E1B"
    },
    {
      icon: BarChart3,
      title: "QUANTUM_ANALYTICS",
      description: "Deep learning mental health prediction algorithms",
      gradient: "from-emerald-500 to-teal-500",
      code: "0x9C3D"
    },
    {
      icon: Shield,
      title: "SECURE_MIND.VLT",
      description: "Military-grade encryption for consciousness data protection",
      gradient: "from-orange-500 to-red-500",
      code: "0xA5F7"
    }
  ];

  const lightFeatures = [
    {
      icon: Heart,
      title: "Empathetic Care",
      description: "Gentle AI companion that understands and nurtures your emotional well-being with compassionate intelligence",
      gradient: "from-pink-400 to-rose-400",
      benefit: "24/7 Support"
    },
    {
      icon: User,
      title: "Mindful Insights",
      description: "Beautiful data visualization that helps you understand your mental patterns and growth journey",
      gradient: "from-blue-400 to-indigo-400",
      benefit: "Personal Growth"
    },
    {
      icon: Zap,
      title: "Wellness Goals",
      description: "Achieve your mental health objectives with personalized guidance and motivational support",
      gradient: "from-emerald-400 to-green-400",
      benefit: "Goal Achievement"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Complete privacy and security for your most personal thoughts and therapeutic conversations",
      gradient: "from-purple-400 to-violet-400",
      benefit: "Total Privacy"
    }
  ];

  if (theme === "dark") {
    // ============= DARK THEME: CYBERPUNK QUANTUM INTERFACE =============
    return (
      <>
        {/* Enhanced Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 z-50 backdrop-blur-2xl flex items-center justify-center bg-black/90">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-black/95 to-slate-900/95 backdrop-blur-3xl rounded-2xl p-8 border border-cyan-500/50 max-w-md w-full mx-4 shadow-2xl">
                <button 
                  onClick={() => setShowAuth(false)}
                  className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors duration-300 z-10"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan-500/20 transition-colors duration-300">
                    ✕
                  </div>
                </button>
                <EnhancedAuth />
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen relative overflow-hidden bg-black">
          
          {/* Cyberpunk Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.3) saturate(1.2)" }}
          >
            <source src="/Videos/solar_system_journey.mp4" type="video/mp4" />
          </video>

          {/* Cyberpunk Matrix Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-transparent to-purple-900/30"></div>
          
          {/* Neon Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(cyan 1px, transparent 1px),
                linear-gradient(90deg, cyan 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          {/* Dynamic Holographic Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${1.5 + Math.random() * 2}s`
                }}
              />
            ))}
            
            {/* Cyberpunk Mouse Tracking */}
            <div 
              className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl transition-all duration-200"
              style={{
                left: mousePosition.x - 192,
                top: mousePosition.y - 192,
              }}
            ></div>
          </div>

          {/* Navigation */}
          <div className="relative z-20">
            <NavigationHeader 
              showAuthButtons={true}
              onAuthClick={() => setShowAuth(true)}
            />
          </div>

          {/* CYBERPUNK HERO SECTION */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="max-w-7xl mx-auto w-full">
              
              {/* Quantum Terminal Status */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-8 py-4 bg-black/90 border border-cyan-500 rounded-none backdrop-blur-md">
                  <div className="relative mr-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-green-400 shadow-lg"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-green-400 text-sm font-mono font-bold tracking-[0.4em]">
                    QUANTUM_NEURAL_NETWORK_ONLINE
                  </span>
                  <div className="ml-4 px-3 py-1 bg-green-400/20 border border-green-400">
                    <span className="text-green-400 text-xs font-mono">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Cyberpunk Terminal Title */}
              <div className="text-center mb-16">
                <div className="font-mono text-cyan-400 text-lg mb-4">
                  &gt; Initializing SAATHI.EXE...
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-mono text-white mb-8 tracking-wider">
                  <div className="relative inline-block">
                    <span className="absolute inset-0 text-cyan-400 blur-md animate-pulse"></span>
                    <span className="relative">SAATHI</span>
                  </div>
                </h1>
                
                <div className="font-mono text-2xl md:text-4xl text-cyan-300 mb-8">
                  <span className="text-purple-400">&gt;</span> NEURAL_INTERFACE_v2.1
                  <span className="ml-4 text-green-400 animate-pulse">█</span>
                </div>

                <div className="max-w-4xl mx-auto font-mono text-lg text-cyan-100 leading-relaxed mb-12 text-left bg-black/70 p-6 border border-cyan-500/30">
                  <div className="text-cyan-400">&gt; System Status:</div>
                  <div className="text-green-400">&nbsp;&nbsp;Neural pathways: <span className="text-white">SYNCHRONIZED</span></div>
                  <div className="text-purple-400">&nbsp;&nbsp;Consciousness matrix: <span className="text-white">OPTIMIZED</span></div>
                  <div className="text-cyan-400">&nbsp;&nbsp;Quantum processing: <span className="text-white">ACTIVE</span></div>
                  <div className="text-orange-400">&nbsp;&nbsp;Mental wellness protocols: <span className="text-white">INITIALIZED</span></div>
                </div>
              </div>

              {/* Cyberpunk Action Buttons */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-20">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-cyan-400 blur opacity-50 group-hover:opacity-100 transition-all duration-300"></div>
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="relative bg-black border-2 border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 hover:text-cyan-300 px-16 py-8 text-xl font-mono font-bold transition-all duration-300 transform group-hover:scale-105"
                  >
                    <span className="flex items-center">
                      &gt; JACK_IN_NOW
                      <Activity className="ml-3 h-6 w-6 animate-pulse" />
                    </span>
                  </Button>
                </div>

                <div className="relative group">
                  <Button
                    variant="outline"
                    className="bg-black/80 border-2 border-purple-500 hover:border-purple-400 text-purple-400 hover:text-purple-300 px-16 py-8 text-xl font-mono font-bold transition-all duration-300"
                  >
                    <span className="flex items-center">
                      &gt; RUN_DIAGNOSTICS
                      <Play className="ml-3 h-6 w-6" />
                    </span>
                  </Button>
                </div>
              </div>

              {/* System Metrics Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                  { value: "99.7%", label: "NEURAL_ACCURACY", unit: "PCT", color: "cyan" },
                  { value: "15.2M", label: "DATA_NODES", unit: "OPS", color: "purple" },
                  { value: "0.7ms", label: "LATENCY", unit: "MS", color: "green" },
                  { value: "∞", label: "LEARNING_RATE", unit: "INF", color: "orange" }
                ].map((metric, index) => (
                  <div key={index} className="bg-black/90 border border-slate-600 hover:border-cyan-400/50 p-4 transition-all duration-300 group">
                    <div className="font-mono text-xs text-slate-500 mb-1">
                      [{metric.unit}]
                    </div>
                    <div className={`font-mono text-2xl font-black text-${metric.color}-400 mb-1`}>
                      {metric.value}
                    </div>
                    <div className="font-mono text-xs text-slate-400 uppercase">
                      {metric.label}
                    </div>
                    <div className="mt-2 h-1 bg-slate-800">
                      <div className={`h-full bg-${metric.color}-400 w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cyberpunk Features Terminal */}
          <div className="relative z-10 py-32 bg-gradient-to-b from-transparent to-black/95">
            <div className="max-w-7xl mx-auto px-4">
              
              {/* Terminal Header */}
              <div className="text-center mb-20">
                <div className="font-mono text-cyan-400 text-lg mb-8">
                  &gt; Loading system modules...
                </div>
                <h2 className="text-5xl md:text-6xl font-black font-mono text-white mb-6">
                  NEURAL_CAPABILITIES.SYS
                </h2>
              </div>

              {/* Feature Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {darkFeatures.map((feature, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-black/90 border border-slate-600 hover:border-cyan-400/50 p-6 transition-all duration-300 backdrop-blur-md">
                      
                      {/* Module Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-4`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-mono font-bold text-cyan-300 text-lg">
                              {feature.title}
                            </h3>
                            <div className="font-mono text-xs text-slate-500">
                              Module ID: {feature.code}
                            </div>
                          </div>
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                          [LOADED]
                        </div>
                      </div>

                      {/* Module Description */}
                      <p className="font-mono text-slate-400 text-sm leading-relaxed mb-4">
                        &gt; {feature.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="h-2 bg-slate-800 mb-2">
                        <div className={`h-full bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-1000`}></div>
                      </div>
                      <div className="font-mono text-xs text-slate-500">
                        Status: OPERATIONAL
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal Footer */}
              <div className="text-center mt-20">
                <div className="relative inline-block">
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="bg-black/90 border-2 border-green-400 hover:bg-green-400/10 text-green-400 hover:text-green-300 px-20 py-8 text-xl font-mono font-bold transition-all duration-300"
                  >
                    &gt; ACTIVATE_ALL_MODULES
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Cyberpunk Footer */}
          <footer className="relative z-10 bg-black/95 py-16 border-t border-cyan-500">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="font-mono text-cyan-400 mb-4">
                &gt; SAATHI_QUANTUM_TECHNOLOGIES
              </div>
              <div className="font-mono text-slate-500 text-sm">
                © 2025 // NEURAL_INTERFACE_DIVISION // ALL_SYSTEMS_OPERATIONAL
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  } else {
    // ============= LIGHT THEME: CLEAN MINIMALIST WELLNESS DESIGN =============
    return (
      <>
        {/* Enhanced Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 z-50 backdrop-blur-2xl flex items-center justify-center bg-white/90">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-3xl rounded-2xl p-8 border border-slate-300/50 max-w-md w-full mx-4 shadow-2xl">
                <button 
                  onClick={() => setShowAuth(false)}
                  className="absolute top-4 right-4 text-slate-600 hover:text-black transition-colors duration-300 z-10"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors duration-300">
                    ✕
                  </div>
                </button>
                <EnhancedAuth />
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          
          {/* Peaceful Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            style={{ filter: "brightness(1.2) saturate(0.9)" }}
          >
            <source src="/Videos/A_breathtaking_waterfall_cascades_dramatically_down_a_rugged_clif_921805d3-52ef-4963-86d6-f5b190b664a1.mp4" type="video/mp4" />
          </video>

          {/* Soft Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/40 to-purple-50/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30"></div>

          {/* Gentle Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${4 + Math.random() * 3}s`
                }}
              />
            ))}
            
            {/* Soft Mouse Interaction */}
            <div 
              className="absolute w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl transition-all duration-500"
              style={{
                left: mousePosition.x - 160,
                top: mousePosition.y - 160,
              }}
            ></div>
          </div>

          {/* Navigation */}
          <div className="relative z-20">
            <NavigationHeader 
              showAuthButtons={true}
              onAuthClick={() => setShowAuth(true)}
            />
          </div>

          {/* MINIMALIST HERO SECTION */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="max-w-6xl mx-auto w-full text-center">
              
              {/* Wellness Badge */}
              <div className="mb-12">
                <div className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-xl rounded-full border border-blue-200/50 shadow-lg">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-slate-700 text-sm font-semibold tracking-wide">
                    AI-Powered Mental Wellness
                  </span>
                  <div className="ml-4 px-4 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                    <span className="text-emerald-700 text-xs font-semibold">Available 24/7</span>
                  </div>
                </div>
              </div>

              {/* Beautiful Main Title */}
              <div className="mb-16">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-slate-800 mb-8 tracking-tight">
                  <span className="font-extralight">Saathi</span>
                </h1>
                
                <div className="text-2xl md:text-4xl lg:text-5xl font-light text-slate-600 mb-8">
                  Your Compassionate
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium ml-3">
                    AI Wellness Friend
                  </span>
                </div>

                <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
                  Experience the gentle power of artificial intelligence designed to understand, support, and nurture your mental well-being. 
                  Our compassionate AI companion provides personalized care that adapts to your unique emotional needs.
                </p>
              </div>

              {/* Elegant Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <Button
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <Heart className="mr-3 h-5 w-5" />
                    Start Your Wellness Journey
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/80 hover:bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-12 py-6 text-lg font-medium rounded-2xl backdrop-blur-xl shadow-lg transition-all duration-300"
                >
                  <span className="flex items-center">
                    <Play className="mr-3 h-5 w-5" />
                    Watch Demo
                  </span>
                </Button>
              </div>

              {/* Wellness Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
                {[
                  { value: "10M+", label: "Lives Touched", icon: Heart, color: "from-pink-400 to-rose-400" },
                  { value: "99.8%", label: "Satisfaction", icon: Zap, color: "from-yellow-400 to-orange-400" },
                  { value: "24/7", label: "Always Here", icon: Shield, color: "from-blue-400 to-cyan-400" },
                  { value: "150+", label: "Countries", icon: Globe, color: "from-green-400 to-emerald-400" }
                ].map((metric, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800 mb-2">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wellness Features Section */}
          <div className="relative z-10 py-32 bg-gradient-to-b from-transparent to-white/80">
            <div className="max-w-7xl mx-auto px-4">
              
              {/* Section Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-8">
                  <Zap className="mr-3 h-5 w-5 text-purple-600" />
                  <span className="text-slate-700 text-sm font-semibold">
                    Wellness Features
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6">
                  Designed for Your Well-being
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Every feature is thoughtfully crafted to support your mental health journey with care and compassion
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lightFeatures.map((feature, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      
                      {/* Feature Header */}
                      <div className="flex items-start mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                            {feature.title}
                          </h3>
                          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${feature.gradient} bg-opacity-20 rounded-full`}>
                            <span className="text-sm font-medium text-slate-700">
                              {feature.benefit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feature Description */}
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>

                      {/* Subtle Progress Indicator */}
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-1000 rounded-full`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-20">
                <Button
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-6 text-xl font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <Heart className="mr-3 h-6 w-6" />
                    Begin Your Wellness Journey
                    <Zap className="ml-3 h-6 w-6" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Clean Footer */}
          <footer className="relative z-10 bg-gradient-to-t from-white to-transparent py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-light text-slate-800">
                  Saathi
                </span>
              </div>
              
              <p className="text-slate-600 mb-8 text-lg">
                Your compassionate AI wellness companion
              </p>
              
              <div className="flex justify-center space-x-8 mb-8 text-sm text-slate-500">
                <span className="flex items-center"><Shield className="w-4 h-4 mr-2" />Privacy First</span>
                <span className="flex items-center"><Globe className="w-4 h-4 mr-2" />Globally Accessible</span>
                <span className="flex items-center"><Heart className="w-4 h-4 mr-2" />Always Caring</span>
              </div>
              
              <p className="text-sm text-slate-500">
                © 2025 Saathi Wellness Technologies. Made with love for mental health.
              </p>
            </div>
          </footer>
        </div>
      </>
    );
  }
};

export default Landing;
