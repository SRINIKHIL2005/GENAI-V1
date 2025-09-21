import React, { useState, useRef } from 'react';
import { TrendingUp, Calendar, Smile, Frown, Meh, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface MoodEntry {
  id: string;
  mood: number;
  emotion: string;
  note: string;
  activities: string[];
  timestamp: Date;
  faceEmotion?: {
    detected: boolean;
    confidence: number;
    emotions: { [key: string]: number };
  };
}

interface MoodTrackingProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const MoodTracking: React.FC<MoodTrackingProps> = ({ className = '', isOpen = true, onClose }) => {
  const { theme } = useTheme();
  const [currentMood, setCurrentMood] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([
    {
      id: '1',
      mood: 8,
      emotion: 'happy',
      note: 'Had a great chat session with Saathi today',
      activities: ['chat', 'exercise'],
      timestamp: new Date('2024-01-26T10:30:00'),
      faceEmotion: {
        detected: true,
        confidence: 0.87,
        emotions: { happy: 0.8, calm: 0.15, excited: 0.05 }
      }
    },
    {
      id: '2',
      mood: 6,
      emotion: 'calm',
      note: 'Feeling peaceful after meditation',
      activities: ['meditation', 'music'],
      timestamp: new Date('2024-01-25T16:45:00')
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const emotions = [
    { id: 'happy', label: 'Happy', icon: '😊', color: 'from-yellow-400 to-orange-500' },
    { id: 'calm', label: 'Calm', icon: '😌', color: 'from-blue-400 to-cyan-500' },
    { id: 'excited', label: 'Excited', icon: '🤩', color: 'from-purple-400 to-pink-500' },
    { id: 'sad', label: 'Sad', icon: '😢', color: 'from-blue-500 to-indigo-600' },
    { id: 'anxious', label: 'Anxious', icon: '😰', color: 'from-orange-500 to-red-500' },
    { id: 'angry', label: 'Angry', icon: '😠', color: 'from-red-500 to-pink-600' },
    { id: 'tired', label: 'Tired', icon: '😴', color: 'from-gray-400 to-gray-600' },
    { id: 'confused', label: 'Confused', icon: '🤔', color: 'from-yellow-500 to-amber-600' }
  ];

  const activities = [
    { id: 'chat', label: 'Chat with Saathi', icon: '💬' },
    { id: 'exercise', label: 'Exercise', icon: '🏃' },
    { id: 'meditation', label: 'Meditation', icon: '🧘' },
    { id: 'music', label: 'Listened to Music', icon: '🎵' },
    { id: 'sleep', label: 'Good Sleep', icon: '😴' },
    { id: 'social', label: 'Social Time', icon: '👥' },
    { id: 'work', label: 'Productive Work', icon: '💼' },
    { id: 'nature', label: 'Time in Nature', icon: '🌿' }
  ];

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Smile className="h-6 w-6 text-green-400" />;
    if (mood >= 6) return <Meh className="h-6 w-6 text-yellow-400" />;
    return <Frown className="h-6 w-6 text-red-400" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'from-green-400 to-emerald-500';
    if (mood >= 6) return 'from-yellow-400 to-orange-500';
    if (mood >= 4) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const captureEmotion = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Simulate emotion detection
        const mockEmotions = {
          happy: Math.random() * 0.6 + 0.2,
          calm: Math.random() * 0.4 + 0.1,
          sad: Math.random() * 0.3,
          anxious: Math.random() * 0.2
        };
        
        const dominantEmotion = Object.keys(mockEmotions).reduce((a, b) => 
          mockEmotions[a as keyof typeof mockEmotions] > mockEmotions[b as keyof typeof mockEmotions] ? a : b
        );
        
        setSelectedEmotion(dominantEmotion);
        setShowCamera(false);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const saveMoodEntry = () => {
    if (!selectedEmotion) {
      alert('Please select an emotion or use face detection');
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      emotion: selectedEmotion,
      note,
      activities: selectedActivities,
      timestamp: new Date(),
      faceEmotion: faceDetectionEnabled ? {
        detected: true,
        confidence: 0.85,
        emotions: { [selectedEmotion]: 0.8, calm: 0.15, excited: 0.05 }
      } : undefined
    };

    setRecentEntries(prev => [newEntry, ...prev.slice(0, 4)]);
    
    // Reset form
    setCurrentMood(5);
    setSelectedEmotion('');
    setNote('');
    setSelectedActivities([]);
    setFaceDetectionEnabled(false);
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-96 z-40 transform transition-transform duration-300 ${className}`}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-l from-indigo-200/20 via-blue-200/15 to-purple-200/20 backdrop-blur-2xl"></div>
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Mood Check-in</h2>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              ×
            </button>
          )}
        </div>

        {/* Mood Slider */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">How are you feeling?</h3>
              {getMoodIcon(currentMood)}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-white/70 text-sm">
                <span>Very Bad</span>
                <span>Amazing</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(Number(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, 
                      #ef4444 0%, #f97316 20%, #eab308 40%, 
                      #84cc16 60%, #22c55e 80%, #10b981 100%)`
                  }}
                />
                <div 
                  className="absolute top-0 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-y-1.5 transition-all duration-300"
                  style={{ left: `calc(${((currentMood - 1) / 9) * 100}% - 12px)` }}
                ></div>
              </div>
              
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{currentMood}</span>
                <span className="text-white/70 text-sm ml-2">out of 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emotion Selection */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Select Emotion</h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
                  className={`p-2 rounded-lg transition-all ${
                    faceDetectionEnabled 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-white/20 text-white/70'
                  }`}
                >
                  {faceDetectionEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={startCamera}
                  className="p-2 rounded-lg bg-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-all"
                >
                  📷
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    selectedEmotion === emotion.id
                      ? `bg-gradient-to-r ${emotion.color} border-white/50 scale-105`
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emotion.icon}</div>
                    <span className="text-white text-sm font-medium">{emotion.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4">
              <video 
                ref={videoRef} 
                autoPlay 
                className="w-full rounded-xl mb-4"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              <div className="flex space-x-3">
                <button
                  onClick={captureEmotion}
                  className="flex-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-white py-3 rounded-xl font-medium"
                >
                  Detect Emotion
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activities */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
            <h3 className="text-white font-semibold mb-4">What did you do today?</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`p-2 rounded-lg border transition-all text-sm ${
                    selectedActivities.includes(activity.id)
                      ? 'bg-green-500/30 border-green-400/50 text-green-200'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{activity.icon}</span>
                  {activity.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
            <h3 className="text-white font-semibold mb-4">Add a note (optional)</h3>
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was your day? What's on your mind?"
              className="w-full h-24 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 resize-none outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveMoodEntry}
          className="w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-lg rounded-xl group-hover:blur-xl transition-all"></div>
          
          <div className="relative bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-cyan-500/40 hover:to-blue-500/40 transition-all">
            <span>💾</span>
            <span>Save Mood Entry</span>
          </div>
        </button>

        {/* Recent Entries */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-lg rounded-2xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Entries</h3>
              <Calendar className="h-5 w-5 text-white/70" />
            </div>
            
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div 
                  key={entry.id}
                  className="p-3 bg-white/10 rounded-xl border border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)}`}></div>
                      <span className="text-white font-medium">{entry.mood}/10</span>
                      <span className="text-white/70 text-sm capitalize">{entry.emotion}</span>
                    </div>
                    
                    <span className="text-white/50 text-xs">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {entry.note && (
                    <p className="text-white/70 text-sm mb-2">{entry.note}</p>
                  )}
                  
                  {entry.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.activities.map((activityId) => {
                        const activity = activities.find(a => a.id === activityId);
                        return activity ? (
                          <span 
                            key={activityId}
                            className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/70"
                          >
                            {activity.icon} {activity.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  {entry.faceEmotion?.detected && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-purple-300">📷</span>
                      <span className="text-xs text-purple-300">
                        Face detected: {Math.round(entry.faceEmotion.confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;
