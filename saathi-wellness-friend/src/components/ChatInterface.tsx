import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Heart, AlertTriangle, MessageCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'crisis';
  emotion?: string;
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Saathi, your mental wellness companion. I'm here to listen and support you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      sentiment: 'positive'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisCard, setShowCrisisCard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectSentiment = (text: string): { sentiment: 'positive' | 'neutral' | 'negative' | 'crisis', emotion?: string } => {
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'want to die'];
    const negativeKeywords = ['sad', 'depressed', 'anxious', 'worried', 'stressed', 'overwhelmed'];
    const positiveKeywords = ['happy', 'good', 'great', 'excited', 'wonderful', 'amazing'];

    const lowerText = text.toLowerCase();
    
    if (crisisKeywords.some(keyword => lowerText.includes(keyword))) {
      return { sentiment: 'crisis', emotion: 'distressed' };
    } else if (negativeKeywords.some(keyword => lowerText.includes(keyword))) {
      return { sentiment: 'negative', emotion: 'sad' };
    } else if (positiveKeywords.some(keyword => lowerText.includes(keyword))) {
      return { sentiment: 'positive', emotion: 'happy' };
    }
    
    return { sentiment: 'neutral', emotion: 'calm' };
  };

  const generateAIResponse = (_userMessage: string, sentiment: string): string => {
    if (sentiment === 'crisis') {
      return "I hear that you're going through a really difficult time right now, and I want you to know that your feelings are valid. You don't have to face this alone. Would you like me to connect you with immediate support resources?";
    } else if (sentiment === 'negative') {
      return "I understand you're feeling difficult emotions right now. That takes courage to share. Would you like to try some breathing exercises, or would you prefer to talk about what's on your mind?";
    } else if (sentiment === 'positive') {
      return "I'm so glad to hear you're feeling good! It's wonderful when we can recognize positive moments. What's contributing to this positive feeling today?";
    } else {
      return "Thank you for sharing with me. I'm here to listen and support you. What would be most helpful for you right now?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const { sentiment, emotion } = detectSentiment(inputText);
    userMessage.sentiment = sentiment;
    userMessage.emotion = emotion;

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Show crisis card if crisis detected
    if (sentiment === 'crisis') {
      setShowCrisisCard(true);
    }

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, sentiment),
        sender: 'ai',
        timestamp: new Date(),
        sentiment: 'positive'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const CrisisCard = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full">
        {/* Crisis Card Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 via-orange-400/20 to-red-500/30 blur-xl rounded-2xl"></div>
        
        <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">You're Not Alone</h3>
          </div>
          
          <p className="text-white/90 mb-6">
            I can sense you're going through a really tough time. Your feelings are valid, and there are people who want to help.
          </p>
          
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all">
              <MessageCircle className="h-5 w-5" />
              <span>Call Crisis Helpline (1-800-273-8255)</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all">
              <MessageCircle className="h-5 w-5" />
              <span>Continue Talking with Saathi</span>
            </button>
          </div>
          
          <button 
            onClick={() => setShowCrisisCard(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );

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
      
      {showCrisisCard && <CrisisCard />}
      
      {/* Chat Header */}
      <div className="relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 via-blue-200/15 to-purple-200/20 backdrop-blur-2xl"></div>
        <div className="relative flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Saathi Chat</h1>
            <p className="text-white/70 text-sm">Your confidential wellness companion</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-xl border border-cyan-400/30 text-white'
                  : 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 text-white'
              } shadow-lg`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sentiment === 'crisis' && (
                  <AlertTriangle className="h-4 w-4 text-red-300" />
                )}
                {message.emotion && (
                  <span className="text-xs opacity-70 capitalize">{message.emotion}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-full"></div>
          
          <div className="relative bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-2xl rounded-full border border-white/30 p-2 shadow-xl">
            <div className="flex items-center space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none px-4 py-2"
              />
              
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center hover:from-purple-500/40 hover:to-pink-500/40 transition-all">
                <Mic className="h-5 w-5 text-white" />
              </button>
              
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 flex items-center justify-center hover:from-indigo-500/40 hover:to-blue-500/40 transition-all">
                <Volume2 className="h-5 w-5 text-white" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center hover:from-cyan-500/40 hover:to-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-white/50 text-xs mt-3">
          Saathi uses AI to provide support. Always consult professionals for serious concerns.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
