import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { RealTimeTranslationProvider } from "./hooks/useRealTimeTranslation";
import { PageTranslationWrapper } from "./hooks/usePageTranslation";
import { AuthProvider, useAuth } from "./hooks/useAuth.tsx";
import FirebaseDebugger from "./components/FirebaseDebugger";
import AccountLinkingDemo from "./components/AccountLinkingDemo";
import QuickPasswordSetup from "./components/QuickPasswordSetup";
import WellnessSidebar from "./components/WellnessSidebar";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import DailyCheckIn from "./pages/DailyCheckIn";
import Chat from "./pages/Chat";
import MoodTracking from "./pages/MoodTracking";
import VoiceInteraction from "./pages/VoiceInteraction";
import PhysicalSupport from "./pages/PhysicalSupport";
import MusicRelaxation from "./pages/MusicRelaxation";
import ProgressTracking from "./pages/ProgressTracking";
import NotFound from "./pages/NotFound";
import AuthPage from "@/pages/AuthPage";

const queryClient = new QueryClient();

const AppContent = ({ onSignOut }: { onSignOut: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // Only redirect on initial load if user is on an invalid route
  useEffect(() => {
    // Only redirect if user lands on an invalid route or the landing page when authenticated
    const validRoutes = ["/", "/daily-checkin", "/chat", "/mood-tracking", "/voice", "/physical", "/music", "/progress", "/translation-test", "/account-linking", "/password-setup"];
    if (!validRoutes.includes(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, []); // Remove dependency array to only run on mount

  return (
    <div className="flex">
      {/* Wellness Sidebar */}
      <WellnessSidebar onSignOut={onSignOut} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${!isHomePage ? 'lg:ml-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account-linking" element={<AccountLinkingDemo />} />
          <Route path="/password-setup" element={<QuickPasswordSetup />} />
          <Route path="/daily-checkin" element={<DailyCheckIn />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mood-tracking" element={<MoodTracking />} />
          <Route path="/voice" element={<VoiceInteraction />} />
          <Route path="/physical" element={<PhysicalSupport />} />
          <Route path="/music" element={<MusicRelaxation />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

// Routes available before authentication
const UnauthContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

const AppRouter = () => {
  const { currentUser, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Saathi...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {!currentUser ? (
        <UnauthContent />
      ) : (
        <AppContent onSignOut={handleSignOut} />
      )}
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RealTimeTranslationProvider>
          <PageTranslationWrapper>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <FirebaseDebugger />
                <AppRouter />
              </TooltipProvider>
            </AuthProvider>
          </PageTranslationWrapper>
        </RealTimeTranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
