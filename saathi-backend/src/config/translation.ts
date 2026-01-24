import { Translate } from '@google-cloud/translate/build/src/v2';
import { logger } from '@/utils/logger';

export class TranslationConfig {
  private static instance: Translate | null = null;

  static initialize(): Translate {
    if (this.instance) {
      return this.instance;
    }

    try {
      // Check if we have the required environment variables
      if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
        logger.warn('GOOGLE_CLOUD_PROJECT_ID not set, translation service will be limited');
      }

      const config: any = {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      };

      // Handle different credential configurations
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Use service account key file path
        config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        // Use service account key JSON directly (for production)
        try {
          config.credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        } catch (error) {
          logger.error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format:', error);
        }
      } else {
        logger.warn('No Google Cloud credentials found, using default authentication');
      }

      this.instance = new Translate(config);
      logger.info('Google Translate service initialized successfully');
      
      return this.instance;
    } catch (error) {
      logger.error('Failed to initialize Google Translate service:', error);
      
      // Return a mock instance for development
      logger.warn('Using mock translation service for development');
      return this.createMockTranslate();
    }
  }

  static getInstance(): Translate {
    if (!this.instance) {
      return this.initialize();
    }
    return this.instance;
  }

  private static createMockTranslate(): any {
    return {
      detect: async (text: string) => [{ language: 'en', confidence: 0.9 }],
      translate: async (text: string | string[], options: any) => {
        // Mock translation - just return original text with a note
        if (Array.isArray(text)) {
          return [text.map(t => `[MOCK TRANSLATION] ${t}`)];
        }
        return [`[MOCK TRANSLATION] ${text}`];
      },
      getLanguages: async () => [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' }
      ]
    };
  }

  // Test the translation service
  static async testConnection(): Promise<boolean> {
    try {
      const translate = this.getInstance();
      const [languages] = await translate.getLanguages();
      logger.info(`Translation service test successful. Supported languages: ${languages.length}`);
      return true;
    } catch (error) {
      logger.error('Translation service test failed:', error);
      return false;
    }
  }

  // Get supported languages for Saathi
  static getSaathiSupportedLanguages() {
    return [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        rtl: false
      },
      {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिन्दी',
        flag: '🇮🇳',
        rtl: false
      }
    ];
  }
}

export default TranslationConfig;