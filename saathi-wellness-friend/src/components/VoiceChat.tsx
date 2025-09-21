import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface VoiceMessage {
  id: string;
  text: string;
  audioUrl?: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  duration?: number;
  isPlaying?: boolean;
}

interface VoiceChatProps {
  className?: string;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      text: "Hello! I'm ready to listen. Press and hold the microphone to start our voice conversation.",
      sender: 'ai',
      timestamp: new Date(),
      duration: 4
    }
  ]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  // Voice visualization bars
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        // Simulate audio levels during recording
        setAudioLevels(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
      setAudioLevels(new Array(20).fill(0));
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        processVoiceMessage(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceMessage = async (audioUrl: string) => {
    setIsProcessing(true);

    // Simulate speech-to-text processing
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: "This is a transcribed voice message from the user. In a real implementation, this would be the actual speech-to-text result.",
      audioUrl,
      sender: 'user',
      timestamp: new Date(),
      duration: recordingDuration / 10
    };

    setVoiceMessages(prev => [...prev, userMessage]);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing. I can hear the emotion in your voice. How would you like to continue our conversation?",
        sender: 'ai',
        timestamp: new Date(),
        duration: 5
      };

      setVoiceMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const playAudio = (messageId: string, audioUrl?: string) => {
    // In a real implementation, this would play the actual audio
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play();

      setVoiceMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isPlaying: true }
            : { ...msg, isPlaying: false }
        )
      );

      audioRef.current.onended = () => {
        setVoiceMessages(prev => 
          prev.map(msg => ({ ...msg, isPlaying: false }))
        );
      };
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Voice Chat Header */}
      <div className="relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 via-blue-200/15 to-purple-200/20 backdrop-blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Voice Chat</h1>
              <p className="text-white/70 text-sm">Speak your mind, I'm listening</p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            
            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {voiceMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-purple-400/30'
                  : 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30'
              } shadow-lg text-white`}
            >
              {/* Audio Waveform Visualization */}
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => playAudio(message.id, message.audioUrl)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  {message.isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>
                
                {/* Waveform */}
                <div className="flex items-center space-x-0.5 flex-1">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-white/40 rounded-full transition-all duration-300 ${
                        message.isPlaying ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        height: `${Math.random() * 20 + 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                <span className="text-xs opacity-70">
                  {message.duration ? formatDuration(message.duration) : '0:00'}
                </span>
              </div>
              
              {/* Transcription */}
              <p className="text-sm opacity-90 italic">{message.text}</p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {message.audioUrl && (
                  <button className="text-xs opacity-70 hover:opacity-100 transition-all">
                    ⬇
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                <span className="text-white text-sm">Processing voice...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Input Controls */}
      <div className="p-4">
        {/* Recording Visualization */}
        {isRecording && (
          <div className="mb-4">
            <div className="relative bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl border border-red-400/30 p-4">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {audioLevels.map((level, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-red-400 to-orange-400 rounded-full transition-all duration-100"
                    style={{ height: `${Math.max(4, level * 0.5)}px` }}
                  ></div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-white text-sm">Recording...</p>
                <p className="text-white/70 text-xs">{formatDuration(recordingDuration / 10)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Recording Button */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow Effect */}
            <div className={`absolute inset-0 ${
              isRecording 
                ? 'bg-gradient-to-r from-red-400/40 to-orange-400/40' 
                : 'bg-gradient-to-r from-purple-400/30 to-pink-400/30'
            } blur-2xl rounded-full animate-pulse`}></div>
            
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isProcessing}
              className={`relative w-20 h-20 rounded-full ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500/40 to-orange-500/40 border-red-400/50 scale-110'
                  : 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/50'
              } backdrop-blur-xl border-2 flex items-center justify-center text-white transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 animate-pulse" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-4">
          <p className="text-white/70 text-sm">
            {isRecording 
              ? 'Release to send your message' 
              : 'Hold to record your voice message'
            }
          </p>
          {!isRecording && (
            <div className="flex justify-center items-center space-x-4 mt-2">
              <button className="text-white/50 hover:text-white/80 transition-all">
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="text-white/50 text-xs">Clear conversation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
