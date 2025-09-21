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
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish

  const toggleTranslation = () => {
    setIsEnabled(!isEnabled);
  };

  const translateText = async (text: string): Promise<string> => {
    if (!isEnabled || !text.trim()) {
      return text;
    }

    try {
      // Using MyMemory free translation API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
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
