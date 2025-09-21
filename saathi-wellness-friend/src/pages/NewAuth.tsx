import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Eye, EyeOff, ArrowLeft, Globe, Moon, Sun } from "lucide-react";

// Import video assets
import sunnyBeachVideo from "@/assets/videos/Sunny_Beach_Video_With_Waves.mp4";
import nightBeachVideo from "@/assets/videos/Night_Beach_View_Video_Generated.mp4";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentVideo = theme === 'dark' ? nightBeachVideo : sunnyBeachVideo;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={currentVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top Navigation */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-white" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="English" className="text-black">English</option>
              <option value="Hindi" className="text-black">हिंदी</option>
              <option value="Spanish" className="text-black">Español</option>
              <option value="French" className="text-black">Français</option>
            </select>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-white hover:bg-white/20"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-0 pb-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-cyan-500 text-xl">❤️</span>
                </div>
              </div>
              <h1 className="ml-3 text-4xl font-bold text-white">Saathi</h1>
            </div>
            <p className="text-white/90 text-lg mb-2">Your AI Wellness Companion</p>
            <p className="text-cyan-300 text-sm">≈ Begin Your Wellness Journey ≈</p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Tab Switches */}
            <div className="flex rounded-lg bg-white/10 p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-white/20 text-white shadow-sm' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-white/20 text-white shadow-sm' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-white/70">
                {isLogin ? "Continue your wellness journey" : "Start your wellness journey"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 text-red-100 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {!isLogin && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/60">
                  or
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium py-3 rounded-lg transition-all duration-200" 
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-white hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>
            </p>
            
            {/* Debug buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
              >
                🔍 Google
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
              >
                📊 Firebase Debug
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
