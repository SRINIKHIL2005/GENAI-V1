import React, { useState } from "react";
import { ArrowLeft, Globe, Moon, Sun, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoPath } from '@/utils/assets';
import { useAuth } from "@/hooks/useAuth.tsx";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

interface EnhancedAuthProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const EnhancedAuth: React.FC<EnhancedAuthProps> = ({ onBack, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { theme, setTheme } = useTheme();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate simple captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptcha(""); // Clear the input when generating new captcha
  };

  // Initialize captcha on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  // Form validation
  const validateForm = () => {
    if (activeTab === "signup") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return false;
      }
      if (captcha.toLowerCase() !== captchaCode.toLowerCase()) {
        toast.error("Captcha verification failed!");
        return false;
      }
      if (!nickname.trim()) {
        toast.error("Please enter a nickname!");
        return false;
      }
    }
    return true;
  };

  // Handle tab switching with form clearing
  const switchTab = (tab: "login" | "signup") => {
    setActiveTab(tab);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNickname("");
    setCaptcha("");
    setError("");
    setSuccess("");
    if (tab === "signup") {
      generateCaptcha();
    }
  };

  const toggleTheme = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    
    setIsTransitioning(true);
    
    // Add a slight delay for the visual transition effect
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 2000);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (activeTab === "login") {
        await signIn(email, password);
        toast.success("Welcome back! Successfully signed in.", {
          duration: 2000,
        });
        // Call success callback after a brief delay
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        // Use validation function
        if (!validateForm()) {
          setLoading(false);
          generateCaptcha(); // Generate new captcha on failure
          return;
        }
        await signUp(email, password, nickname);
        toast.success("Account created successfully! Welcome to Saathi!", {
          duration: 3000,
        });
        // Call success callback after a brief delay
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // User-friendly error messages with toast
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          toast.error("This email is already registered. Try signing in instead.");
          break;
        case 'auth/invalid-credential':
          toast.error("Invalid email or password. Please check your credentials.");
          break;
        case 'auth/user-not-found':
          toast.error("No account found with this email. Please sign up first.");
          break;
        case 'auth/wrong-password':
          toast.error("Incorrect password. Please try again.");
          break;
        case 'auth/weak-password':
          toast.error("Password should be at least 6 characters long.");
          break;
        case 'auth/invalid-email':
          toast.error("Please enter a valid email address.");
          break;
        case 'auth/too-many-requests':
          toast.error("Too many failed attempts. Please try again later.");
          break;
        case 'auth/network-request-failed':
          toast.error("Network error. Please check your connection.");
          break;
        default:
          toast.error("Authentication failed. Please try again.");
      }
      
      if (activeTab === "signup") {
        generateCaptcha(); // Generate new captcha on signup failure
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await signInWithGoogle();
      setSuccess("Successfully signed in with Google! Redirecting...");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          setError("Sign-in cancelled. Please try again.");
          break;
        case 'auth/popup-blocked':
          setError("Popup blocked. Please allow popups and try again.");
          break;
        default:
          setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Dark theme video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ease-in-out ${
              theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              filter: 'brightness(0.7) contrast(1.1)',
              zIndex: theme === "dark" ? 2 : 1,
            }}
          >
            <source 
              src={getVideoPath("Night_Beach_View_Video_Generated.mp4")} 
              type="video/mp4" 
            />
          </video>
          
          {/* Light theme video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-2000 ease-in-out ${
              theme === "light" ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              filter: 'brightness(0.7) contrast(1.1)',
              zIndex: theme === "light" ? 2 : 1,
            }}
          >
            <source 
              src={getVideoPath("Sunny_Beach_Video_With_Waves.mp4")} 
              type="video/mp4" 
            />
          </video>
          
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 animate-fade-in" style={{zIndex: 3}}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden" style={{zIndex: 4}}>
            <div className="animate-float absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full" style={{animationDelay: '0s'}}></div>
            <div className="animate-float absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-300/20 rounded-full" style={{animationDelay: '2s'}}></div>
            <div className="animate-float absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300/15 rounded-full" style={{animationDelay: '4s'}}></div>
            <div className="animate-float absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-300/20 rounded-full" style={{animationDelay: '6s'}}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col animate-fade-in">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 animate-slide-down">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 group"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors duration-300" />
              </button>
            )}
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <Globe className="w-4 h-4 text-white group-hover:text-cyan-300 group-hover:animate-pulse transition-colors duration-300" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white text-sm outline-none border-none cursor-pointer"
              >
                <option value="English" className="text-black">English</option>
                <option value="Hindi" className="text-black">Hindi</option>
                <option value="Spanish" className="text-black">Spanish</option>
                <option value="French" className="text-black">French</option>
              </select>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            disabled={isTransitioning}
            className={`p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-1000 transform hover:scale-110 hover:rotate-12 group relative ${
              isTransitioning ? 'animate-spin scale-110' : 'animate-pulse-slow'
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className={`relative z-10 transition-all duration-1000 ${isTransitioning ? 'scale-125 rotate-180' : ''}`}>
              {theme === "dark" ? (
                <Sun className={`w-5 h-5 text-white group-hover:text-yellow-300 transition-all duration-1000 ${isTransitioning ? 'animate-pulse text-yellow-400' : ''}`} />
              ) : (
                <Moon className={`w-5 h-5 text-white group-hover:text-blue-300 transition-all duration-1000 ${isTransitioning ? 'animate-pulse text-blue-400' : ''}`} />
              )}
            </div>
            {isTransitioning && (
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="flex items-center justify-center mb-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3 transform group-hover:scale-110 transition-all duration-500 animate-pulse-slow shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white group-hover:animate-pulse">
                    <path
                      fill="currentColor"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-500">Saathi</h1>
              </div>
              <p className="text-white/80 text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>Your AI Wellness Companion</p>
              <p className="text-cyan-400 text-sm mt-2 font-medium animate-fade-in-up animate-pulse" style={{animationDelay: '0.4s'}}>≈≈ Begin Your Wellness Journey ≈≈</p>
            </div>

            {/* Auth Form */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl animate-scale-in hover-glow">
              {/* Tab Selector */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-full p-1 mb-6 animate-slide-down">
                <button
                  onClick={() => switchTab("login")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-500 transform ${
                    activeTab === "login"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105 animate-pulse-slow"
                      : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-102"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => switchTab("signup")}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-500 transform ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105 animate-pulse-slow"
                      : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-102"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Welcome Message */}
              <div className="text-center mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h2 className="text-xl font-semibold text-white mb-2 transition-all duration-500 transform">
                  {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-white/70 text-sm transition-all duration-500">
                  {activeTab === "login" ? "Continue your wellness journey" : "Start your wellness journey"}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm animate-shake">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm animate-pulse">
                  <p className="text-green-300 text-sm text-center">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="transform transition-all duration-300 hover:scale-105">
                  <label className="block text-white/80 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:scale-105"
                    required
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-105">
                  <label className="block text-white/80 text-sm mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12 transition-all duration-300 hover:bg-white/15 focus:scale-105"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Additional fields for signup */}
                {activeTab === "signup" && (
                  <>
                    <div className="transform transition-all duration-300 hover:scale-105 animate-slide-in-left" style={{animationDelay: '0.6s'}}>
                      <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12 transition-all duration-300 hover:bg-white/15 focus:scale-105"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-105 animate-slide-in-right" style={{animationDelay: '0.8s'}}>
                      <label className="block text-white/80 text-sm mb-2">Nickname</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Choose a nickname"
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:scale-105"
                        required
                      />
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{animationDelay: '1s'}}>
                      <label className="block text-white/80 text-sm mb-2">Captcha Verification</label>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 rounded-lg border border-gray-500 text-white font-mono text-lg tracking-widest select-none">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                          title="Generate new captcha"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Enter the captcha"
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:scale-105 mt-3"
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-2xl animate-pulse-slow"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {activeTab === "login" ? "Signing In..." : "Signing Up..."}
                    </div>
                  ) : (
                    activeTab === "login" ? "Sign In" : "Sign Up"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-white/60">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-lg transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-110 hover:shadow-2xl group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </form>

              {/* Terms */}
              <p className="text-center text-white/50 text-xs mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Right Indicators */}
        <div className="absolute bottom-6 right-6 flex space-x-2">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30">
            <span className="text-green-300 text-xs font-medium">✅ Google Cloud Translation API</span>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-500/30">
            <span className="text-blue-300 text-xs font-medium">🔥 Firebase Debug</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;
