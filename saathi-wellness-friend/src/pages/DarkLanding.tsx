import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Moon,
  Shield,
  User,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import EnhancedAuth from "./EnhancedAuth";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCarousel from "@/components/VideoCarousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";

const DarkLanding: React.FC = () => {
  // Redirect to dedicated auth page instead of modal
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Scroll animations
  const { elementRef: featuresRef } = useScrollAnimation(0.1);
  
  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Working Professional",
      content: "Saathi helped me find peace during my darkest hours. The nighttime support is incredible.",
      rating: 5
    },
    {
      name: "David L.", 
      role: "Student",
      content: "The gentle guidance and privacy made all the difference in my mental health journey.",
      rating: 5
    },
    {
      name: "Maya K.",
      role: "Healthcare Worker", 
      content: "After long shifts, Saathi provides the emotional support I need to decompress and heal.",
      rating: 5
    }
  ];

  return (
    <>
  {/* Auth modal removed in favor of route-based auth page */}

      <div className={`min-h-screen relative overflow-hidden bg-slate-900 transition-all duration-1000 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.4) contrast(1.2)" }}
        >
          <source src="/Videos/solar_system_journey.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/40 to-slate-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/20"></div>
        
        {/* Subtle Starfield */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="relative z-20">
          <NavigationHeader 
            showAuthButtons={true}
            onAuthClick={() => navigate('/auth')}
          />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Status Badge */}
            <div className={`mb-8 ${isLoaded ? 'animate-slide-in-top animate-delay-200' : ''}`}>
              <div className="inline-flex items-center px-6 py-3 bg-slate-800/80 backdrop-blur-xl rounded-full border border-indigo-500/30 shadow-lg">
                <Moon className="w-4 h-4 text-indigo-400 mr-3" />
                <span className="text-slate-300 text-sm font-medium">
                  Your Mental Wellness Sanctuary Awaits
                </span>
                <div className="ml-3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className={`text-7xl md:text-9xl font-extralight text-white mb-6 tracking-tight ${
              isLoaded ? 'animate-slide-in-left animate-delay-400' : ''
            }`}>
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Saathi
              </span>
            </h1>
            
            <h2 className={`text-2xl md:text-4xl text-slate-300 font-light mb-8 max-w-4xl mx-auto leading-relaxed ${
              isLoaded ? 'animate-slide-in-right animate-delay-600' : ''
            }`}>
              Your compassionate AI companion for
              <span className="text-indigo-300 font-medium"> mental wellness</span> and 
              <span className="text-purple-300 font-medium"> emotional healing</span>
            </h2>

            <p className={`text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light ${
              isLoaded ? 'animate-slide-in-bottom animate-delay-800' : ''
            }`}>
              Experience profound support through advanced AI that understands your emotional journey. 
              Available 24/7 to provide gentle guidance when you need it most.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 ${
              isLoaded ? 'animate-scale-in-bounce animate-delay-600' : ''
            }`}>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Heart className="mr-3 h-5 w-5" />
                Begin Your Journey
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-10 py-4 text-lg font-medium rounded-2xl backdrop-blur-xl transition-all duration-300"
              >
                <Moon className="mr-3 h-5 w-5" />
                Explore Features
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "2M+", label: "Lives Touched", icon: User },
                { value: "99.8%", label: "User Satisfaction", icon: CheckCircle },
                { value: "24/7", label: "Always Available", icon: Moon },
                { value: "100%", label: "Private & Secure", icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
                  <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="relative z-10 py-24 bg-gradient-to-b from-transparent to-slate-900/90">
          <VideoCarousel isDark={true} />
        </div>

        {/* Testimonials Section */}
        <div className="relative z-10 py-32">
          <div className="max-w-7xl mx-auto px-4">
            
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Stories of Healing
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Real experiences from people who found peace with Saathi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-indigo-500/20 transition-all duration-300">
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-6 font-light italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 py-32 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto text-center px-4">
            
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
              Ready to Begin Your Healing Journey?
            </h2>
            
            <p className="text-xl text-slate-400 mb-12 font-light">
              Join millions who have found peace, comfort, and growth with Saathi
            </p>

            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              <Heart className="mr-4 h-6 w-6" />
              Start Your Journey Tonight
              <Moon className="ml-4 h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-slate-900/95 py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-light text-white">Saathi</span>
            </div>
            
            <p className="text-slate-400 mb-8 text-lg font-light">
              Your compassionate AI wellness companion, always here for you
            </p>
            
            <div className="flex justify-center space-x-8 mb-8 text-sm text-slate-500">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                End-to-End Encryption
              </span>
              <span className="flex items-center">
                <Moon className="w-4 h-4 mr-2" />
                24/7 Availability
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Evidence-Based Care
              </span>
            </div>
            
            <p className="text-sm text-slate-600">
              © 2025 Saathi Wellness Technologies. Designed with care for mental health.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DarkLanding;
