import React, { useState, useEffect } from "react";
import { TrendingUp, Target, Award, Calendar, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

interface ProgressData {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  workoutsCompleted: number;
  meditationMinutes: number;
  sleepHours: number;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: "fitness" | "wellness" | "mindfulness" | "health";
  deadline: string;
}

const ProgressTracking: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  useEffect(() => {
    // Load progress data from localStorage or generate sample data
    const savedData = localStorage.getItem("progressData");
    if (savedData) {
      setProgressData(JSON.parse(savedData));
    } else {
      generateSampleData();
    }

    // Load goals
    const savedGoals = localStorage.getItem("wellnessGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setDefaultGoals();
    }
  }, []);

  const generateSampleData = () => {
    const data: ProgressData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split("T")[0],
        mood: Math.floor(Math.random() * 4) + 5, // 5-8
        energy: Math.floor(Math.random() * 4) + 4, // 4-7
        stress: Math.floor(Math.random() * 4) + 3, // 3-6
        workoutsCompleted: Math.random() > 0.7 ? 1 : 0,
        meditationMinutes: Math.floor(Math.random() * 30),
        sleepHours: Math.random() * 2 + 6.5, // 6.5-8.5
      });
    }
    
    setProgressData(data);
    localStorage.setItem("progressData", JSON.stringify(data));
  };

  const setDefaultGoals = () => {
    const defaultGoals: Goal[] = [
      {
        id: "1",
        title: "Daily Meditation",
        target: 15,
        current: 12,
        unit: "minutes",
        category: "mindfulness",
        deadline: "2025-01-31"
      },
      {
        id: "2",
        title: "Weekly Workouts",
        target: 3,
        current: 2,
        unit: "sessions",
        category: "fitness",
        deadline: "2025-01-31"
      },
      {
        id: "3",
        title: "Sleep Goal",
        target: 8,
        current: 7.2,
        unit: "hours",
        category: "health",
        deadline: "2025-01-31"
      },
      {
        id: "4",
        title: "Mood Tracking",
        target: 30,
        current: 22,
        unit: "days",
        category: "wellness",
        deadline: "2025-01-31"
      }
    ];
    
    setGoals(defaultGoals);
    localStorage.setItem("wellnessGoals", JSON.stringify(defaultGoals));
  };

  const getFilteredData = () => {
    const today = new Date();
    let daysBack = 7;
    
    if (selectedPeriod === "month") daysBack = 30;
    if (selectedPeriod === "year") daysBack = 365;
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    return progressData.filter(item => new Date(item.date) >= cutoffDate);
  };

  const calculateAverage = (key: keyof ProgressData) => {
    const filtered = getFilteredData();
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);
    
    return (sum / filtered.length).toFixed(1);
  };

  const calculateTrend = (key: keyof ProgressData) => {
    const filtered = getFilteredData();
    if (filtered.length < 2) return "stable";
    
    const recent = filtered.slice(-3);
    const previous = filtered.slice(-6, -3);
    
    if (recent.length === 0 || previous.length === 0) return "stable";
    
    const recentAvg = recent.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === "number" ? value : 0);
    }, 0) / recent.length;
    
    const previousAvg = previous.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === "number" ? value : 0);
    }, 0) / previous.length;
    
    if (recentAvg > previousAvg + 0.5) return "improving";
    if (recentAvg < previousAvg - 0.5) return "declining";
    return "stable";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return "📈";
      case "declining": return "📉";
      default: return "➡️";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving": return "text-green-600";
      case "declining": return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fitness": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "wellness": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "mindfulness": return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
      case "health": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const updateGoalProgress = (goalId: string, newCurrent: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, current: newCurrent } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem("wellnessGoals", JSON.stringify(updatedGoals));
  };

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
      
      <NavigationHeader 
        userName={currentUser?.displayName || 'Friend'}
      />
      
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {/* Period Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <span>Wellness Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {(["week", "month", "year"] as const).map((period) => (
                <Button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {calculateAverage("mood")}/10
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getTrendColor(calculateTrend("mood"))}`}>
                    {getTrendIcon(calculateTrend("mood"))} {calculateTrend("mood")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Energy Level</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {calculateAverage("energy")}/10
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getTrendColor(calculateTrend("energy"))}`}>
                    {getTrendIcon(calculateTrend("energy"))} {calculateTrend("energy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stress Level</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {calculateAverage("stress")}/10
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getTrendColor(calculateTrend("stress") === "improving" ? "declining" : calculateTrend("stress") === "declining" ? "improving" : "stable")}`}>
                    {getTrendIcon(calculateTrend("stress") === "improving" ? "declining" : calculateTrend("stress") === "declining" ? "improving" : "stable")} 
                    {calculateTrend("stress") === "improving" ? "decreasing" : calculateTrend("stress") === "declining" ? "increasing" : "stable"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sleep Average</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {calculateAverage("sleepHours")}h
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getTrendColor(calculateTrend("sleepHours"))}`}>
                    {getTrendIcon(calculateTrend("sleepHours"))} {calculateTrend("sleepHours")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-green-500" />
              <span>Wellness Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className="font-medium">
                        {Math.round(getGoalProgress(goal))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getGoalProgress(goal)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={goal.current}
                      onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, goal.current + 1)}
                    >
                      +1
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-orange-500" />
              <span>Recent Activity Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">This Week</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Workouts:</span>
                    <span className="font-medium">
                      {getFilteredData().reduce((acc, item) => acc + item.workoutsCompleted, 0)} sessions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Meditation:</span>
                    <span className="font-medium">
                      {Math.round(getFilteredData().reduce((acc, item) => acc + item.meditationMinutes, 0))} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mood entries:</span>
                    <span className="font-medium">
                      {getFilteredData().length} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Achievements</h4>
                <div className="space-y-2">
                  {goals.filter(goal => getGoalProgress(goal) >= 100).length > 0 ? (
                    goals.filter(goal => getGoalProgress(goal) >= 100).map(goal => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {goal.title} completed!
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No achievements yet. Keep going!</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Insights</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {Number(calculateAverage("mood")) >= 7 && (
                    <p>• Your mood has been consistently positive</p>
                  )}
                  {Number(calculateAverage("energy")) >= 6 && (
                    <p>• Your energy levels are good</p>
                  )}
                  {Number(calculateAverage("stress")) <= 4 && (
                    <p>• You're managing stress well</p>
                  )}
                  {getFilteredData().reduce((acc, item) => acc + item.workoutsCompleted, 0) >= 3 && (
                    <p>• Great job staying active this week</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span>Mood & Energy Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-500">Interactive charts coming soon!</p>
                <p className="text-sm text-gray-400">
                  Your data is being tracked and will be visualized here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTracking;
