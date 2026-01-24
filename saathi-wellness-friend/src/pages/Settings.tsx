import React, { useState } from "react";
import { User, Bell, Sun, Moon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NavigationHeader from "@/components/NavigationHeader";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth.tsx";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    firstName: "Sri",
    lastName: "Nikhil",
    email: currentUser?.email || "srinikhil@example.com",
    phone: "+1 (555) 123-4567"
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    soundEffects: true,
    animationsEnabled: true
  });

  const asset = (p: string) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '/')}${p}`;
  const backgroundImage = theme === 'light' 
    ? `url('${asset("Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png")}')`
    : `url('${asset("Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png")}')`;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const sidebarSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const renderProfileSection = () => (
    <LoadingAnimation delay={100} direction="up">
      <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-white/10 border-white/20'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <LoadingAnimation delay={200} direction="up">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className={`${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                  Wellness Journey Member
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    Active
                  </div>
                </div>
              </div>
            </div>
          </LoadingAnimation>

          {/* Profile Fields */}
          <LoadingAnimation delay={400} direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                  First Name
                </label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className={theme === 'light' ? 'bg-white border-slate-300' : 'bg-white/10 border-white/20 text-white'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className={theme === 'light' ? 'bg-white border-slate-300' : 'bg-white/10 border-white/20 text-white'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                  Email
                </label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  type="email"
                  className={theme === 'light' ? 'bg-white border-slate-300' : 'bg-white/10 border-white/20 text-white'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                  Phone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  type="tel"
                  className={theme === 'light' ? 'bg-white border-slate-300' : 'bg-white/10 border-white/20 text-white'}
                />
              </div>
            </div>
          </LoadingAnimation>

          <LoadingAnimation delay={600} direction="up">
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </Button>
            </div>
          </LoadingAnimation>
        </CardContent>
      </Card>
    </LoadingAnimation>
  );

  const renderNotificationsSection = () => (
    <LoadingAnimation delay={200} direction="up">
      <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-white/10 border-white/20'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoadingAnimation delay={300} direction="up">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                <div>
                  <h4 className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Daily Reminders
                  </h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                    Get reminded for your daily check-ins and wellness activities
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({...preferences, notifications: !preferences.notifications})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
                <div>
                  <h4 className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Sound Effects
                  </h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                    Play sounds for notifications and interactions
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({...preferences, soundEffects: !preferences.soundEffects})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.soundEffects ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </LoadingAnimation>
        </CardContent>
      </Card>
    </LoadingAnimation>
  );

  const renderAppearanceSection = () => (
    <LoadingAnimation delay={400} direction="up">
      <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-white/10 border-white/20'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <Sun className="h-5 w-5" />
            <span>Appearance & Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoadingAnimation delay={500} direction="up">
            <div>
              <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                Theme
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                >
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </Button>
              </div>
            </div>
          </LoadingAnimation>

          <LoadingAnimation delay={700} direction="up">
            <div className="flex items-center justify-between p-4 rounded-lg border border-white/20">
              <div>
                <h4 className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  Enable Animations
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                  Smooth transitions and loading animations
                </p>
              </div>
              <button
                onClick={() => setPreferences({...preferences, animationsEnabled: !preferences.animationsEnabled})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.animationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </LoadingAnimation>
        </CardContent>
      </Card>
    </LoadingAnimation>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'appearance':
        return renderAppearanceSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      )}

      <NavigationHeader />

      <div className="relative flex-1 flex max-w-7xl mx-auto w-full p-6 gap-6">
        {/* Sidebar */}
        <LoadingAnimation delay={0} direction="left">
          <Card className={`w-80 backdrop-blur-2xl ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-white/10 border-white/20'} h-fit`}>
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <User className="h-5 w-5" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sidebarSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 transform hover:scale-105 ${
                        activeSection === section.id
                          ? `${theme === 'light' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'bg-blue-500/20 text-blue-300 border-r-2 border-blue-400'}`
                          : `${theme === 'light' ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </LoadingAnimation>

        {/* Main Content */}
        <div className="flex-1">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;