import React, { useState, useEffect, useRef } from "react";
import { getVideoPath } from '@/utils/assets';
import { 
  Heart, 
  Sun,
  Smile,
  User,
  Globe,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import EnhancedAuth from "./EnhancedAuth";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCarousel from "@/components/VideoCarousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LightLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Scroll animations
  const { elementRef: featuresRef } = useScrollAnimation(0.1);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Slow down waterfall video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  const wellnessJourney = [
    {
      step: "1",
      title: "Connect",
      description: "Begin with a warm, personalized assessment",
      icon: Heart,
      color: "rose"
    },
    {
      step: "2", 
      title: "Discover",
      description: "Explore tools designed for your unique needs",
      icon: Sun,
      color: "amber"
    },
    {
      step: "3",
      title: "Grow",
      description: "Track progress on your wellness journey",
      icon: BarChart3,
      color: "emerald"
    },
    {
      step: "4",
      title: "Thrive", 
      description: "Achieve lasting mental wellness and happiness",
      icon: Smile,
      color: "sky"
    }
  ];

  const successStories = [
    {
      name: "Emma R.",
      role: "Teacher",
      content: "Saathi helped me rediscover joy in my daily life. The morning check-ins became my favorite part of the day.",
      improvement: "Anxiety reduced by 70%",
      timeframe: "3 months"
    },
    {
      name: "Michael S.",
      role: "Engineer", 
      content: "The personalized wellness plan transformed how I handle stress. I feel more balanced and focused than ever.",
      improvement: "Sleep quality improved",
      timeframe: "6 weeks"
    },
    {
      name: "Lisa K.",
      role: "Student",
      content: "Having 24/7 support during exam season was life-changing. Saathi understood exactly what I needed to hear.",
      improvement: "Confidence increased",
      timeframe: "2 months"
    }
  ];

  return (
    <>

  <div className={`min-h-screen relative overflow-x-hidden transition-all duration-1000 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="fixed inset-0 -z-10 w-screen h-screen object-cover will-change-transform pointer-events-none"
          style={{ filter: "brightness(1.05)", transform: 'translateZ(0) translateY(10vh) scale(1.15)', objectPosition: 'center center' }}
        >
          <source src={getVideoPath("7385122-uhd_3840_2160_30fps.mp4") + "?v=hires"} type="video/mp4" />
        </video>

        {/* No global overlays to preserve 4K clarity */}
        
  {/* Removed floating particles for maximum clarity */}

        {/* Navigation */}
        <div className="relative z-20">
          <NavigationHeader 
            showAuthButtons={true}
            onAuthClick={() => navigate('/auth')}
          />
          {/* Seamless fades to avoid seams on various screens */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8" style={{ contain: 'paint layout' }}>
          <div className="relative z-20 max-w-6xl mx-auto text-center">
            {/* Glass bubble wrapper for hero text only */}
            <div className="mx-auto max-w-4xl bg-white/35 backdrop-blur-lg rounded-t-3xl rounded-b-xl border border-white/50 shadow-xl p-8 md:p-12 mt-4">
            
            {/* Wellness Badge */}
            <div className={`mb-8 ${isLoaded ? 'animate-slide-in-top animate-delay-200' : ''}`} style={{ willChange: 'transform, opacity' }}>
              <div className="inline-flex items-center px-8 py-4 bg-white/90 rounded-full border border-emerald-200/60 shadow-md translate-z-0 transition-colors duration-300">
                <Sun className="w-5 h-5 text-amber-500 mr-3" />
                <span className="text-slate-700 text-sm font-semibold tracking-wide">
                  AI-Powered Mental Wellness Platform
                </span>
                <div className="ml-3 px-3 py-1 bg-emerald-100 rounded-full translate-z-0">
                  <span className="text-emerald-700 text-xs font-semibold">Available 24/7</span>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className={`text-7xl md:text-9xl font-extralight text-slate-800 mb-6 tracking-tight translate-z-0 ${
              isLoaded ? 'animate-slide-in-left animate-delay-400' : ''
            }`} style={{ willChange: 'transform, opacity' }}>
              <span className="bg-gradient-to-r from-slate-800 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Saathi
              </span>
            </h1>
            
            <h2 className={`text-2xl md:text-4xl text-slate-600 font-light mb-8 max-w-4xl mx-auto leading-relaxed translate-z-0 ${
              isLoaded ? 'animate-slide-in-right animate-delay-600' : ''
            }`} style={{ willChange: 'transform, opacity' }}>
              Your personal
              <span className="text-emerald-600 font-medium"> wellness companion</span> for a
              <span className="text-sky-600 font-medium"> brighter tomorrow</span>
            </h2>

            {/* paragraph removed to reclaim vertical space for better fit */}

            {/* Benefit Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6 opacity-90">
              {['Guided Meditations', 'Mood Tracking', '24/7 Support', 'Privacy First'].map((b, i) => (
                <div key={b} className="px-4 py-2 bg-white/70 border border-white/60 rounded-full text-sm text-slate-700 shadow-sm translate-z-0" style={{willChange:'transform', animationDelay:`${0.2 + i*0.1}s`}}>
                  {b}
                </div>
              ))}
            </div>

      {/* CTA Buttons */}
  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-12 py-6 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Heart className="mr-3 h-5 w-5" />
                Start Your Wellness Journey
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
        className="bg-white/70 hover:bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-12 py-6 text-lg font-medium rounded-2xl shadow-lg transition-all duration-300"
              >
                <Sun className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto -mt-10 md:-mt-14 lg:-mt-16" style={{ contain: 'paint' }}>
              {[
                { value: "5M+", label: "Lives Enriched", icon: User, color: "emerald-500" },
                { value: "98.9%", label: "Satisfaction Rate", icon: CheckCircle, color: "sky-600" },
                { value: "150+", label: "Countries", icon: Globe, color: "purple-500" },
                { value: "24/7", label: "Support Available", icon: Sun, color: "amber-400" }
              ].map((stat, index) => (
                <div key={index} className="bg-white/90 rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 will-change-transform flex flex-col items-center justify-center text-center h-40 overflow-hidden">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 text-[${stat.color}] group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wellness Journey Section */}
  <div className="relative z-10 py-32" style={{ contain: 'paint' }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-none z-0"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-emerald-100/80 rounded-full mb-8">
                <BarChart3 className="mr-3 h-5 w-5 text-emerald-600" />
                <span className="text-emerald-800 text-sm font-semibold">Your Journey</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Four Steps to Wellness
              </h2>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto font-light">
                A gentle, personalized path to mental wellness designed just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {wellnessJourney.map((step, index) => (
                <div key={index} className="text-center group will-change-transform">
                  <div className={`w-20 h-20 bg-gradient-to-r from-${step.color}-400 to-${step.color}-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className={`text-6xl font-light text-white mb-4`}>{step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-200 font-light leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="relative z-10 py-24" style={{ contain: 'paint' }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-none z-0"></div>
          <div className="relative z-10">
            <VideoCarousel isDark={false} />
          </div>
        </div>

        {/* Success Stories Section */}
  <div className="relative z-10 py-32" style={{ contain: 'paint' }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-none z-0"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-purple-100/80 rounded-full mb-8">
                <Smile className="mr-3 h-5 w-5 text-purple-600" />
                <span className="text-purple-800 text-sm font-semibold">Success Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Transformative Wellness Journeys
              </h2>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto font-light">
                Real people, real progress, real happiness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white/85 rounded-3xl p-8 border border-white/70 shadow-md hover:shadow-lg transition-all duration-300 will-change-transform">
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="w-5 h-5 text-rose-400 fill-current mr-1" />
                    ))}
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-6 font-light italic text-lg">
                    "{story.content}"
                  </p>

                  <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-4 mb-6">
                    <div className="text-emerald-700 font-semibold text-sm">{story.improvement}</div>
                    <div className="text-slate-600 text-sm">in {story.timeframe}</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-lg">
                        {story.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-slate-800 font-semibold">{story.name}</div>
                      <div className="text-slate-600 text-sm">{story.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
  <div className="relative z-10 py-32" style={{ contain: 'paint' }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-none z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            
            <div className="bg-black/60 backdrop-blur-md rounded-3xl p-12 border border-white/30 shadow-lg">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                Ready to Embrace Wellness?
              </h2>
              
              <p className="text-xl text-slate-200 mb-12 font-light max-w-2xl mx-auto">
                Join millions who have discovered peace, joy, and lasting mental wellness with Saathi
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-12 py-6 text-xl font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                >
                  <Sun className="mr-4 h-6 w-6" />
                  Begin Your Journey Today
                  <Heart className="ml-4 h-6 w-6" />
                </Button>

                <div className="text-center">
                  <div className="text-sm text-slate-500">Free 14-day trial</div>
                  <div className="text-sm text-slate-500">No credit card required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-black/60 backdrop-blur-md py-16 border-t border-white/20 text-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-light text-white">Saathi</span>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg font-light">
              Your compassionate AI wellness companion, here to brighten your journey
            </p>
            
            <div className="flex justify-center space-x-8 mb-8 text-sm text-slate-400">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Protected
              </span>
              <span className="flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Always Available
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Evidence-Based
              </span>
            </div>
            
            <p className="text-sm text-slate-400">
              © 2025 Saathi Wellness Technologies. Crafted with love for your mental health.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LightLanding;
