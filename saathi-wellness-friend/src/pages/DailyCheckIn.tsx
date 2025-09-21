import React, { useState } from "react";
import { Heart, Calendar, Send, Smile, Meh, Frown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WellnessHeader from "@/components/WellnessHeader";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useTheme } from "@/hooks/useTheme";

const DailyCheckIn: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitude, setGratitude] = useState("");
  const [goals, setGoals] = useState("");
  const [challenges, setChallenges] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const { t } = usePageTranslation();
  const { theme } = useTheme();

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const moods = [
    { id: "excellent", label: "Excellent", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { id: "good", label: "Good", icon: Smile, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { id: "okay", label: "Okay", icon: Meh, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "poor", label: "Poor", icon: Frown, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { id: "terrible", label: "Terrible", icon: Moon, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to Firebase
    console.log({
      mood: selectedMood,
      energy: energyLevel,
      gratitude,
      goals,
      challenges,
      date: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
        
        <WellnessHeader title={t('daily_checkin')} />
        
        <div className="relative max-w-2xl mx-auto p-6">
          <Card className="text-center backdrop-blur-2xl bg-white/10 border-white/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Thank you for checking in!
              </h2>
              <p className="text-white/80 mb-6">
                Your daily check-in has been recorded. Keep up the great work on your wellness journey!
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Check In Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      
      <WellnessHeader title={t('daily_checkin')} />
      
      <div className="relative max-w-2xl mx-auto p-6">
        <Card className="backdrop-blur-2xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Calendar className="h-6 w-6 text-blue-400" />
              <span>Daily Check-In</span>
            </CardTitle>
            <p className="text-white/80">
              Take a moment to reflect on how you're feeling today. This helps track your wellness journey.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMood === mood.id
                          ? `border-blue-500 ${mood.bg}`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <mood.icon className={`h-8 w-8 mx-auto mb-2 ${mood.color}`} />
                      <span className="text-sm font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Energy Level (1-10)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/70">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-white/70">High</span>
                  <span className="text-lg font-bold text-blue-400 w-8">
                    {energyLevel}
                  </span>
                </div>
              </div>

              {/* Gratitude */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  What are you grateful for today?
                </label>
                <Input
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="I'm grateful for..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  What's one goal for today?
                </label>
                <Input
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Today I want to..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Challenges */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Any challenges you're facing? (Optional)
                </label>
                <Input
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="I'm struggling with..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Button 
                type="submit"
                disabled={!selectedMood}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Check-In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Helpful Tips */}
        <Card className="mt-6 backdrop-blur-2xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">💡 Daily Check-In Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Be honest about your feelings - there are no wrong answers</li>
              <li>• Small wins count - celebrate progress, no matter how small</li>
              <li>• Use this time for self-reflection and mindfulness</li>
              <li>• Your responses help us provide better support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyCheckIn;
