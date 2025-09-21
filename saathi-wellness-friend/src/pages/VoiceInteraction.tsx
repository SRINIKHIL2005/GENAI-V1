import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

interface VoiceSession {
  id: string;
  transcript: string;
  response: string;
  timestamp: Date;
  mood: "positive" | "neutral" | "negative";
}

const VoiceInteraction: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          processVoiceInput(transcript);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        // Fallback for browsers without speech recognition
        setTranscript("Hello, I'm feeling a bit anxious today and could use some guidance.");
        processVoiceInput("Hello, I'm feeling a bit anxious today and could use some guidance.");
      }
    }
  };

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        "I understand you're feeling anxious. Let's take a moment to breathe together. Try taking slow, deep breaths in through your nose and out through your mouth.",
        "Thank you for sharing that with me. Anxiety is completely normal. Would you like to try a quick grounding exercise? Look around and name 5 things you can see.",
        "I hear you, and I'm here to support you. Sometimes anxiety can feel overwhelming, but remember that you're stronger than you know. Let's focus on the present moment.",
        "It's okay to feel this way. You're taking a positive step by reaching out. Would you like to explore what might be causing these feelings, or would you prefer some calming techniques?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setCurrentResponse(randomResponse);
      
      const newSession: VoiceSession = {
        id: Date.now().toString(),
        transcript: input,
        response: randomResponse,
        timestamp: new Date(),
        mood: input.toLowerCase().includes("anxious") || input.toLowerCase().includes("stressed") ? "negative" : 
              input.toLowerCase().includes("happy") || input.toLowerCase().includes("good") ? "positive" : "neutral"
      };
      
      setSessions([newSession, ...sessions.slice(0, 9)]);
      setIsProcessing(false);
      
      if (!isMuted) {
        speakResponse(randomResponse);
      }
    }, 2000);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const clearSession = () => {
    setTranscript("");
    setCurrentResponse("");
    stopSpeaking();
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "negative": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default: return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
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
      
      <NavigationHeader 
        userName={currentUser?.displayName || 'Friend'}
      />
      
      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Voice Control Panel */}
        <Card className="backdrop-blur-2xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Mic className="h-6 w-6 text-blue-400" />
              <span>Voice Wellness Support</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Talk to your AI wellness companion. Share your feelings and get personalized support.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Voice Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={toggleListening}
                disabled={isProcessing}
                className={`h-20 w-20 rounded-full ${
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="icon"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={isPlaying ? stopSpeaking : clearSession}
                  variant="outline"
                  size="icon"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {isProcessing ? "Processing your message..." :
                 isListening ? "Listening... Speak now" :
                 isPlaying ? "AI is responding..." :
                 "Tap the microphone to start"}
              </p>
            </div>

            {/* Current Session */}
            {(transcript || currentResponse) && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {transcript && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">You said:</p>
                    <p className="text-gray-900 dark:text-white">{transcript}</p>
                  </div>
                )}
                
                {currentResponse && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">AI Response:</p>
                    <p className="text-gray-900 dark:text-white">{currentResponse}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Session History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No conversations yet. Start by tapping the microphone above!
              </p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(session.mood)}`}>
                        {session.mood}
                      </span>
                      <span className="text-xs text-gray-500">
                        {session.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">You:</p>
                        <p className="text-gray-900 dark:text-white">{session.transcript}</p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <p className="text-sm text-blue-600 dark:text-blue-400">AI:</p>
                        <p className="text-gray-900 dark:text-white">{session.response}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Interaction Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">What to share:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• How you're feeling today</li>
                  <li>• Any stress or anxiety</li>
                  <li>• Sleep or energy concerns</li>
                  <li>• Relationship challenges</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it helps:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Personalized guidance</li>
                  <li>• Breathing exercises</li>
                  <li>• Mindfulness techniques</li>
                  <li>• Emotional support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceInteraction;
