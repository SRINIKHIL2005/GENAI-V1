import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Award, Target } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface Exercise {
  id: string;
  name: string;
  category: 'breathing' | 'yoga' | 'stretch' | 'cardio' | 'strength' | 'meditation';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  benefits: string[];
  videoUrl?: string;
  image?: string;
  sets?: number;
  reps?: number;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  gradient: string;
  icon: string;
}

interface PhysicalSupportProps {
  className?: string;
}

const PhysicalSupport: React.FC<PhysicalSupportProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('recommended');
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const exercises: Exercise[] = [
    {
      id: '1',
      name: '4-7-8 Breathing',
      category: 'breathing',
      duration: 300,
      difficulty: 'beginner',
      instructions: [
        'Sit comfortably with your back straight',
        'Exhale completely through your mouth',
        'Inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat cycle 4 times'
      ],
      benefits: ['Reduces anxiety', 'Improves sleep', 'Lowers stress'],
      videoUrl: '/videos/breathing-exercise.mp4'
    },
    {
      id: '2',
      name: 'Cat-Cow Stretch',
      category: 'yoga',
      duration: 180,
      difficulty: 'beginner',
      instructions: [
        'Start on hands and knees',
        'Arch your back, lift chest and tailbone (Cow)',
        'Round your spine, tuck chin to chest (Cat)',
        'Flow between positions smoothly',
        'Focus on your breathing'
      ],
      benefits: ['Improves spine flexibility', 'Reduces back tension', 'Calms the mind'],
      sets: 3,
      reps: 10
    },
    {
      id: '3',
      name: 'Neck & Shoulder Release',
      category: 'stretch',
      duration: 240,
      difficulty: 'beginner',
      instructions: [
        'Sit or stand with spine straight',
        'Slowly roll shoulders backward 5 times',
        'Gently tilt head to right, hold 15 seconds',
        'Repeat on left side',
        'Look up and down slowly',
        'Finish with gentle neck circles'
      ],
      benefits: ['Relieves tension', 'Improves posture', 'Reduces headaches']
    },
    {
      id: '4',
      name: 'Mindful Walking',
      category: 'meditation',
      duration: 600,
      difficulty: 'beginner',
      instructions: [
        'Find a quiet space to walk',
        'Walk slowly and deliberately',
        'Focus on each step',
        'Notice how your feet feel',
        'Breathe naturally',
        'If mind wanders, return to steps'
      ],
      benefits: ['Increases mindfulness', 'Reduces stress', 'Improves focus']
    },
    {
      id: '5',
      name: 'Desk Warrior Routine',
      category: 'stretch',
      duration: 420,
      difficulty: 'beginner',
      instructions: [
        'Seated spinal twist (30 seconds each side)',
        'Shoulder blade squeezes (10 reps)',
        'Neck stretches (15 seconds each direction)',
        'Wrist circles (10 each direction)',
        'Ankle pumps (20 reps)',
        'Deep breathing to finish'
      ],
      benefits: ['Combats desk posture', 'Increases energy', 'Prevents stiffness']
    },
    {
      id: '6',
      name: 'Quick Energy Boost',
      category: 'cardio',
      duration: 300,
      difficulty: 'intermediate',
      instructions: [
        'Jumping jacks (30 seconds)',
        'High knees (30 seconds)',
        'Arm circles (30 seconds)',
        'Bodyweight squats (30 seconds)',
        'Rest (30 seconds)',
        'Repeat 2-3 cycles'
      ],
      benefits: ['Increases energy', 'Improves circulation', 'Boosts mood'],
      sets: 3,
      reps: 30
    }
  ];

  const routines: Routine[] = [
    {
      id: 'morning',
      name: 'Morning Energizer',
      description: 'Start your day with gentle movement',
      exercises: exercises.filter(e => ['breathing', 'stretch', 'yoga'].includes(e.category)).slice(0, 3),
      totalDuration: 720,
      difficulty: 'beginner',
      category: 'morning',
      gradient: 'from-yellow-400 to-orange-500',
      icon: '🌅'
    },
    {
      id: 'desk-break',
      name: 'Desk Break Routine',
      description: 'Perfect for work breaks',
      exercises: exercises.filter(e => e.category === 'stretch'),
      totalDuration: 420,
      difficulty: 'beginner',
      category: 'work',
      gradient: 'from-blue-400 to-cyan-500',
      icon: '💻'
    },
    {
      id: 'stress-relief',
      name: 'Stress Relief',
      description: 'Calm your mind and body',
      exercises: exercises.filter(e => ['breathing', 'meditation'].includes(e.category)),
      totalDuration: 900,
      difficulty: 'beginner',
      category: 'stress',
      gradient: 'from-purple-400 to-pink-500',
      icon: '🧘'
    },
    {
      id: 'energy-boost',
      name: 'Quick Energy Boost',
      description: 'Get energized in minutes',
      exercises: exercises.filter(e => ['cardio', 'stretch'].includes(e.category)),
      totalDuration: 480,
      difficulty: 'intermediate',
      category: 'energy',
      gradient: 'from-green-400 to-emerald-500',
      icon: '⚡'
    }
  ];

  const categories = [
    { id: 'recommended', name: 'For You', icon: '✨', gradient: 'from-yellow-400 to-orange-500' },
    { id: 'breathing', name: 'Breathing', icon: '🫁', gradient: 'from-blue-400 to-cyan-500' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', gradient: 'from-purple-400 to-pink-500' },
    { id: 'stretch', name: 'Stretching', icon: '🤸', gradient: 'from-green-400 to-emerald-500' },
    { id: 'cardio', name: 'Cardio', icon: '❤️', gradient: 'from-red-400 to-pink-500' }
  ];

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentTime(0);
    setCurrentStep(0);
    setIsPlaying(true);
    startTimer();
  };

  const startRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setCurrentStep(0);
    setCompletedExercises([]);
    if (routine.exercises.length > 0) {
      startExercise(routine.exercises[0]);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (currentExercise && newTime >= currentExercise.duration) {
          completeExercise();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const resumeTimer = () => {
    setIsPlaying(true);
    startTimer();
  };

  const resetTimer = () => {
    pauseTimer();
    setCurrentTime(0);
    setCurrentStep(0);
  };

  const completeExercise = () => {
    if (!currentExercise) return;
    
    pauseTimer();
    setCompletedExercises(prev => [...prev, currentExercise.id]);
    
    if (activeRoutine) {
      const currentIndex = activeRoutine.exercises.findIndex(e => e.id === currentExercise.id);
      if (currentIndex < activeRoutine.exercises.length - 1) {
        // Move to next exercise
        setTimeout(() => {
          const nextExercise = activeRoutine.exercises[currentIndex + 1];
          startExercise(nextExercise);
        }, 2000);
      } else {
        // Routine completed
        setActiveRoutine(null);
        setCurrentExercise(null);
      }
    } else {
      setCurrentExercise(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredContent = () => {
    if (selectedCategory === 'recommended') {
      return { routines: routines.slice(0, 2), exercises: exercises.slice(0, 4) };
    }
    
    return {
      routines: routines.filter(r => r.category === selectedCategory),
      exercises: exercises.filter(e => e.category === selectedCategory)
    };
  };

  const { routines: filteredRoutines, exercises: filteredExercises } = getFilteredContent();

  return (
    <div 
      className={`min-h-screen flex flex-col ${className}`}
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
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Physical Support</h1>
              <p className="text-white/70 text-sm">Movement for mental wellness</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-white font-bold">{completedExercises.length}</div>
              <div className="text-white/70 text-xs">Today</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">12</div>
              <div className="text-white/70 text-xs">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Exercise Player */}
      {currentExercise && (
        <div className="mx-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 via-emerald-400/20 to-green-500/30 blur-xl rounded-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{currentExercise.name}</h3>
                  <p className="text-white/70 capitalize">{currentExercise.category} • {currentExercise.difficulty}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-white/70" />
                  <span className="text-white font-mono text-lg">
                    {formatTime(currentExercise.duration - currentTime)}
                  </span>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentTime / currentExercise.duration)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {Math.round((currentTime / currentExercise.duration) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Instruction */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">
                    Step {currentStep + 1} of {currentExercise.instructions.length}
                  </span>
                  <div className="flex space-x-1">
                    {currentExercise.instructions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index <= currentStep ? 'bg-green-400' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white font-medium">
                  {currentExercise.instructions[currentStep] || currentExercise.instructions[0]}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                
                <button
                  onClick={isPlaying ? pauseTimer : resumeTimer}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500/40 to-emerald-500/40 flex items-center justify-center text-white hover:from-green-500/50 hover:to-emerald-500/50 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </button>
                
                <button
                  onClick={completeExercise}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-105`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 space-y-8">
        {/* Routines Section */}
        {filteredRoutines.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recommended Routines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoutines.map((routine) => (
                <div 
                  key={routine.id}
                  onClick={() => startRoutine(routine)}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl group-hover:scale-105 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${routine.gradient} flex items-center justify-center shadow-lg text-xl`}>
                          {routine.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{routine.name}</h3>
                          <p className="text-white/70 text-sm">{routine.description}</p>
                        </div>
                      </div>
                      
                      <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Play className="h-5 w-5 ml-0.5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between text-white/70 text-sm">
                      <span>{routine.exercises.length} exercises</span>
                      <span>{formatTime(routine.totalDuration)}</span>
                      <span className="capitalize">{routine.difficulty}</span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {routine.exercises.slice(0, 3).map((exercise) => (
                        <span 
                          key={exercise.id}
                          className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/70"
                        >
                          {exercise.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Exercises */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Individual Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <div 
                key={exercise.id}
                onClick={() => startExercise(exercise)}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{exercise.name}</h3>
                      <p className="text-white/70 text-sm capitalize">
                        {exercise.category} • {exercise.difficulty}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {completedExercises.includes(exercise.id) && (
                        <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
                          <Award className="h-3 w-3 text-green-300" />
                        </div>
                      )}
                      
                      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Play className="h-4 w-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                    <span>{formatTime(exercise.duration)}</span>
                    {exercise.sets && <span>{exercise.sets} sets</span>}
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {exercise.benefits.slice(0, 2).map((benefit) => (
                      <span 
                        key={benefit}
                        className="text-xs bg-green-500/20 px-2 py-1 rounded-full text-green-200"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalSupport;
