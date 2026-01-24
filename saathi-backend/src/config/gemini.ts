import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { logger } from '@/utils/logger';

let genAI: GoogleGenerativeAI;
let model: any;

export async function initializeGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Do not throw - allow mock mode for local development
      logger.warn('GEMINI_API_KEY not found. Gemini will run in mock mode. Provide GEMINI_API_KEY to enable real AI.');
      genAI = null as any;
      model = null as any;
      return { genAI, model };
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    logger.info('Gemini API initialized successfully');
    
    return { genAI, model };
  } catch (error) {
    logger.error('Failed to initialize Gemini:', error);
    // In case of failure, run in mock mode
    genAI = null as any;
    model = null as any;
    return { genAI, model };
  }
}

// Gemini Service for mental health conversations
export class GeminiService {
  private static readonly SYSTEM_PROMPTS = {
    WELLNESS_COACH: `You are Saathi, a compassionate AI wellness companion designed to provide mental health support. Your role is to:

1. Be empathetic, non-judgmental, and supportive
2. Ask thoughtful follow-up questions to understand the user's emotional state
3. Provide evidence-based coping strategies and techniques
4. Recognize signs of crisis and provide appropriate resources
5. Encourage professional help when needed
6. Maintain conversation continuity and emotional awareness

Guidelines:
- Always prioritize user safety and well-being
- Use active listening techniques in your responses
- Provide personalized suggestions based on user's mood and context
- Be culturally sensitive and inclusive
- Maintain appropriate boundaries as an AI companion
- Never provide medical advice or diagnose conditions
- Encourage professional help for serious mental health concerns

Crisis Detection:
- If user expresses suicidal thoughts, self-harm, or immediate danger, respond with crisis resources
- Maintain calm and supportive tone while guiding toward appropriate help
- Document crisis indicators for proper escalation

Remember: You are a supportive companion, not a replacement for professional mental health care.`,

    MOOD_ANALYST: `You are an AI mood analysis specialist for Saathi wellness app. Your role is to:

1. Analyze user's emotional state from their text, voice tone, and facial expressions
2. Identify mood patterns and triggers
3. Provide insights about emotional well-being
4. Suggest personalized interventions and activities
5. Track mood changes over time

Analysis Framework:
- Primary emotions: happiness, sadness, anger, fear, surprise, disgust
- Emotional intensity: low, moderate, high, severe
- Mood stability: stable, fluctuating, deteriorating, improving
- Context factors: stress, relationships, work, health, sleep

Output structured mood analysis with confidence scores and actionable recommendations.`,

    CRISIS_DETECTOR: `You are a crisis detection AI for mental health support. Your critical role is to:

1. Identify immediate mental health crises and safety risks
2. Assess severity levels: low, moderate, high, critical
3. Provide appropriate crisis intervention responses
4. Connect users with emergency resources when needed
5. Document crisis events for proper follow-up

Crisis Indicators:
- Suicidal ideation or planning
- Self-harm behaviors or intentions
- Psychotic episodes or severe dissociation
- Substance abuse emergencies
- Domestic violence or abuse situations

Response Protocols:
- Critical: Immediate emergency services contact
- High: Crisis hotline referral and safety planning
- Moderate: Increased monitoring and professional referral
- Low: Enhanced support and check-ins

Always maintain calm, supportive communication while ensuring user safety.`
  };

