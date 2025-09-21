import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Zap, 
  ArrowRight, 
  Play,
  Activity,
  MessageCircle,
  Mic,
  BarChart3,
  Shield,
  Globe
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

  const features = [
    {
      icon: MessageCircle,
      title: "Neural Chat Engine",
      description: "Advanced conversational AI with emotional intelligence and therapeutic response capabilities.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: Mic,
      title: "Voice Synthesis",
      description: "Natural voice interaction with real-time sentiment analysis and therapeutic guidance.",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: BarChart3,
      title: "Quantum Analytics",
      description: "Deep learning insights into mental health patterns with predictive wellness modeling.",
      gradient: "from-emerald-500 to-teal-400"
    },
    {
      icon: Heart,
      title: "Consciousness Mapping",
      description: "Revolutionary AI consciousness modeling for unprecedented therapeutic breakthroughs.",
      gradient: "from-orange-500 to-red-400"
    }
  ];

  return (
    <>
      {/* Revolutionary Authentication Modal - theme responsive */}
      {showAuth && (
        <div className={`fixed inset-0 z-50 backdrop-blur-2xl flex items-center justify-center transition-all duration-500 ${
          theme === "light" ? "bg-white/90" : "bg-black/90"
        }`}>
          <div className="relative">
            {/* Holographic glow around modal - theme adaptive */}
            <div className={`absolute -inset-4 rounded-3xl blur-xl animate-pulse transition-all duration-1000 ${
              theme === "light" 
                ? "bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-cyan-400/40" 
                : "bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30"
            }`}></div>
            <div className={`relative backdrop-blur-3xl rounded-2xl p-8 border max-w-md w-full mx-4 shadow-2xl transition-all duration-1000 ${
              theme === "light"
                ? "bg-gradient-to-br from-white/95 to-blue-50/95 border-slate-300/50"
                : "bg-gradient-to-br from-slate-900/95 to-black/95 border-slate-700/50"
            }`}>
              <button 
                onClick={() => setShowAuth(false)}
                className={`absolute top-4 right-4 transition-colors duration-300 z-10 ${
                  theme === "light" ? "text-slate-600 hover:text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  theme === "light" ? "hover:bg-slate-200/50" : "hover:bg-slate-800/50"
                }`}>
                  ✕
                </div>
              </button>
              <EnhancedAuth />
            </div>
          </div>
        </div>
      )}

      {/* Main Revolutionary Container - theme responsive */}
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        theme === "light" ? "bg-blue-50" : "bg-black"
      }`}>
        {/* Dynamic video background based on theme */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video 
            key={theme}
            autoPlay 
            muted 
            loop 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'brightness(1.5) contrast(1.2) saturate(1.2)'
            }}
          >
            <source 
              src={theme === "light" 
                ? "/Videos/A_breathtaking_waterfall_cascades_dramatically_down_a_rugged_clif_921805d3-52ef-4963-86d6-f5b190b664a1.mp4" 
                : "/Videos/solar_system_journey.mp4"
              } 
              type="video/mp4" 
            />
            {/* Fallback for browsers that don't support MP4 */}
            Your browser does not support the video tag.
          </video>
          {/* Advanced overlay system - theme responsive */}
          <div className={`absolute inset-0 transition-all duration-1000 ${
            theme === "light" 
              ? "bg-gradient-to-br from-white/20 via-blue-900/30 to-black/60" 
              : "bg-gradient-to-br from-black/70 via-black/50 to-black/80"
          }`}></div>
          <div className={`absolute inset-0 transition-all duration-1000 ${
            theme === "light"
              ? "bg-gradient-to-t from-black/40 via-transparent to-white/10"
              : "bg-gradient-to-t from-black/60 via-transparent to-black/30"
          }`}></div>
        </div>

        {/* Interactive particle system that follows mouse */}
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
          ></div>
          <div 
            className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl transition-all duration-700 ease-out"
            style={{
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
            }}
          ></div>
        </div>

        {/* Navigation - keeping your original */}
        <div className="relative z-20">
          <NavigationHeader 
            showAuthButtons={true}
            onAuthClick={() => setShowAuth(true)}
          />
        </div>

        {/* REVOLUTIONARY HERO SECTION */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Quantum Status Display - theme responsive */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center px-8 py-4 backdrop-blur-2xl border rounded-full group hover:border-cyan-500/50 transition-all duration-1000 ${
                theme === "light"
                  ? "bg-gradient-to-r from-white/60 via-blue-50/70 to-white/60 border-slate-300/30"
                  : "bg-gradient-to-r from-black/60 via-slate-900/70 to-black/60 border-slate-700/30"
              }`}>
                <div className="relative mr-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                  <div className="absolute -inset-2 w-7 h-7 border border-emerald-400/20 rounded-full animate-pulse"></div>
                </div>
                <span className={`text-sm font-bold tracking-[0.3em] uppercase transition-colors duration-1000 ${
                  theme === "light" ? "text-slate-700" : "text-white/90"
                }`}>
                  QUANTUM NEURAL NETWORK
                </span>
                <div className="ml-4 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                  <span className="text-emerald-300 text-xs font-semibold">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Revolutionary Main Title */}
            <div className="text-center mb-16">
              <h1 className="relative group">
                <div className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6">
                  {/* Holographic text effect */}
                  <div className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent blur-sm opacity-50"></span>
                    <span className="relative bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                      SAATHI
                    </span>
                    {/* Dynamic underline */}
                    <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-80 animate-gradient"></div>
                  </div>
                </div>
                
                <div className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-8 animate-float transition-colors duration-1000 ${
                  theme === "light" ? "text-slate-700" : "text-slate-300"
                }`}>
                  <span className="inline-block animate-float">The Future of</span>{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-black">
                      Mental Wellness
                    </span>
                    <Zap className="inline-block ml-2 h-8 w-8 text-yellow-400 animate-pulse" />
                  </span>
                </div>

                <p className={`text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-12 transition-colors duration-1000 ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}>
                  Experience revolutionary AI consciousness that transcends traditional therapy. 
                  Our quantum neural networks provide{" "}
                  <span className="text-cyan-300 font-semibold">unprecedented emotional intelligence</span>,{" "}
                  <span className="text-blue-300 font-semibold">real-time therapeutic adaptation</span>, and{" "}
                  <span className="text-purple-300 font-semibold">personalized wellness evolution</span>.
                </p>
              </h1>
            </div>

            {/* Revolutionary CTA Section */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-20">
              {/* Primary Quantum Button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 group-hover:blur-xl transition-all duration-1000 animate-gradient"></div>
                <Button
                  onClick={() => setShowAuth(true)}
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-500 transform group-hover:scale-110 shadow-2xl border-0"
                >
                  <span className="flex items-center">
                    <Activity className="mr-3 h-6 w-6 animate-pulse" />
                    ENTER QUANTUM REALM
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
                </Button>
              </div>

              {/* Secondary Holographic Button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-30 group-hover:opacity-70 transition-all duration-500"></div>
                <Button
                  variant="outline"
                  className="relative bg-black/40 hover:bg-black/60 border-2 border-slate-500/50 hover:border-cyan-400/60 text-white hover:text-cyan-300 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-xl transition-all duration-500 transform group-hover:scale-105"
                >
                  <span className="flex items-center">
                    <Play className="mr-3 h-6 w-6" />
                    EXPERIENCE DEMO
                  </span>
                </Button>
              </div>
            </div>

            {/* Quantum Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              {[
                { value: "99.7%", label: "Neural Precision", color: "from-blue-400 to-cyan-400" },
                { value: "15.2M", label: "Quantum Patterns", color: "from-purple-400 to-pink-400" },
                { value: "7ms", label: "Consciousness Speed", color: "from-emerald-400 to-teal-400" },
                { value: "∞", label: "Adaptive Learning", color: "from-orange-400 to-red-400" }
              ].map((metric, index) => (
                <div key={index} className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-700`}></div>
                  <div className={`relative backdrop-blur-xl border rounded-2xl p-6 group-hover:border-slate-500/60 transition-all duration-500 transform group-hover:scale-105 ${
                    theme === "light"
                      ? "bg-white/50 border-slate-300/40"
                      : "bg-black/50 border-slate-700/40"
                  }`}>
                    <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                      {metric.value}
                    </div>
                    <div className={`text-sm font-medium uppercase tracking-widest transition-colors duration-1000 ${
                      theme === "light" ? "text-slate-600" : "text-slate-400"
                    }`}>
                      {metric.label}
                    </div>
                    <div className={`mt-3 h-1 rounded-full overflow-hidden ${
                      theme === "light" ? "bg-slate-300" : "bg-slate-800"
                    }`}>
                      <div className={`h-full bg-gradient-to-r ${metric.color} rounded-full w-full animate-pulse`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revolutionary Features Section */}
        <div className={`relative z-10 py-32 transition-all duration-1000 ${
          theme === "light" 
            ? "bg-gradient-to-b from-transparent via-slate-100/30 to-slate-200/60" 
            : "bg-gradient-to-b from-transparent via-black/30 to-black/60"
        }`}>
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className={`inline-flex items-center px-6 py-3 backdrop-blur-xl border rounded-full mb-8 ${
                theme === "light"
                  ? "bg-gradient-to-r from-slate-100/60 to-white/60 border-slate-300/40"
                  : "bg-gradient-to-r from-slate-900/60 to-black/60 border-slate-700/40"
              }`}>
                <Activity className="mr-3 h-5 w-5 text-cyan-400" />
                <span className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-1000 ${
                  theme === "light" ? "text-slate-700" : "text-slate-300"
                }`}>
                  Quantum Capabilities
                </span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-black mb-6 transition-colors duration-1000 ${
                theme === "light" ? "text-slate-800" : "text-white"
              }`}>
                Beyond Human Imagination
              </h2>
              <p className={`text-xl max-w-3xl mx-auto transition-colors duration-1000 ${
                theme === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Revolutionary AI technologies that redefine the boundaries of mental health support
              </p>
            </div>

            {/* Advanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="relative group">
                  {/* Holographic background */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-1000`}></div>
                  
                  {/* Main card */}
                  <div className={`relative backdrop-blur-2xl border rounded-3xl p-8 group-hover:border-slate-500/60 transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-2 ${
                    theme === "light"
                      ? "bg-gradient-to-br from-white/60 via-slate-50/40 to-white/70 border-slate-300/30"
                      : "bg-gradient-to-br from-black/60 via-slate-900/40 to-black/70 border-slate-700/30"
                  }`}>
                    
                    {/* Floating icon container */}
                    <div className="relative mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                        <feature.icon className="h-10 w-10 text-white" />
                      </div>
                      {/* Icon glow effect */}
                      <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
                    </div>

                    {/* Content */}
                    <h3 className={`text-2xl font-bold mb-4 group-hover:bg-gradient-to-r group-hover:${feature.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 ${
                      theme === "light" ? "text-slate-700" : "text-white"
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed group-hover:text-slate-300 transition-colors duration-500 ${
                      theme === "light" ? "text-slate-600" : "text-slate-400"
                    }`}>
                      {feature.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-6 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full w-0 group-hover:w-full transition-all duration-1500 delay-200`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">
              <div className="relative group inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-1000"></div>
                <Button
                  onClick={() => setShowAuth(true)}
                  className="relative bg-gradient-to-r from-slate-900/80 to-black/80 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-400/60 text-white px-16 py-6 text-xl font-bold rounded-2xl transition-all duration-500 transform group-hover:scale-110"
                >
                  <span className="flex items-center">
                    <Activity className="mr-3 h-6 w-6 animate-pulse" />
                    ACTIVATE CONSCIOUSNESS
                    <Zap className="ml-3 h-6 w-6 text-yellow-400" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Footer */}
        <footer className={`relative z-10 py-16 border-t transition-all duration-1000 ${
          theme === "light" 
            ? "bg-gradient-to-t from-slate-100/90 to-transparent border-slate-300/50" 
            : "bg-gradient-to-t from-black/90 to-transparent border-slate-800/50"
        }`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <span className={`text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
                theme === "light" ? "from-slate-700 to-slate-500" : "from-white to-slate-300"
              }`}>
                SAATHI
              </span>
            </div>
            
            <p className={`mb-8 text-lg transition-colors duration-1000 ${
              theme === "light" ? "text-slate-600" : "text-slate-400"
            }`}>
              The quantum leap in AI-powered mental wellness
            </p>
            
            <div className={`flex justify-center space-x-8 mb-8 text-sm transition-colors duration-1000 ${
              theme === "light" ? "text-slate-500" : "text-slate-500"
            }`}>
              <span className="flex items-center"><Shield className="w-4 h-4 mr-2" />Quantum Secure</span>
              <span className="flex items-center"><Globe className="w-4 h-4 mr-2" />Universal Access</span>
              <span className="flex items-center"><Heart className="w-4 h-4 mr-2" />Consciousness First</span>
            </div>
            
            <p className={`text-sm transition-colors duration-1000 ${
              theme === "light" ? "text-slate-500" : "text-slate-600"
            }`}>
              © 2025 Saathi Quantum Technologies. Transcending human consciousness.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
