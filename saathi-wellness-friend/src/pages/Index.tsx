import React, { useEffect, useState } from "react";
import { 
  User,
  MessageCircle,
  Shield,
  Heart,
  Mic,
  TrendingUp,
  Music,
  Calendar,
  Bot,
} from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const Index: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Chat",
      description: "24/7 mental health companion with intelligent responses tailored to your needs.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Express yourself naturally with advanced voice recognition and emotional analysis.",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your mental wellness journey with detailed insights and analytics.",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: Music,
      title: "Therapeutic Music",
      description: "Curated playlists and soundscapes designed to enhance your mood and relaxation.",
      gradient: "from-orange-500 to-yellow-400"
    },
    {
      icon: Calendar,
      title: "Daily Check-ins",
      description: "Build healthy habits with personalized daily wellness assessments.",
      gradient: "from-indigo-500 to-blue-400"
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are encrypted and completely confidential.",
      gradient: "from-red-500 to-pink-400"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: User },
    { number: "1M+", label: "Conversations", icon: MessageCircle },
    { number: "98%", label: "Satisfaction Rate", icon: Heart },
    { number: "24/7", label: "Available Support", icon: Bot }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background Based on Theme */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-1000"
        style={{
          backgroundImage: theme === 'light' 
            ? `url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')`
            : `url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')`
        }}
      >
        {/* Dynamic overlay based on theme */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'light'
            ? 'bg-gradient-to-b from-white/20 via-white/10 to-white/30'
            : 'bg-gradient-to-b from-slate-900/30 via-slate-900/20 to-slate-900/40'
        }`}></div>
      </div>

      {/* Navigation Header - Fixed */}
      <div className="fixed top-2 left-0 right-0 z-50">
        <NavigationHeader 
          userName={currentUser?.displayName || 'Friend'}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center z-10 pt-16">

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-32">
          <div 
            className="transform transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-colors duration-1000 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Saathi</span>
            </h1>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light mb-8 transition-colors duration-1000 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
            }`}>
              Your AI-powered companion for mental wellness, offering a safe space to talk,
              personalized guidance, and tools to nurture your mind.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center transition-colors duration-1000 ${
            theme === 'light' ? 'border-gray-600/50' : 'border-white/30'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 animate-pulse transition-colors duration-1000 ${
              theme === 'light' ? 'bg-gray-600/70' : 'bg-white/50'
            }`}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-1000 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Powerful Features for Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Wellness</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto transition-colors duration-1000 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Discover a comprehensive suite of AI-powered tools designed to support your mental health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 transform hover:scale-105 ${
                  theme === 'light' 
                    ? 'bg-white/20 border-white/30 hover:border-white/50 hover:bg-white/30' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-1000 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>{feature.title}</h3>
                <p className={`leading-relaxed transition-colors duration-1000 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`backdrop-blur-xl rounded-3xl p-12 border transition-all duration-1000 ${
            theme === 'light' 
              ? 'bg-white/20 border-white/30' 
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-3xl md:text-4xl font-bold mb-2 transition-colors duration-1000 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>{stat.number}</div>
                  <div className={`text-sm transition-colors duration-1000 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                  }`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-1000 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Ready to Start Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Wellness Journey?</span>
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto transition-colors duration-1000 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Join thousands of users who have transformed their mental health with Saathi's AI-powered support system.
          </p>
        </div>
      </section>

      {/* Google Cloud Translation API indicator - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`backdrop-blur-md rounded-full px-4 py-2 border flex items-center space-x-2 transition-all duration-300 ${
          theme === 'light'
            ? 'bg-green-500/30 border-green-400/50 hover:bg-green-500/40'
            : 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30'
        }`}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className={`text-sm font-medium transition-colors duration-1000 ${
            theme === 'light' ? 'text-green-800' : 'text-green-100'
          }`}>Google Cloud Translation API</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;