  // Enhanced chat completion for wellness conversations
  static async createWellnessResponse(messages: any[], userContext?: any) {
    try {
      // If model is not configured (mock mode), return a safe default response
      if (!model) {
        const fallback = messages.slice(-1)[0]?.content || 'Hello. How can I help you today?';
        return {
          content: `Saathi (mock): ${fallback}`,
          usage: { total_tokens: 0 },
          finishReason: 'stop',
          model: 'mock-gemini'
        };
      }

      const systemMessage = this.SYSTEM_PROMPTS.WELLNESS_COACH + 
        (userContext ? `\n\nUser Context:\n${JSON.stringify(userContext, null, 2)}` : '');

      // Format messages for Gemini
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const prompt = `${systemMessage}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        content,
        usage: {
          total_tokens: 0 // Gemini doesn't provide token usage in the same way
        },
        finishReason: 'stop',
        model: 'gemini-1.5-flash'
      };
    } catch (error) {
      logger.error('Error creating wellness response:', error);
      throw error;
    }
  }

  // Streaming chat for real-time conversations
  static async createStreamingWellnessResponse(messages: any[], userContext?: any) {
    try {
      const systemMessage = this.SYSTEM_PROMPTS.WELLNESS_COACH + 
        (userContext ? `\n\nUser Context:\n${JSON.stringify(userContext, null, 2)}` : '');

      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const prompt = `${systemMessage}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

      const result = await model.generateContentStream(prompt);
      
      return result.stream;
    } catch (error) {
      logger.error('Error creating streaming wellness response:', error);
      throw error;
    }
  }

