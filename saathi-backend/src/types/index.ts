import { Request, Response } from 'express';

// Extend Express types
export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email?: string;
    displayName?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    disabled: boolean;
    customClaims?: Record<string, any>;
  };
  requestId?: string;
}

// User types
export interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  age?: number;
  gender?: string;
  location?: string;
  emergencyContact?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    reminders: boolean;
    moodCheckins: boolean;
    crisisAlerts: boolean;
  };
  privacy: {
    shareData: boolean;
    anonymousAnalytics: boolean;
    dataRetention: string;
  };
}

export interface MentalHealthProfile {
  conditions: string[];
  medications: string[];
  therapyHistory: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  lastAssessment?: Date;
  goals: string[];
  supportNetwork: string[];
}

export interface UserDocument {
  id: string;
  profile: UserProfile;
  preferences: UserPreferences;
  mentalHealthProfile: MentalHealthProfile;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  userId: string;
  timestamp: Date;
  metadata?: {
    platform?: string;
    model?: string;
    usage?: any;
    crisisAnalysis?: any;
    streamingMode?: boolean;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  type: 'wellness_chat' | 'wellness_chat_stream' | 'crisis_support' | 'general';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastActivity?: Date;
  messageCount: number;
  metadata?: {
    platform?: string;
    userAgent?: string;
    ip?: string;
  };
}

// Mood types
export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  intensity: number;
  triggers?: string[];
  notes?: string;
  timestamp: Date;
  context?: {
    location?: string;
    weather?: string;
    activities?: string[];
    people?: string[];
  };
  analysis?: {
    sentiment: number;
    emotions: string[];
    recommendations: string[];
  };
}

// Voice types
export interface VoiceSession {
  id: string;
  userId: string;
  audioUrl?: string;
  transcript?: string;
  confidence?: number;
  emotions?: any[];
  analysis?: {
    sentiment: any;
    crisisRisk: string;
    recommendations: string[];
  };
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Music types
export interface MusicPreferences {
  userId: string;
  genres: string[];
  artists: string[];
  moodMappings: {
    [mood: string]: {
      genres: string[];
      energy: number;
      valence: number;
    };
  };
  therapeuticGoals: string[];
  updatedAt: Date;
}

export interface MusicRecommendation {
  trackId: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  mood: string;
  energy: number;
  valence: number;
  therapeuticBenefits: string[];
  reasoning: string;
}

// Physical activity types
export interface PhysicalActivity {
  id: string;
  userId: string;
  type: string;
  name: string;
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
  moodBefore?: string;
  moodAfter?: string;
  notes?: string;
  timestamp: Date;
  calories?: number;
  heartRate?: {
    average: number;
    max: number;
  };
}

export interface ExerciseRecommendation {
  id: string;
  name: string;
  type: string;
  description: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  equipment?: string[];
  instructions: string[];
  benefits: string[];
  suitableFor: {
    moods: string[];
    fitnessLevels: string[];
    timeAvailable: number[];
  };
  modifications?: string[];
}

// Progress tracking types
export interface ProgressTracking {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    moodAverage: number;
    moodStability: number;
    activityLevel: number;
    sleepQuality: number;
    socialInteraction: number;
    stressLevel: number;
    copingSkillsUsage: number;
    goalsProgress: number;
  };
  goals: {
    id: string;
    description: string;
    targetDate: Date;
    progress: number;
    status: 'active' | 'completed' | 'paused';
  }[];
  insights: string[];
  recommendations: string[];
  achievements: {
    id: string;
    title: string;
    description: string;
    earnedAt: Date;
    category: string;
  }[];
  updatedAt: Date;
}

// Crisis types
export interface CrisisEvent {
  id: string;
  userId: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  type: 'suicidal_ideation' | 'self_harm' | 'panic_attack' | 'psychotic_episode' | 'substance_abuse' | 'other';
  message: string;
  location?: string;
  contactedSupport: boolean;
  interventions: string[];
  outcome?: string;
  followUpRequired: boolean;
  timestamp: Date;
  resolved: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  timestamp?: Date;
}

export interface PaginatedResponse<T> extends APIResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// OpenAI types
export interface OpenAIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finishReason: string;
  model: string;
}

export interface MoodAnalysis {
  primaryEmotion: string;
  emotions: {
    [emotion: string]: number;
  };
  sentiment: {
    score: number;
    magnitude: number;
  };
  intensity: number;
  stability: 'stable' | 'fluctuating' | 'declining' | 'improving';
  triggers: string[];
  recommendations: string[];
  confidence: number;
}

export interface CrisisAnalysis {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  indicators: string[];
  recommendations: string[];
  resources?: {
    suicide?: string;
    crisis?: string;
    emergency?: string;
    local?: string[];
  };
  immediateAction: boolean;
  followUpRequired: boolean;
  confidence: number;
}

// Socket.IO types
export interface SocketUser {
  uid: string;
  email?: string;
  displayName?: string;
  emailVerified: boolean;
}

export interface SocketConnection {
  socketId: string;
  userId: string;
  lastActivity: Date;
}

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  data?: any;
  timestamp?: Date;
}

// Utility types
export type RequestHandler = (req: AuthenticatedRequest, res: Response) => Promise<void> | void;
export type OptionalAuthRequest = Request & { user?: AuthenticatedRequest['user'] };

// Export default for module import
export default {};

// All types are already exported individually above