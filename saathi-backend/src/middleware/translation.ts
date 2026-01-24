import { Request, Response, NextFunction } from 'express';
import { translationService } from '@/services/translationService';
import { logger } from '@/utils/logger';

export interface TranslationRequest extends Request {
  userLanguage?: string;
  translateResponse?: boolean;
  translationContext?: {
    culturalContext?: string;
    emotionalTone?: string;
    contentType?: 'general' | 'mental-health' | 'crisis' | 'resource';
  };
}

/**
 * Middleware to detect user language from headers or query params
 */
export const detectUserLanguage = (req: TranslationRequest, res: Response, next: NextFunction): void => {
  try {
    // Check for language in various places
    const language = 
      req.query.lang as string ||
      req.headers['accept-language']?.split(',')[0]?.split('-')[0] ||
      req.headers['x-user-language'] as string ||
      'en'; // Default to English

    req.userLanguage = language;
    req.translateResponse = language !== 'en'; // Only translate if not English
    
    logger.info(`Detected user language: ${language}`);
    next();
  } catch (error) {
    logger.error('Language detection middleware failed:', error);
    req.userLanguage = 'en';
    req.translateResponse = false;
    next();
  }
};

/**
 * Middleware to set translation context based on route
 */
export const setTranslationContext = (contentType: 'general' | 'mental-health' | 'crisis' | 'resource') => {
  return (req: TranslationRequest, res: Response, next: NextFunction): void => {
    req.translationContext = {
      contentType,
      culturalContext: req.userLanguage === 'hi' ? 'indian' : 'western',
      emotionalTone: req.body?.emotionalState || 'neutral'
    };
    next();
  };
};

/**
 * Middleware to translate API responses
 */
export const translateResponse = async (req: TranslationRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.translateResponse || req.userLanguage === 'en') {
    return next();
  }

  const originalSend = res.send;
  const originalJson = res.json;

  // Override res.send
  res.send = function(body: any) {
    if (typeof body === 'string') {
      translateAndSend(body, 'send');
    } else {
      originalSend.call(this, body);
    }
    return this;
  };

  // Override res.json
  res.json = function(body: any) {
    if (body && typeof body === 'object') {
      translateAndSend(body, 'json');
    } else {
      originalJson.call(this, body);
    }
    return this;
  };

  const translateAndSend = async (body: any, method: 'send' | 'json') => {
    try {
      const translatedBody = await translateResponseBody(body, req.userLanguage!, req.translationContext);
      
      if (method === 'send') {
        originalSend.call(res, translatedBody);
      } else {
        originalJson.call(res, translatedBody);
      }
    } catch (error) {
      logger.error('Response translation failed:', error);
      // Send original response if translation fails
      if (method === 'send') {
        originalSend.call(res, body);
      } else {
        originalJson.call(res, body);
      }
    }
  };

  next();
};

/**
 * Helper function to translate response body
 */
