import express from 'express';
import { translationHandlers } from '@/middleware/translation';

const router = express.Router();

/**
 * Translation API Routes
 */

// GET /api/translate/languages - Get supported languages
router.get('/languages', translationHandlers.getSupportedLanguages);

// POST /api/translate/text - Translate single text
router.post('/text', translationHandlers.translateText);

// POST /api/translate/batch - Translate multiple texts
router.post('/batch', translationHandlers.translateBatch);

// POST /api/translate/detect - Detect language of text
router.post('/detect', translationHandlers.detectLanguage);

export { router as translationRoutes };