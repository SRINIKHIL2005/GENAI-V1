import React, { createContext, useContext, ReactNode } from 'react';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string, fallback?: string) => fallback || key,
  currentLanguage: 'en',
  setLanguage: () => {},
});

export const usePageTranslation = () => {
  return useContext(TranslationContext);
};

export const PageTranslationWrapper = ({ children }: { children: ReactNode }) => {
  const t = (key: string, fallback?: string) => {
    // Simple translation function - in a real app this would use i18n
    return fallback || key;
  };

  const value = {
    t,
    currentLanguage: 'en',
    setLanguage: () => {},
  };

  return React.createElement(
    TranslationContext.Provider,
    { value },
    children
  );
};
