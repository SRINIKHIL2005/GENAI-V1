import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Mic, BarChart3, Shield, ArrowLeft, ArrowRight } from "lucide-react";

interface VideoCarouselProps {
  isDark?: boolean;
}

const features = [
  {
    id: "conversations",
    title: "Mindful Conversations",
    description: "Engage in uplifting dialogues that nurture your spirit and guide you toward mental clarity and emotional balance.",
    video: `${import.meta.env.BASE_URL}Conversation.mp4`,
    icon: MessageCircle,
    gradient: "from-emerald-400 to-teal-500",
    darkGradient: "from-indigo-600 to-purple-700"
  },
  {
    id: "meditations", 
    title: "Guided Meditations",
    description: "Experience personalized meditation sessions that adapt to your mood, helping you find inner peace and tranquility.",
    video: `${import.meta.env.BASE_URL}Meditation.mp4`,
    icon: Mic,
    gradient: "from-blue-400 to-cyan-500", 
    darkGradient: "from-purple-600 to-pink-700"
  },
  {
    id: "insights",
    title: "Wellness Insights", 
    description: "Track your emotional journey with beautiful visualizations that celebrate your progress and growth milestones.",
    video: `${import.meta.env.BASE_URL}Wellness.mp4`,
    icon: BarChart3,
    gradient: "from-purple-400 to-pink-500",
    darkGradient: "from-blue-600 to-indigo-700"
  },
  {
    id: "haven",
    title: "Safe Haven",
    description: "Your personal sanctuary where thoughts and feelings are protected with the highest levels of privacy and care.", 
    video: `${import.meta.env.BASE_URL}Secure.mp4`,
    icon: Shield,
    gradient: "from-orange-400 to-amber-500",
    darkGradient: "from-slate-600 to-blue-700"
  },
];

