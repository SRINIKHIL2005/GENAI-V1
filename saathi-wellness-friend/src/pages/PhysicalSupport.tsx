import React, { useState } from "react";
import { Dumbbell, Timer, Play, Pause, RotateCcw, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WellnessHeader from "@/components/WellnessHeader";
import { useTheme } from "@/hooks/useTheme";

interface Exercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  category: "cardio" | "strength" | "flexibility" | "breathing";
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface WorkoutSession {
  id: string;
  exercises: Exercise[];
  totalDuration: number;
  date: string;
  completed: boolean;
}

const PhysicalSupport: React.FC = () => {
  const { theme } = useTheme();
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState<WorkoutSession[]>([]);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const exerciseLibrary: Exercise[] = [
    {
      id: "1",
      name: "Deep Breathing",
      duration: 300, // 5 minutes
      description: "Slow, deep breaths to reduce stress and anxiety",
      category: "breathing",
      difficulty: "beginner"
    },
    {
      id: "2", 
      name: "Gentle Stretching",
      duration: 600, // 10 minutes
      description: "Light stretches to release tension and improve flexibility",
      category: "flexibility",
      difficulty: "beginner"
    },
    {
      id: "3",
      name: "Wall Push-ups",
      duration: 300,
      description: "Gentle strength exercise using wall support",
      category: "strength", 
      difficulty: "beginner"
    },
    {
      id: "4",
      name: "Marching in Place",
      duration: 600,
      description: "Low-impact cardio to boost energy and mood",
      category: "cardio",
      difficulty: "beginner"
    },
    {
      id: "5",
      name: "Seated Yoga",
      duration: 900, // 15 minutes
      description: "Calming yoga poses that can be done sitting",
      category: "flexibility",
      difficulty: "beginner"
    },
    {
      id: "6",
      name: "Bodyweight Squats",
      duration: 300,
      description: "Strengthen legs and core with bodyweight squats",
      category: "strength",
      difficulty: "intermediate"
    }
  ];

  const workoutTemplates: WorkoutSession[] = [
    {
      id: "stress-relief",
      exercises: [exerciseLibrary[0], exerciseLibrary[1], exerciseLibrary[4]],
      totalDuration: 1800, // 30 minutes
      date: "",
      completed: false
    },
    {
      id: "energy-boost",
      exercises: [exerciseLibrary[3], exerciseLibrary[2], exerciseLibrary[0]],
      totalDuration: 1200, // 20 minutes  
      date: "",
      completed: false
    },
    {
      id: "quick-break",
      exercises: [exerciseLibrary[1], exerciseLibrary[0]],
      totalDuration: 900, // 15 minutes
      date: "",
      completed: false
    }
  ];

  const startWorkout = (template: WorkoutSession) => {
    const newWorkout = {
      ...template,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0]
    };
    setActiveWorkout(newWorkout);
    setCurrentExerciseIndex(0);
    setTimeRemaining(newWorkout.exercises[0].duration);
  };

  const toggleTimer = () => {
    if (!activeWorkout) return;
    
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            nextExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  };

  const nextExercise = () => {
    if (!activeWorkout) return;
    
    if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(activeWorkout.exercises[nextIndex].duration);
    } else {
      // Workout completed
      const completedWorkout = { ...activeWorkout, completed: true };
      setCompletedWorkouts([completedWorkout, ...completedWorkouts.slice(0, 9)]);
      setActiveWorkout(null);
      setCurrentExerciseIndex(0);
      setTimeRemaining(0);
      setIsPlaying(false);
      alert("Workout completed! Great job!");
    }
  };

  const resetWorkout = () => {
    if (!activeWorkout) return;
    setCurrentExerciseIndex(0);
    setTimeRemaining(activeWorkout.exercises[0].duration);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cardio": return <Heart className="h-4 w-4 text-red-500" />;
      case "strength": return <Dumbbell className="h-4 w-4 text-blue-500" />;
      case "flexibility": return <Zap className="h-4 w-4 text-green-500" />;
      case "breathing": return <Timer className="h-4 w-4 text-purple-500" />;
      default: return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "intermediate": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "advanced": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
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
      
      <WellnessHeader title="Physical Support" />
      
      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Active Workout */}
        {activeWorkout && (
          <Card className="backdrop-blur-2xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Dumbbell className="h-6 w-6 text-blue-400" />
                <span>Active Workout</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Exercise */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  {getCategoryIcon(activeWorkout.exercises[currentExerciseIndex].category)}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeWorkout.exercises[currentExerciseIndex].name}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {activeWorkout.exercises[currentExerciseIndex].description}
                </p>
                
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Exercise Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={toggleTimer}
                  className="h-16 w-16 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                
                <Button
                  onClick={resetWorkout}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={nextExercise}
                  variant="outline"
                  className="h-12"
                >
                  Skip Exercise
                </Button>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}</span>
                  <span>{Math.round(((currentExerciseIndex) / activeWorkout.exercises.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentExerciseIndex) / activeWorkout.exercises.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Templates */}
        {!activeWorkout && (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Workout</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Select a workout routine based on your current needs and goals.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workoutTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {template.id.replace("-", " ")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(template.totalDuration)} • {template.exercises.length} exercises
                    </p>
                    
                    <div className="space-y-2">
                      {template.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {getCategoryIcon(exercise.category)}
                          <span className="text-gray-700 dark:text-gray-300">{exercise.name}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => startWorkout(template)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Start Workout
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Library */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exerciseLibrary.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(exercise.category)}
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {exercise.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Duration: {formatTime(exercise.duration)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            {completedWorkouts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No completed workouts yet. Start your first workout above!
              </p>
            ) : (
              <div className="space-y-3">
                {completedWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {workout.id.replace("-", " ")}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {workout.date} • {formatTime(workout.totalDuration)}
                      </p>
                    </div>
                    <div className="text-green-600">
                      ✅ Completed
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

export default PhysicalSupport;
