import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, Target, Zap } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: Date;
  category: 'mood' | 'streak' | 'chat' | 'exercise' | 'milestone';
}

interface MoodData {
  date: string;
  mood: number;
  activities: string[];
}

interface ProgressDashboardProps {
  className?: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first mood check-in',
      icon: '👋',
      earned: true,
      date: new Date('2024-01-15'),
      category: 'mood'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: '7-day chat streak achieved',
      icon: '🔥',
      earned: true,
      date: new Date('2024-01-20'),
      category: 'streak'
    },
    {
      id: '3',
      title: 'Mindful Month',
      description: '30 days of consistent mood tracking',
      icon: '🧘',
      earned: false,
      category: 'mood'
    },
    {
      id: '4',
      title: 'Conversation Champion',
      description: '100 meaningful conversations',
      icon: '💬',
      earned: false,
      category: 'chat'
    },
    {
      id: '5',
      title: 'Wellness Warrior',
      description: 'Completed 50 exercise sessions',
      icon: '💪',
      earned: true,
      date: new Date('2024-01-25'),
      category: 'exercise'
    }
  ];

  const moodData: MoodData[] = [
    { date: '2024-01-20', mood: 7, activities: ['chat', 'exercise'] },
    { date: '2024-01-21', mood: 6, activities: ['mood-check'] },
    { date: '2024-01-22', mood: 8, activities: ['chat', 'music', 'exercise'] },
    { date: '2024-01-23', mood: 5, activities: ['mood-check'] },
    { date: '2024-01-24', mood: 9, activities: ['chat', 'music'] },
    { date: '2024-01-25', mood: 7, activities: ['exercise', 'mood-check'] },
    { date: '2024-01-26', mood: 8, activities: ['chat', 'exercise', 'music'] }
  ];

  const stats = {
    currentStreak: 12,
    longestStreak: 18,
    totalSessions: 67,
    averageMood: 7.2,
    achievementsEarned: achievements.filter(a => a.earned).length,
    totalAchievements: achievements.length
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'from-green-400 to-emerald-500';
    if (mood >= 6) return 'from-yellow-400 to-orange-500';
    if (mood >= 4) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }: { 
    icon: any, title: string, value: string | number, subtitle?: string 
  }) => (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
          </div>
        </div>
        
        <div className="text-2xl font-bold text-white">{value}</div>
        
        <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
      </div>
    </div>
  );

  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 via-blue-200/15 to-purple-200/20 backdrop-blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Progress Dashboard</h1>
              <p className="text-white/70 text-sm">Track your wellness journey</p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-xl rounded-full p-1 border border-white/20">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe
                    ? 'bg-white text-gray-700 shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            icon={TrendingUp} 
            title="Current Streak" 
            value={stats.currentStreak} 
            subtitle="days active"
          />
          <StatCard 
            icon={Award} 
            title="Longest Streak" 
            value={stats.longestStreak} 
            subtitle="personal best"
          />
          <StatCard 
            icon={TrendingUp} 
            title="Avg Mood" 
            value={stats.averageMood} 
            subtitle="out of 10"
          />
          <StatCard 
            icon={Target} 
            title="Sessions" 
            value={stats.totalSessions} 
            subtitle="total completed"
          />
          <StatCard 
            icon={Award} 
            title="Achievements" 
            value={`${stats.achievementsEarned}/${stats.totalAchievements}`} 
            subtitle="unlocked"
          />
          <StatCard 
            icon={Zap} 
            title="This Week" 
            value="5/7" 
            subtitle="days active"
          />
        </div>

        {/* Mood Trend Chart */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Mood Trends</h2>
              <Calendar className="h-5 w-5 text-white/70" />
            </div>
            
            {/* Chart */}
            <div className="space-y-4">
              {moodData.map((data) => (
                <div key={data.date} className="flex items-center space-x-4">
                  <div className="w-16 text-white/70 text-sm">
                    {new Date(data.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getMoodColor(data.mood)} transition-all duration-500`}
                        style={{ width: `${(data.mood / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold w-8">{data.mood}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {data.activities.map((activity, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-2 rounded-full bg-cyan-400/60"
                        title={activity}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Achievements */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Achievements</h2>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="text-white/70 text-sm">
                  {stats.achievementsEarned}/{stats.totalAchievements}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`relative group ${
                    achievement.earned ? 'scale-100' : 'scale-95 opacity-60'
                  } transition-all duration-300 hover:scale-105`}
                >
                  {achievement.earned && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 blur-md rounded-xl"></div>
                  )}
                  
                  <div className={`relative p-4 rounded-xl border transition-all duration-300 ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border-yellow-400/30'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${achievement.earned ? 'animate-bounce' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-white' : 'text-white/60'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-white/80' : 'text-white/40'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-yellow-300 mt-1">
                            Earned {achievement.date.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      {achievement.earned && (
                        <span className="text-yellow-400 text-lg animate-pulse">🏆</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Weekly Goals</h2>
              <Target className="h-5 w-5 text-white/70" />
            </div>
            
            <div className="space-y-4">
              {[
                { goal: 'Daily mood check-ins', current: 5, target: 7, icon: '😊' },
                { goal: 'Chat sessions', current: 4, target: 5, icon: '💬' },
                { goal: 'Exercise activities', current: 3, target: 4, icon: '🏃' },
                { goal: 'Mindfulness minutes', current: 45, target: 60, icon: '🧘' }
              ].map((goal, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-2xl">{goal.icon}</span>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{goal.goal}</span>
                      <span className="text-white/70 text-sm">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