async function translateResponseBody(body: any, targetLanguage: string, context?: any): Promise<any> {
  if (!body) return body;

  // Handle string responses
  if (typeof body === 'string') {
    if (context?.contentType === 'mental-health') {
      const result = await translationService.translateMentalHealthResponse(body, targetLanguage, context);
      return result.translatedText;
    } else if (context?.contentType === 'crisis') {
      const result = await translationService.translateCrisisContent(body, targetLanguage);
      return result.translatedText;
    } else {
      return await translationService.translateText(body, targetLanguage);
    }
  }

  // Handle object responses
  if (typeof body === 'object' && !Array.isArray(body)) {
    const translatedBody: any = { ...body };

    // Common fields to translate
    const fieldsToTranslate = ['message', 'content', 'text', 'response', 'title', 'description', 'error'];
    
    for (const field of fieldsToTranslate) {
      if (translatedBody[field] && typeof translatedBody[field] === 'string') {
        if (context?.contentType === 'mental-health') {
          const result = await translationService.translateMentalHealthResponse(
            translatedBody[field], 
            targetLanguage, 
            context
          );
          translatedBody[field] = result.translatedText;
        } else if (context?.contentType === 'crisis') {
          const result = await translationService.translateCrisisContent(translatedBody[field], targetLanguage);
          translatedBody[field] = result.translatedText;
        } else {
          translatedBody[field] = await translationService.translateText(translatedBody[field], targetLanguage);
        }
      }
    }

    // Handle nested objects
    if (translatedBody.data && typeof translatedBody.data === 'object') {
      translatedBody.data = await translateResponseBody(translatedBody.data, targetLanguage, context);
    }

    // Handle arrays
    if (translatedBody.items && Array.isArray(translatedBody.items)) {
      translatedBody.items = await Promise.all(
        translatedBody.items.map((item: any) => translateResponseBody(item, targetLanguage, context))
      );
    }

    // Add translation metadata
    translatedBody._translation = {
      targetLanguage,
      translatedAt: new Date().toISOString(),
      contentType: context?.contentType || 'general'
    };

    return translatedBody;
  }

  // Handle array responses
  if (Array.isArray(body)) {
    return await Promise.all(
      body.map((item: any) => translateResponseBody(item, targetLanguage, context))
    );
  }

  return body;
}

/**
 * Translation endpoint handlers
 */
export const translationHandlers = {
  // GET /api/translate/languages - Get supported languages
  getSupportedLanguages: async (req: Request, res: Response): Promise<void> => {
    try {
      const languages = await translationService.getSupportedLanguages();
      res.json({
        success: true,
        data: {
          languages,
          supported: ['en', 'hi'], // Currently supported in Saathi
          default: 'en'
        }
      });
    } catch (error) {
      logger.error('Failed to get supported languages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get supported languages'
      });
    }
  },

  // POST /api/translate/text - Translate text
  translateText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, targetLanguage, sourceLanguage, contentType } = req.body;

      if (!text || !targetLanguage) {
        res.status(400).json({
          success: false,
          error: 'Text and target language are required'
        });
        return;
      }

      let result;
      
      if (contentType === 'mental-health') {
        result = await translationService.translateMentalHealthResponse(text, targetLanguage, {
          userLanguage: sourceLanguage,
          culturalContext: targetLanguage === 'hi' ? 'indian' : 'western'
        });
      } else if (contentType === 'crisis') {
        result = await translationService.translateCrisisContent(text, targetLanguage);
      } else {
        const translatedText = await translationService.translateText(text, targetLanguage, sourceLanguage);
        result = { translatedText };
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Text translation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Translation failed'
      });
    }
  },

  // POST /api/translate/batch - Translate multiple texts
  translateBatch: async (req: Request, res: Response): Promise<void> => {
    try {
      const { texts, targetLanguage, sourceLanguage } = req.body;

      if (!texts || !Array.isArray(texts) || !targetLanguage) {
        res.status(400).json({
          success: false,
          error: 'Texts array and target language are required'
        });
        return;
      }

      const translations = await translationService.translateBatch(texts, targetLanguage, sourceLanguage);

      res.json({
        success: true,
        data: {
          translations,
          count: translations.length
        }
      });
    } catch (error) {
      logger.error('Batch translation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Batch translation failed'
      });
    }
  },

  // POST /api/translate/detect - Detect language
  detectLanguage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;

      if (!text) {
        res.status(400).json({
          success: false,
          error: 'Text is required'
        });
        return;
      }

      const language = await translationService.detectLanguage(text);

      res.json({
        success: true,
        data: {
          detectedLanguage: language,
          confidence: 0.9 // Placeholder confidence
        }
      });
    } catch (error) {
      logger.error('Language detection failed:', error);
      res.status(500).json({
        success: false,
        error: 'Language detection failed'
      });
    }
  }
};

export default {
  detectUserLanguage,
  setTranslationContext,
  translateResponse,
  translationHandlers
};