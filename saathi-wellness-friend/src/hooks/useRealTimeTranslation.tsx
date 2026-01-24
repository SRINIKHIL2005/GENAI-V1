import React, { createContext, useContext, useState, useEffect } from 'react';

interface RealTimeTranslationContextType {
  isEnabled: boolean;
  targetLanguage: string;
  toggleTranslation: () => void;
  setTargetLanguage: (language: string) => void;
  translateText: (text: string) => Promise<string>;
}

const RealTimeTranslationContext = createContext<RealTimeTranslationContextType | undefined>(undefined);

export function useRealTimeTranslation() {
  const context = useContext(RealTimeTranslationContext);
  if (context === undefined) {
    throw new Error('useRealTimeTranslation must be used within a RealTimeTranslationProvider');
  }
  return context;
}

interface RealTimeTranslationProviderProps {
  children: React.ReactNode;
}

export function RealTimeTranslationProvider({ children }: RealTimeTranslationProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  // Default to Hindi for India-focused experience
  const [targetLanguage, setTargetLanguage] = useState('hi');

  // very small in-memory cache for demo (avoid rate limits on free API)
  const cache = React.useRef<Map<string, string>>(new Map());

  const normalizeLang = (lang: string | undefined) => {
    if (!lang) return 'en';
    const base = lang.toLowerCase().split('-')[0];
    // map some common variants
    if (base === 'en') return 'en';
    if (base === 'hi') return 'hi';
    return base;
  };

  const toggleTranslation = () => {
    setIsEnabled(!isEnabled);
  };

  const translateText = async (text: string): Promise<string> => {
    if (!isEnabled || !text.trim()) {
      return text;
    }

    try {
      // keep very short strings as-is
      if (text.length < 2) return text;

      const sourceLanguage = normalizeLang(typeof navigator !== 'undefined' ? navigator.language : 'en');
      const key = `${sourceLanguage}|${targetLanguage}|${text}`;
      const existing = cache.current.get(key);
      if (existing) return existing;

      // Using MyMemory free translation API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        const translated = data.responseData.translatedText as string;
        cache.current.set(key, translated);
        // cap cache size
        if (cache.current.size > 200) {
          const first = cache.current.keys().next().value as string | undefined;
          if (first) cache.current.delete(first);
        }
        return translated;
      } else {
        console.warn('Translation API error:', data.responseDetails);
        return text;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const value = {
    isEnabled,
    targetLanguage,
    toggleTranslation,
    setTargetLanguage,
    translateText,
  };

  return (
    <RealTimeTranslationContext.Provider value={value}>
      {children}
    </RealTimeTranslationContext.Provider>
  );
}

// Page Translation Wrapper Component
interface PageTranslationWrapperProps {
  children: React.ReactNode;
}

export function PageTranslationWrapper({ children }: PageTranslationWrapperProps) {
  const { isEnabled, translateText } = useRealTimeTranslation();
  const [translatedContent, setTranslatedContent] = useState<React.ReactNode>(children);

  useEffect(() => {
    if (isEnabled) {
      // This is a simplified version - in a real app you'd want more sophisticated translation
      // For now, we'll just pass through the children
      setTranslatedContent(children);
    } else {
      setTranslatedContent(children);
    }
  }, [isEnabled, children]);

  return <>{translatedContent}</>;
}
