import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Heart, AlertTriangle, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import LoadingAnimation from '@/components/LoadingAnimation';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { saveChatMessage, getChatHistory } from '@/services/firebase.service';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'crisis';
  emotion?: string;
}

const Chat: React.FC = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisCard, setShowCrisisCard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const asset = (p: string) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '/')}${p}`;
  const backgroundImage = theme === 'light' 
    ? `url('${asset("Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png")}')`
    : `url('${asset("Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png")}')`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Firestore if signed in; else seed with a greeting
  useEffect(() => {
    const load = async () => {
      if (currentUser) {
        try {
          const history = await getChatHistory(currentUser.uid, 50);
          const mapped: Message[] = history
            .map((h: any) => ({
              id: h.id || String(h.timestamp?.seconds || Date.now()),
              text: h.text || h.content || '',
              sender: ((h.sender === 'user' || h.role === 'user') ? 'user' : 'ai') as Message['sender'],
              timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(),
              sentiment: h.sentiment,
              emotion: h.emotion,
            }))
            .reverse(); // oldest first for display order

          if (mapped.length > 0) {
            setMessages(mapped);
            return;
          }
        } catch (e) {
          // ignore and fall through to greeting
          console.warn('Failed to load chat history', e);
        }
      }
      // Seed a greeting if no history
      setMessages([{
        id: 'greet-1',
        text: "Hello! I'm Saathi, your mental wellness companion. I'm here to listen and support you. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date(),
        sentiment: 'positive'
      }]);
    };
    load();
  }, [currentUser]);

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

  // Try Gemini via REST when VITE_GEMINI_API_KEY is present; else fallback
  const callGemini = async (history: Message[], userText: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = (import.meta.env.VITE_GEMINI_MODEL as string) || 'gemini-1.5-flash';
    if (!apiKey) return '';

    const systemPrompt = `You are Saathi, a compassionate AI wellness companion. Be empathetic, supportive, and avoid medical diagnoses. If crisis indicators appear, provide supportive resources.`;

    // Map our messages to Gemini contents
    const contents: any[] = [];
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    for (const m of history.slice(-10)) {
      contents.push({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] });
    }
    contents.push({ role: 'user', parts: [{ text: userText }] });

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });
      if (!resp.ok) {
        console.warn('Gemini HTTP error', resp.status, await resp.text());
        return '';
      }
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(' ') || '';
      return text;
    } catch (e) {
      console.warn('Gemini request failed', e);
      return '';
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
    // Persist user message if authenticated
    if (currentUser) {
      try { await saveChatMessage(currentUser.uid, { text: userMessage.text, sender: 'user', sentiment: userMessage.sentiment, emotion: userMessage.emotion }); } catch {}
    }
    setInputText('');
    setIsTyping(true);

    // Show crisis card if crisis detected
    if (sentiment === 'crisis') {
      setShowCrisisCard(true);
    }

    // Try online Gemini first, fallback to local template
    (async () => {
      const online = await callGemini(messages, inputText);
      const aiText = online || generateAIResponse(inputText, sentiment);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
        sentiment: 'positive'
      };
      setMessages(prev => [...prev, aiResponse]);
      // Persist AI message if authenticated
      if (currentUser) {
        try { await saveChatMessage(currentUser.uid, { text: aiResponse.text, sender: 'ai', sentiment: aiResponse.sentiment }); } catch {}
      }
      setIsTyping(false);
    })();
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
      
      {showCrisisCard && <CrisisCard />}

      <NavigationHeader 
        userName={currentUser?.displayName || 'Friend'}
      />

      <div className="relative max-w-4xl mx-auto p-6 space-y-6 flex-1 flex flex-col">
        {/* Chat Header Section */}
        <LoadingAnimation delay={100} direction="up">
          <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <MessageCircle className={`h-6 w-6 ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} />
                <span>AI Wellness Chat</span>
              </CardTitle>
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                Your safe space to talk, share feelings, and receive personalized mental health support.
              </p>
            </CardHeader>
          </Card>
        </LoadingAnimation>

        {/* Messages Container */}
        <LoadingAnimation delay={200} direction="up">
          <Card className={`backdrop-blur-2xl ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-white/10 border-white/20'} flex-1 flex flex-col`}>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                {messages.map((message, index) => (
                  <LoadingAnimation key={message.id} delay={index * 100} direction="up">
                    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transform hover:scale-105 transition-all duration-200 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-xl border border-cyan-400/30 text-white'
                            : theme === 'light' 
                              ? 'bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-xl border border-slate-300/50 text-slate-900'
                              : 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 text-white'
                        } shadow-lg`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${theme === 'light' ? 'opacity-60' : 'opacity-70'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.sentiment === 'crisis' && (
                            <AlertTriangle className="h-4 w-4 text-red-300" />
                          )}
                          {message.emotion && (
                            <span className={`text-xs capitalize ${theme === 'light' ? 'opacity-60' : 'opacity-70'}`}>{message.emotion}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </LoadingAnimation>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                      theme === 'light' 
                        ? 'bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-xl border border-slate-300/50' 
                        : 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30'
                    }`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-slate-500' : 'bg-white/70'}`}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-slate-500' : 'bg-white/70'}`} style={{ animationDelay: '0.1s' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-slate-500' : 'bg-white/70'}`} style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-full"></div>
                  
                  <div className={`relative rounded-full border p-2 shadow-xl ${
                    theme === 'light' 
                      ? 'bg-white/80 backdrop-blur-xl border-slate-300/50' 
                      : 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-2xl border-white/30'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share what's on your mind..."
                        className={`flex-1 bg-transparent outline-none px-4 py-2 ${
                          theme === 'light' 
                            ? 'text-slate-900 placeholder-slate-500' 
                            : 'text-white placeholder-white/50'
                        }`}
                      />
                      
                      <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 transition-all">
                        <Mic className="h-5 w-5 text-white" />
                      </Button>
                      
                      <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 hover:from-indigo-500/40 hover:to-blue-500/40 transition-all">
                        <Volume2 className="h-5 w-5 text-white" />
                      </Button>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        size="icon"
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <p className={`text-center text-xs mt-3 ${theme === 'light' ? 'text-slate-500' : 'text-white/50'}`}>
                  Saathi uses AI to provide support. Always consult professionals for serious concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </LoadingAnimation>
      </div>
    </div>
  );
};

export default Chat;
