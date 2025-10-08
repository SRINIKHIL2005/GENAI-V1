import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, BarChart3, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { useTheme } from "@/hooks/useTheme";

interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  date: string;
  energy: number;
  stress: number;
}

const MoodTracking: React.FC = () => {
  const { theme } = useTheme();
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [currentEnergy, setCurrentEnergy] = useState<number>(5);
  const [currentStress, setCurrentStress] = useState<number>(5);
  const [note, setNote] = useState("");

  const asset = (p: string) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '/')}${p}`;
  const backgroundImage = theme === 'light' 
    ? `url('${asset("Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png")}')`
    : `url('${asset("Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png")}')`;
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    // Load mood history from localStorage
    const saved = localStorage.getItem("moodHistory");
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
  }, []);

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      note,
      date: new Date().toISOString().split("T")[0],
      energy: currentEnergy,
      stress: currentStress,
    };

    const updatedHistory = [newEntry, ...moodHistory.slice(0, 29)]; // Keep last 30 entries
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
    
    setNote("");
    alert("Mood entry saved!");
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢";
    if (mood <= 4) return "😕";
    if (mood <= 6) return "😐";
    if (mood <= 8) return "😊";
    return "😁";
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodHistory.length).toFixed(1);
  };

  const getWeeklyTrend = () => {
    const lastWeek = moodHistory.slice(0, 7);
    if (lastWeek.length < 2) return "neutral";
    
    const recent = lastWeek.slice(0, 3).reduce((acc, entry) => acc + entry.mood, 0) / 3;
    const previous = lastWeek.slice(3, 6).reduce((acc, entry) => acc + entry.mood, 0) / 3;
    
    if (recent > previous + 0.5) return "improving";
    if (recent < previous - 0.5) return "declining";
    return "stable";
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
      {/* Global overlay */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      )}

      <NavigationHeader />

      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Current Mood Entry */}
        <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <Heart className={`h-6 w-6 ${theme === 'light' ? 'text-rose-500' : 'text-red-400'}`} />
              <span>How are you feeling today?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mood Scale */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                Mood Level: {getMoodEmoji(currentMood)} ({currentMood}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood}
                onChange={(e) => setCurrentMood(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'light' ? 'bg-slate-200' : 'bg-white/20'}`}
              />
            </div>

            {/* Energy Level */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                Energy Level: ({currentEnergy}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEnergy}
                onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'light' ? 'bg-slate-200' : 'bg-white/20'}`}
              />
            </div>

            {/* Stress Level */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                Stress Level: ({currentStress}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentStress}
                onChange={(e) => setCurrentStress(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'light' ? 'bg-slate-200' : 'bg-white/20'}`}
              />
            </div>

            {/* Note */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                Notes (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How was your day? What affected your mood?"
                className={`w-full p-3 rounded-lg border ${theme === 'light' ? 'bg-white text-slate-900 border-slate-200 placeholder:text-slate-400' : 'bg-white/10 text-white border-white/20 placeholder:text-white/50'}`}
                rows={3}
              />
            </div>

            <Button 
              onClick={saveMoodEntry}
              className={`w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
            >
              Save Mood Entry
            </Button>
          </CardContent>
        </Card>

        {/* Mood Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <BarChart3 className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                <span>Average Mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                {getAverageMood()}/10
              </div>
              <p className={`${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                Based on {moodHistory.length} entries
              </p>
            </CardContent>
          </Card>

          <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <TrendingUp className={`h-5 w-5 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                <span>Weekly Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-semibold ${
                getWeeklyTrend() === "improving" ? (theme === 'light' ? 'text-green-700' : 'text-green-400') :
                getWeeklyTrend() === "declining" ? (theme === 'light' ? 'text-red-600' : 'text-red-400') : (theme === 'light' ? 'text-yellow-600' : 'text-yellow-400')
              }`}>
                {getWeeklyTrend() === "improving" ? "📈 Improving" :
                 getWeeklyTrend() === "declining" ? "📉 Declining" : "➡️ Stable"}
              </div>
            </CardContent>
          </Card>

          <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <Calendar className={`h-5 w-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                <span>Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                {moodHistory.length}
              </div>
              <p className={`${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>Days tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Mood History */}
        <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
          <CardHeader>
            <CardTitle className={`${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Recent Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            {moodHistory.length === 0 ? (
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-white/70'} text-center py-8`}>
                No mood entries yet. Start tracking your mood above!
              </p>
            ) : (
              <div className="space-y-3">
                {moodHistory.slice(0, 7).map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/10 border-white/20'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{entry.date}</p>
                        {entry.note && (
                          <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`text-right text-sm ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`}>
                      <p>Mood: {entry.mood}/10</p>
                      <p>Energy: {entry.energy}/10</p>
                      <p>Stress: {entry.stress}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracking;
