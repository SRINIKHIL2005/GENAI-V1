import React, { useState, useEffect, useRef } from "react";
import { getVideoPath } from "@/utils/assets";
import {
  Heart,
  Sun,
  CheckCircle,
  ArrowRight,
  Shield,
  MessageCircle,
  Target,
  Award,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCarousel from "@/components/VideoCarousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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

  const saathiProcedure = [
    {
      step: "1",
      title: "Welcome & Assessment",
      description:
        "Complete your free personalized wellness assessment in just 3 minutes",
      icon: Heart,
      color: "rose",
      features: ["100% Free", "No Credit Card Required", "Privacy Protected"],
      duration: "3 min",
    },
    {
      step: "2",
      title: "AI Companion Setup",
      description:
        "Meet your personal AI wellness companion, customized to your needs",
      icon: MessageCircle,
      color: "blue",
      features: ["24/7 Availability", "Multilingual Support", "Adaptive Learning"],
      duration: "5 min",
    },
    {
      step: "3",
      title: "Personalized Plan",
      description:
        "Receive your custom wellness plan with guided activities and goals",
      icon: Target,
      color: "emerald",
      features: ["Evidence-Based", "Flexible Schedule", "Progress Tracking"],
      duration: "Ongoing",
    },
    {
      step: "4",
      title: "Continuous Growth",
      description:
        "Track progress, celebrate milestones, and achieve lasting wellness",
      icon: Award,
      color: "purple",
      features: ["Real-time Insights", "Achievement System", "Community Support"],
      duration: "Lifetime",
    },
  ];

  const saathiFeatures = [
    {
      title: "Free Forever",
      description:
        "Complete access to all wellness features at absolutely no cost. No hidden fees, no premium tiers, no credit card required.",
      icon: CheckCircle,
      highlight: "100% Free",
      details: ["All Features Included", "No Time Limits", "No Ads", "Privacy First"],
    },
    {
      title: "AI-Powered Conversations",
      description:
        "Engage with your intelligent wellness companion that learns and adapts to provide personalized mental health support.",
      icon: MessageCircle,
      highlight: "24/7 Available",
      details: [
        "Natural Language Processing",
        "Emotional Intelligence",
        "Contextual Memory",
        "Multilingual Support",
      ],
    },
    {
      title: "Evidence-Based Approach",
      description:
        "All recommendations are based on proven psychological techniques and wellness research for effective mental health support.",
      icon: Shield,
      highlight: "Scientifically Proven",
      details: [
        "CBT Techniques",
        "Mindfulness Practices",
        "Progress Tracking",
        "Personalized Insights",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-all duration-1000 ease-out ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover pointer-events-none"
        style={{ filter: "brightness(1.05)", objectPosition: "center center" }}
      >
        <source
          src={getVideoPath("7385122-uhd_3840_2160_30fps.mp4") + "?v=hires"}
          type="video/mp4"
        />
      </video>

      {/* Navigation */}
      <div className="relative z-20">
        <NavigationHeader
          showAuthButtons={true}
          onAuthClick={() => navigate("/auth")}
        />
  {/* Removed extra top gradient to eliminate visible gap between navbar and video */}
      </div>

      {/* Hero Section */}
      <section
  className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-0 pb-0"
        style={{ contain: "paint layout" }}
      >
        <div className="relative z-20 max-w-6xl mx-auto text-center">
          <div
            className={`mb-4 -mt-10 md:-mt-12 lg:-mt-14 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full border border-green-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible leading-none">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-slate-700 text-xs font-semibold tracking-wide">
                100% Free AI Mental Wellness Platform
              </span>
              <div className="ml-2 px-2 py-0.5 bg-green-100 rounded-full">
                <span className="text-green-700 text-[10px] font-semibold">Forever Free</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl bg-white/40 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl shadow-black/10 p-10 md:p-12 lg:p-14 -mt-20 mb-0 relative overflow-hidden hover:bg-white/45 transition-all duration-300">
            <div className="relative z-10">
              <h1
                className={`text-6xl md:text-8xl lg:text-9xl font-extralight text-slate-800 mb-6 tracking-tight transition-all duration-1000 ${
                  isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <span className="bg-gradient-to-r from-slate-800 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  Saathi
                </span>
              </h1>

              <h2
                className={`text-xl md:text-3xl lg:text-4xl text-slate-600 font-light mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
                  isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                Your completely
                <span className="text-green-600 font-medium"> free wellness companion</span> for
                <span className="text-blue-600 font-medium"> lifelong mental health</span>
              </h2>

              <div
                className={`flex flex-wrap items-center justify-center gap-3 mb-8 transition-all duration-1000 delay-300 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {["100% Free Forever", "No Credit Card", "Privacy Protected", "24/7 AI Support"].map(
                  (b, i) => (
                    <div
                      key={b}
                      className="px-4 py-2 bg-white/70 border border-white/50 rounded-full text-sm text-slate-700 shadow-md backdrop-blur-sm hover:bg-white/80 hover:scale-105 transition-all duration-300"
                      style={{
                        transitionDelay: `${0.4 + i * 0.1}s`,
                        opacity: isLoaded ? 1 : 0,
                        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                      }}
                    >
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1 inline" />
                      {b}
                    </div>
                  )
                )}
              </div>

              <div
                className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 transition-all duration-1000 delay-500 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-green-500 via-green-600 to-blue-500 hover:from-green-600 hover:via-green-700 hover:to-blue-600 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 group overflow-visible leading-none"
                >
                  <CheckCircle className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free - No Card Required
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/80 hover:bg-white border-2 border-white/60 hover:border-white text-slate-700 hover:text-slate-800 px-12 py-6 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group overflow-visible leading-none"
                  onClick={() => {
                    const procedureSection = document.querySelector(
                      '[data-section="procedure"]'
                    );
                    procedureSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saathi Procedure Section */}
      <section
        className="relative z-10 -mt-10 pt-20 pb-32"
        style={{ contain: "paint" }}
        data-section="procedure"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-100/95 to-blue-200/90 backdrop-blur-sm pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="mx-auto max-w-6xl bg-blue-500/20 backdrop-blur-xl rounded-3xl border border-blue-300/40 shadow-2xl shadow-blue-500/10 p-8 md:p-12 lg:p-16 relative overflow-hidden hover:bg-blue-500/25 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-200/10 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/10 to-transparent rounded-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-24">
                <div className="inline-flex items-center px-8 py-4 bg-blue-600/90 border-2 border-blue-500/60 rounded-full mb-12 shadow-2xl backdrop-blur-md hover:bg-blue-700/95 transition-all duration-300">
                  <CheckCircle className="mr-3 h-6 w-6 text-white" />
                  <span className="text-white text-base font-semibold">100% Free Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6">
                  How Saathi Works
                </h2>
                <p className="text-xl text-slate-700 max-w-3xl mx-auto font-light">
                  Your completely free journey to mental wellness starts here - no cost, no commitments, just care
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {saathiProcedure.map((step, index) => (
                  <div key={index} className="text-center group will-change-transform">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r from-${step.color}-400 to-${step.color}-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-6xl font-light text-slate-700 mb-4">{step.step}</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                    <p className="text-slate-600 font-light leading-relaxed mb-4">{step.description}</p>

                    <div className="inline-flex items-center px-3 py-1 bg-slate-100/80 rounded-full mb-4">
                      <span className="text-slate-700 text-xs font-medium">{step.duration}</span>
                    </div>

                    <div className="space-y-1">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-slate-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative z-10 pt-20 pb-24 -mt-10"
        style={{ contain: "paint" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-100/95 to-blue-200/90 backdrop-blur-md pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="mx-auto">
            <VideoCarousel isDark={false} />
          </div>
        </div>
      </section>

      {/* Saathi Features Section */}
      <section className="relative z-10 py-32" style={{ contain: "paint" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-100/95 to-blue-200/90 backdrop-blur-md pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="mx-auto bg-blue-500/20 backdrop-blur-xl rounded-3xl border border-blue-300/40 shadow-2xl shadow-blue-500/10 p-8 md:p-12 lg:p-16 relative overflow-hidden hover:bg-blue-500/25 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-200/10 rounded-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-blue-100/80 rounded-full mb-8">
                  <Shield className="mr-3 h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 text-sm font-semibold">Why Choose Saathi</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6">
                  Everything You Need, Completely Free
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
                  Professional-grade mental wellness tools at no cost - our commitment to your wellbeing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {saathiFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/85 rounded-3xl p-8 border border-white/70 shadow-md hover:shadow-lg transition-all duration-300 will-change-transform hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 font-light text-center">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Free CTA Section */}
      <section className="relative z-10 py-32" style={{ contain: "paint" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-100/95 to-blue-200/90 backdrop-blur-md pointer-events-none z-0" />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <div className="mx-auto bg-blue-500/20 backdrop-blur-xl rounded-3xl border border-blue-300/40 shadow-2xl shadow-blue-500/10 p-8 md:p-12 lg:p-16 relative overflow-hidden hover:bg-blue-500/25 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-200/10 rounded-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 border border-slate-200/50 shadow-lg">
                <div className="inline-flex items-center px-6 py-3 bg-green-100/80 border border-green-300/50 rounded-full mb-8">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                  <span className="text-green-700 text-sm font-semibold">100% Free Forever</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-8">
                  Start Your Free Wellness Journey
                </h2>
                <p className="text-xl text-slate-600 mb-12 font-light max-w-2xl mx-auto">
                  Join thousands who have transformed their mental health with Saathi - completely free, no strings attached
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-6 text-xl font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    <CheckCircle className="mr-4 h-6 w-6" />
                    Get Started - Completely Free
                    <ArrowRight className="ml-4 h-6 w-6" />
                  </Button>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        No Credit Card
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        No Time Limits
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Full Features
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-md py-16 border-t border-slate-200/30 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-light text-slate-800">Saathi</span>
            <div className="px-3 py-1 bg-green-100/80 rounded-full border border-green-300/50">
              <span className="text-green-700 text-xs font-semibold">FREE</span>
            </div>
          </div>
          <p className="text-slate-600 mb-8 text-lg font-light">
            Your completely free AI wellness companion - no cost, no limits, just care
          </p>
          <div className="flex justify-center space-x-8 mb-8 text-sm text-slate-500">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              100% Free Forever
            </span>
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-slate-500" />
              Privacy Protected
            </span>
            <span className="flex items-center">
              <Sun className="w-4 h-4 mr-2 text-slate-500" />
              Always Available
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-slate-500" />
              Evidence-Based
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 Saathi Wellness Technologies. Free mental health support for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LightLanding;