const VideoCarousel: React.FC<VideoCarouselProps> = ({ isDark = false }) => {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentFeature = features[current];
  const currentGradient = isDark ? currentFeature.darkGradient : currentFeature.gradient;

  const next = () => setCurrent((c) => (c + 1) % features.length);
  const prev = () => setCurrent((c) => (c - 1 + features.length) % features.length);

  // Auto-advance carousel when not hovering
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(next, 8000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  // Enhanced Netflix-style hover play with better error handling
  const handleVideoHover = (play: boolean) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    if (play) {
      hoverTimerRef.current = setTimeout(() => {
        if (videoRef.current && videoLoaded) {
          videoRef.current.currentTime = 0;
          videoRef.current.muted = true;
          videoRef.current.play().catch((error) => {
            console.warn('Video autoplay prevented:', error.message);
            // Fallback: show static preview instead
          });
        }
      }, 500); // Increased delay for better UX
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  // Enhanced video loading with better error handling
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      setVideoLoaded(false);
      
      const handleLoadedData = () => {
        setVideoLoaded(true);
        console.log(`Video loaded: ${currentFeature.video}`);
      };
      
      const handleError = (e: Event) => {
        console.error(`Video load error for ${currentFeature.video}:`, e);
        setVideoLoaded(false);
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.load();
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [current, currentFeature.video]);

  return (
    <div className="w-full">
      {/* Netflix-style Full-Width Hero Section */}
      <div 
        className="relative group w-full"
        onMouseEnter={() => {
          setIsHovering(true);
          setIsVideoHovered(true);
          handleVideoHover(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsVideoHovered(false);
          handleVideoHover(false);
        }}
      >
        {/* Main Hero Video Container - Cinematic 21:9 aspect ratio */}
        <div className={`
          relative w-full aspect-[21/9] lg:aspect-[21/8] xl:aspect-[21/7]
          overflow-hidden bg-black
          transform transition-all duration-500 ease-out
          ${isVideoHovered ? 'scale-[1.02]' : 'scale-100'}
        `}>
          
          {/* Video Element */}
          <video
            ref={videoRef}
            src={currentFeature.video}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-all duration-1000 ease-out
              ${videoLoaded && isVideoHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
            `}
            muted
            loop
            preload="metadata"
            playsInline
            controls={false}
          />
          
          {/* Cinematic Fallback Background */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${currentGradient}
            transition-all duration-1000
            ${videoLoaded && isVideoHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
          `}>
            {/* Animated background particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Netflix-style Multiple Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          
          {/* Enhanced Navigation with Backdrop Blur */}
          <button
            className={`
              absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30
              w-14 h-14 bg-black/40 backdrop-blur-md
              rounded-full flex items-center justify-center
              transition-all duration-300 ease-out
              ${isHovering ? 'opacity-100 scale-100 hover:bg-black/60' : 'opacity-0 scale-90'}
              hover:scale-110 border border-white/20
            `}
            onClick={prev}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            className={`
              absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30
              w-14 h-14 bg-black/40 backdrop-blur-md
              rounded-full flex items-center justify-center
              transition-all duration-300 ease-out
              ${isHovering ? 'opacity-100 scale-100 hover:bg-black/60' : 'opacity-0 scale-90'}
              hover:scale-110 border border-white/20
            `}
            onClick={next}
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
          
          {/* Netflix-style Content Overlay - Better Positioning */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-6 lg:p-12 xl:p-16">
              <div className="max-w-4xl">
                {/* Category Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`
                    w-16 h-16 bg-gradient-to-br ${currentGradient} 
                    rounded-2xl flex items-center justify-center
                    shadow-xl transform transition-all duration-500
                    ${isVideoHovered ? 'scale-110 rotate-3' : 'scale-100'}
                  `}>
                    <currentFeature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-white/70 text-sm font-medium uppercase tracking-[0.2em] block">
                      Mental Wellness
                    </span>
                    <span className="text-white text-lg font-semibold">
                      Wellness Experience
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Title with Text Shadow */}
                <h1 className={`
                  text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                  font-bold text-white mb-6 leading-none
                  transform transition-all duration-700
                  ${isVideoHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-90'}
                `}
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                  {currentFeature.title}
                </h1>
                
                {/* Enhanced Description */}
                <p className={`
                  text-lg md:text-xl lg:text-2xl text-white/90 
                  mb-8 leading-relaxed max-w-2xl font-light
                  transform transition-all duration-700 delay-100
                  ${isVideoHovered ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-80'}
                `}
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {currentFeature.description}
                </p>
                
                {/* Netflix-style CTA Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  <button className={`
                    flex items-center gap-3 bg-white text-black
                    px-8 py-4 rounded-lg font-bold text-lg
                    hover:bg-white/90 transition-all duration-200
                    transform hover:scale-105 shadow-xl
                    ${isVideoHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}
                  `}>
                    <ArrowRight className="w-5 h-5" />
                    <span>Start Journey</span>
                  </button>
                  
                  <button className={`
                    flex items-center gap-3 bg-white/20 text-white
                    px-8 py-4 rounded-lg font-semibold text-lg backdrop-blur-sm
                    hover:bg-white/30 transition-all duration-200 border border-white/30
                    transform hover:scale-105
                    ${isVideoHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}
                  `}>
                    <Shield className="w-5 h-5" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Explore Your Wellness Journey
          </h2>
          <p className={`text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Discover personalized tools for your mental health
          </p>
        </div>
        
        {/* Enhanced Thumbnails Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              className={`
                relative group/thumb overflow-hidden rounded-xl
                aspect-video transition-all duration-300 ease-out
                ${index === current 
                  ? 'ring-3 ring-white scale-105 shadow-2xl' 
                  : 'hover:scale-110 opacity-80 hover:opacity-100 hover:shadow-xl'
                }
              `}
              onClick={() => setCurrent(index)}
            >
              {/* Thumbnail Background with Enhanced Gradients */}
              <div className={`
                w-full h-full bg-gradient-to-br ${
                  isDark ? feature.darkGradient : feature.gradient
                }
                flex items-center justify-center relative overflow-hidden
              `}>
                {/* Animated overlay */}
                <div className={`
                  absolute inset-0 bg-black/30 transition-all duration-300
                  ${index === current ? 'bg-black/10' : 'group-hover/thumb:bg-black/20'}
                `} />
                
                {/* Enhanced shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/thumb:translate-x-full transition-transform duration-700" />
                
                {/* Icon with enhanced animations */}
                <feature.icon className={`
                  w-8 h-8 lg:w-10 lg:h-10 text-white relative z-10 
                  transition-all duration-300
                  ${index === current ? 'scale-125' : 'group-hover/thumb:scale-125'}
                `} />
              </div>
              
              {/* Enhanced title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                <h4 className="text-white text-sm lg:text-base font-semibold truncate">
                  {feature.title}
                </h4>
                <p className="text-white/70 text-xs truncate">
                  {feature.description.split('.')[0]}...
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="flex justify-center gap-3">
          {features.map((_, index) => (
            <button
              key={index}
              className={`
                h-1.5 rounded-full transition-all duration-400 hover:scale-110
                ${index === current 
                  ? `w-12 bg-gradient-to-r ${currentGradient} shadow-lg` 
                  : `w-8 ${isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-slate-400 hover:bg-slate-500'}`
                }
              `}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