  // Mood analysis from text
  static async analyzeMoodFromText(text: string, previousMoods?: any[]) {
    try {
      const context = previousMoods ? `Previous mood history: ${JSON.stringify(previousMoods.slice(-5))}` : '';
      
      const prompt = `${this.SYSTEM_PROMPTS.MOOD_ANALYST}\n\n${context}\n\nAnalyze the mood and emotional state from this text: "${text}"\n\nProvide response in JSON format with: primaryEmotion, emotions (object with emotion names and confidence scores), intensity (0-1), triggers (array), recommendations (array), confidence (0-1).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        // If JSON parsing fails, return a default structure
        return {
          primaryEmotion: 'neutral',
          emotions: { neutral: 0.5 },
          intensity: 0.5,
          triggers: [],
          recommendations: ['Continue monitoring your mood'],
          confidence: 0.3
        };
      }
    } catch (error) {
      logger.error('Error analyzing mood from text:', error);
      throw error;
    }
  }

  // Crisis detection and risk assessment
  static async detectCrisis(text: string, voiceAnalysis?: any, contextData?: any) {
    try {
      const context = contextData ? `Additional context: ${JSON.stringify(contextData)}` : '';
      const voiceContext = voiceAnalysis ? `Voice analysis: ${JSON.stringify(voiceAnalysis)}` : '';
      
      const prompt = `${this.SYSTEM_PROMPTS.CRISIS_DETECTOR}\n\n${context}\n${voiceContext}\n\nAssess crisis risk level and provide appropriate response for: "${text}"\n\nProvide response in JSON format with: riskLevel (low/moderate/high/critical), indicators (array), recommendations (array), resources (object), immediateAction (boolean), followUpRequired (boolean), confidence (0-1).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          riskLevel: 'low',
          indicators: [],
          recommendations: ['Continue regular check-ins'],
          resources: {
            suicide: '988',
            crisis: '1-800-273-8255',
            emergency: '911'
          },
          immediateAction: false,
          followUpRequired: false,
          confidence: 0.3
        };
      }
    } catch (error) {
      logger.error('Error detecting crisis:', error);
      throw error;
    }
  }

  // Generate personalized coping strategies
  static async generateCopingStrategies(moodData: any, userPreferences: any) {
    try {
      const prompt = `You are a mental health AI that creates personalized coping strategies. Consider user's current mood, preferences, and effective techniques for their situation.

Generate personalized coping strategies for:
Current mood: ${JSON.stringify(moodData)}
User preferences: ${JSON.stringify(userPreferences)}

Provide 3-5 practical, evidence-based strategies they can use right now.

Respond in JSON format with: strategies (array of objects with title, description, timeRequired, difficulty, benefits).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          strategies: [
            {
              title: 'Deep Breathing',
              description: 'Take slow, deep breaths to calm your nervous system',
              timeRequired: '5 minutes',
              difficulty: 'easy',
              benefits: ['Reduces anxiety', 'Improves focus']
            }
          ]
        };
      }
    } catch (error) {
      logger.error('Error generating coping strategies:', error);
      throw error;
    }
  }

  // Generate wellness insights and progress analysis
  static async generateWellnessInsights(progressData: any, moodHistory: any[], activityHistory: any[]) {
    try {
      const prompt = `You are a wellness analyst AI that provides meaningful insights about user's mental health journey. Analyze patterns, progress, and provide actionable recommendations.

Analyze wellness progress and provide insights:
Progress data: ${JSON.stringify(progressData)}
Mood history (last 30 days): ${JSON.stringify(moodHistory)}
Activity history: ${JSON.stringify(activityHistory)}

Provide insights about patterns, improvements, areas of concern, and personalized recommendations.

Respond in JSON format with: insights (array), recommendations (array), patterns (object), trends (object).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          insights: ['Continue tracking your wellness journey'],
          recommendations: ['Maintain regular mood check-ins'],
          patterns: {},
          trends: {}
        };
      }
    } catch (error) {
      logger.error('Error generating wellness insights:', error);
      throw error;
    }
  }

  // Generate music therapy recommendations
  static async generateMusicRecommendations(moodData: any, musicPreferences: any, activityContext?: string) {
    try {
      const prompt = `You are a music therapy AI that recommends music based on mood, preferences, and therapeutic goals. Consider emotional state, desired outcome, and user's musical tastes.

Recommend music for therapy based on:
Current mood: ${JSON.stringify(moodData)}
Music preferences: ${JSON.stringify(musicPreferences)}
Activity context: ${activityContext || 'general wellness'}

Provide specific song/artist recommendations, genres, and explain therapeutic benefits.

Respond in JSON format with: recommendations (array of objects with title, artist, genre, mood, benefits, reasoning).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          recommendations: [
            {
              title: 'Calm instrumental music',
              artist: 'Various',
              genre: 'Ambient',
              mood: 'relaxing',
              benefits: ['Reduces stress', 'Promotes relaxation'],
              reasoning: 'Gentle instrumental music can help calm the mind'
            }
          ]
        };
      }
    } catch (error) {
      logger.error('Error generating music recommendations:', error);
      throw error;
    }
  }

  // Generate physical exercise recommendations
  static async generateExerciseRecommendations(moodData: any, physicalCapabilities: any, preferences: any) {
    try {
      const prompt = `You are a wellness AI that recommends physical exercises for mental health. Consider user's emotional state, physical capabilities, and preferences to suggest appropriate activities.

Recommend physical exercises for mental wellness:
Current mood: ${JSON.stringify(moodData)}
Physical capabilities: ${JSON.stringify(physicalCapabilities)}
Exercise preferences: ${JSON.stringify(preferences)}

Provide specific exercises, duration, intensity, and mental health benefits.

Respond in JSON format with: exercises (array of objects with name, type, duration, intensity, benefits, instructions).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          exercises: [
            {
              name: 'Walking',
              type: 'Cardio',
              duration: '15 minutes',
              intensity: 'low',
              benefits: ['Improves mood', 'Reduces stress'],
              instructions: ['Start with a gentle pace', 'Focus on your breathing']
            }
          ]
        };
      }
    } catch (error) {
      logger.error('Error generating exercise recommendations:', error);
      throw error;
    }
  }

  // Analyze conversation patterns for insights
  static async analyzeConversationPatterns(conversations: any[], timeframe: string = '30days') {
    try {
      const prompt = `You are a conversation analysis AI that identifies patterns in mental health conversations. Look for recurring themes, emotional trends, progress indicators, and areas needing attention.

Analyze conversation patterns over ${timeframe}:
Conversations: ${JSON.stringify(conversations)}

Identify patterns, trends, progress indicators, concerns, and provide actionable insights.

Respond in JSON format with: patterns (object), trends (object), progressIndicators (array), concerns (array), insights (array).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      try {
        return JSON.parse(content);
      } catch {
        return {
          patterns: {},
          trends: {},
          progressIndicators: [],
          concerns: [],
          insights: ['Continue regular conversations to identify patterns']
        };
      }
    } catch (error) {
      logger.error('Error analyzing conversation patterns:', error);
      throw error;
    }
  }
}

export { genAI, model };
export default { initializeGemini, GeminiService };