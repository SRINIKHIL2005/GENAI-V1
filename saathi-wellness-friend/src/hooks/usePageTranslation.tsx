import React, { createContext, useContext, useState } from 'react';

interface PageTranslationContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
}

const PageTranslationContext = createContext<PageTranslationContextType | undefined>(undefined);

export function usePageTranslation() {
  const context = useContext(PageTranslationContext);
  if (context === undefined) {
    throw new Error('usePageTranslation must be used within a PageTranslationProvider');
  }
  return context;
}

interface PageTranslationProviderProps {
  children: React.ReactNode;
}

// Simple translation dictionary
const translations = {
  en: {
    'welcome': 'Welcome to Saathi',
    'your_wellness_friend': 'Your Wellness Friend',
    'daily_checkin': 'Daily Check-in',
    'mood_tracking': 'Mood Tracking',
    'chat': 'Chat',
    'voice_interaction': 'Voice Interaction',
    'physical_support': 'Physical Support',
    'music_relaxation': 'Music & Relaxation',
    'progress_tracking': 'Progress Tracking',
    'settings': 'Settings',
    'sign_out': 'Sign Out',
    'sign_in': 'Sign In',
    'sign_up': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'display_name': 'Display Name',
  },
  es: {
    'welcome': 'Bienvenido a Saathi',
    'your_wellness_friend': 'Tu Amigo de Bienestar',
    'daily_checkin': 'Check-in Diario',
    'mood_tracking': 'Seguimiento del Estado de Ánimo',
    'chat': 'Chat',
    'voice_interaction': 'Interacción por Voz',
    'physical_support': 'Apoyo Físico',
    'music_relaxation': 'Música y Relajación',
    'progress_tracking': 'Seguimiento del Progreso',
    'settings': 'Configuraciones',
    'sign_out': 'Cerrar Sesión',
    'sign_in': 'Iniciar Sesión',
    'sign_up': 'Registrarse',
    'email': 'Correo Electrónico',
    'password': 'Contraseña',
    'display_name': 'Nombre a Mostrar',
  },
  hi: {
    'welcome': 'साथी में आपका स्वागत है',
    'your_wellness_friend': 'आपका कल्याण मित्र',
    'daily_checkin': 'दैनिक चेक-इन',
    'mood_tracking': 'मूड ट्रैकिंग',
    'chat': 'चैट',
    'voice_interaction': 'वॉयस इंटरैक्शन',
    'physical_support': 'शारीरिक सहायता',
    'music_relaxation': 'संगीत और विश्राम',
    'progress_tracking': 'प्रगति ट्रैकिंग',
    'settings': 'सेटिंग्स',
    'sign_out': 'साइन आउट',
    'sign_in': 'साइन इन',
    'sign_up': 'साइन अप',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'display_name': 'प्रदर्शन नाम',
  },
};

export function PageTranslationProvider({ children }: PageTranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage as keyof typeof translations]?.[key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage,
    translations: translations[currentLanguage as keyof typeof translations] || {},
    t,
  };

  return (
    <PageTranslationContext.Provider value={value}>
      {children}
    </PageTranslationContext.Provider>
  );
}

// Wrapper component for compatibility with existing code
interface PageTranslationWrapperProps {
  children: React.ReactNode;
}

export function PageTranslationWrapper({ children }: PageTranslationWrapperProps) {
  return (
    <PageTranslationProvider>
      {children}
    </PageTranslationProvider>
  );
}
