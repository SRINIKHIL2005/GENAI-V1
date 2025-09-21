import React, { createContext, useContext, ReactNode, useState } from 'react';

interface RealTimeTranslationContextType {
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

const RealTimeTranslationContext = createContext<RealTimeTranslationContextType>({
  translateText: async (text: string) => text,
  isEnabled: false,
  setEnabled: () => {},
  currentLanguage: 'en',
  setLanguage: () => {},
});

export const useRealTimeTranslation = () => {
  return useContext(RealTimeTranslationContext);
};

export const RealTimeTranslationProvider = ({ children }: { children: ReactNode }) => {
  const [isEnabled, setEnabled] = useState(false);
  const [currentLanguage, setLanguage] = useState('en');

  const translateText = async (text: string, _targetLanguage?: string): Promise<string> => {
    // Simple mock translation - in a real app this would use Google Translate API
    if (!isEnabled) return text;
    
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return text; // Return original text for now
  };

  const value = {
    translateText,
    isEnabled,
    setEnabled,
    currentLanguage,
    setLanguage,
  };

  return React.createElement(
    RealTimeTranslationContext.Provider,
    { value },
    children
  );
};
