import { Translate } from '@google-cloud/translate/build/src/v2';
import { TranslationConfig } from '@/config/translation';
import { logger } from '@/utils/logger';

class TranslationService {
  private translate: Translate;
  
  constructor() {
    // Initialize Google Translate client using configuration
    this.translate = TranslationConfig.getInstance();
  }

  /**
   * Detect the language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const [detection] = await this.translate.detect(text);
      return Array.isArray(detection) ? detection[0].language : detection.language;
    } catch (error) {
      logger.error('Language detection failed:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Translate text to target language
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    try {
      const options = {
        to: targetLanguage,
        ...(sourceLanguage && { from: sourceLanguage })
      };

      const [translation] = await this.translate.translate(text, options);
      return Array.isArray(translation) ? translation[0] : translation;
    } catch (error) {
      logger.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<string[]> {
    try {
      const options = {
        to: targetLanguage,
        ...(sourceLanguage && { from: sourceLanguage })
      };

      const [translations] = await this.translate.translate(texts, options);
      return Array.isArray(translations) ? translations : [translations];
    } catch (error) {
      logger.error('Batch translation failed:', error);
      return texts; // Return original texts if translation fails
    }
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<any[]> {
    try {
      const [languages] = await this.translate.getLanguages();
      return languages;
    } catch (error) {
      logger.error('Failed to get supported languages:', error);
      return [];
    }
  }

  /**
   * Translate mental health responses with context preservation
   */
  async translateMentalHealthResponse(response: string, targetLanguage: string, context?: {
    userLanguage?: string;
    culturalContext?: string;
    emotionalTone?: string;
  }): Promise<{
    translatedText: string;
    originalLanguage: string;
    confidence: number;
  }> {
    try {
      // Detect original language if not provided
      const originalLanguage = context?.userLanguage || await this.detectLanguage(response);

      // Skip translation if already in target language
      if (originalLanguage === targetLanguage) {
        return {
          translatedText: response,
          originalLanguage,
          confidence: 1.0
        };
      }

      // Add context for better mental health translations
      let contextualResponse = response;
      if (context?.emotionalTone) {
        // Preserve emotional tone indicators
        contextualResponse = `[Tone: ${context.emotionalTone}] ${response}`;
      }

      const translatedText = await this.translateText(contextualResponse, targetLanguage, originalLanguage);
      
      // Remove context markers from translation
      const cleanTranslation = translatedText.replace(/\[Tone: [^\]]+\]\s*/, '');

      return {
        translatedText: cleanTranslation,
        originalLanguage,
        confidence: 0.9 // Placeholder confidence score
      };
    } catch (error) {
      logger.error('Mental health response translation failed:', error);
      return {
        translatedText: response,
        originalLanguage: 'unknown',
        confidence: 0.0
      };
    }
  }

  /**
   * Translate crisis-related content with high priority
   */
  async translateCrisisContent(content: string, targetLanguage: string): Promise<{
    translatedText: string;
    urgencyPreserved: boolean;
  }> {
    try {
      // Crisis keywords that should be preserved or emphasized
      const crisisKeywords = ['help', 'emergency', 'suicide', 'harm', 'crisis', 'urgent'];
      
      const translatedText = await this.translateText(content, targetLanguage);
      
      // Check if urgency indicators are preserved
      const urgencyPreserved = crisisKeywords.some(keyword => 
        content.toLowerCase().includes(keyword) && 
        translatedText.toLowerCase().includes(keyword)
      );

      return {
        translatedText,
        urgencyPreserved
      };
    } catch (error) {
      logger.error('Crisis content translation failed:', error);
      return {
        translatedText: content,
        urgencyPreserved: false
      };
    }
  }

  /**
   * Get localized mental health resources
   */
  async getLocalizedResources(resources: any[], targetLanguage: string): Promise<any[]> {
    try {
      const translatedResources = await Promise.all(
        resources.map(async (resource) => {
          const translatedName = await this.translateText(resource.name, targetLanguage);
          const translatedDescription = resource.description 
            ? await this.translateText(resource.description, targetLanguage)
            : resource.description;

          return {
            ...resource,
            name: translatedName,
            description: translatedDescription,
            originalLanguage: 'en', // Assuming resources are originally in English
            translatedLanguage: targetLanguage
          };
        })
      );

      return translatedResources;
    } catch (error) {
      logger.error('Resource localization failed:', error);
      return resources; // Return original resources if translation fails
    }
  }
}

export const translationService = new TranslationService();
export default TranslationService;