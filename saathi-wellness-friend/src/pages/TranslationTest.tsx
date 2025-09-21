import React, { useState } from "react";
import { Languages, Mic, Volume2, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WellnessHeader from "@/components/WellnessHeader";

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
}

const TranslationTest: React.FC = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "it", name: "Italian" }
  ];

  const sampleTranslations = {
    "en-hi": {
      "Hello, how are you?": "नमस्ते, आप कैसे हैं?",
      "I am feeling anxious today": "मैं आज चिंतित महसूस कर रहा हूं",
      "Can you help me with relaxation techniques?": "क्या आप मुझे विश्राम तकनीकों में मदद कर सकते हैं?",
      "I need mental health support": "मुझे मानसिक स्वास्थ्य सहायता चाहिए",
      "Thank you for your help": "आपकी मदद के लिए धन्यवाद"
    },
    "en-es": {
      "Hello, how are you?": "Hola, ¿cómo estás?",
      "I am feeling anxious today": "Me siento ansioso hoy",
      "Can you help me with relaxation techniques?": "¿Puedes ayudarme con técnicas de relajación?",
      "I need mental health support": "Necesito apoyo de salud mental",
      "Thank you for your help": "Gracias por tu ayuda"
    },
    "hi-en": {
      "नमस्ते, आप कैसे हैं?": "Hello, how are you?",
      "मैं आज चिंतित महसूस कर रहा हूं": "I am feeling anxious today",
      "क्या आप मुझे विश्राम तकनीकों में मदद कर सकते हैं?": "Can you help me with relaxation techniques?",
      "मुझे मानसिक स्वास्थ्य सहायता चाहिए": "I need mental health support",
      "आपकी मदद के लिए धन्यवाद": "Thank you for your help"
    }
  };

  const translateText = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    setTimeout(() => {
      const translationKey = `${sourceLanguage}-${targetLanguage}` as keyof typeof sampleTranslations;
      const translations = sampleTranslations[translationKey] || {};
      const translated = translations[sourceText as keyof typeof translations] || 
                        `[Translated from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}]: ${sourceText}`;
      
      setTranslatedText(translated);
      
      // Add to history
      const newTranslation: Translation = {
        id: Date.now().toString(),
        originalText: sourceText,
        translatedText: translated,
        fromLanguage: sourceLanguage,
        toLanguage: targetLanguage,
        timestamp: new Date()
      };
      
      setHistory([newTranslation, ...history.slice(0, 19)]); // Keep last 20
      setIsTranslating(false);
    }, 1000);
  };

  const swapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Also swap the text if there's a translation
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 
                      language === 'es' ? 'es-ES' :
                      language === 'fr' ? 'fr-FR' :
                      language === 'de' ? 'de-DE' :
                      language === 'zh' ? 'zh-CN' :
                      language === 'ja' ? 'ja-JP' :
                      language === 'ko' ? 'ko-KR' :
                      language === 'ar' ? 'ar-SA' :
                      language === 'pt' ? 'pt-BR' :
                      language === 'ru' ? 'ru-RU' :
                      language === 'it' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const quickTranslateExamples = [
    "Hello, how are you?",
    "I am feeling anxious today",
    "Can you help me with relaxation techniques?",
    "I need mental health support",
    "Thank you for your help"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WellnessHeader title="Translation Test" />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Translation Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="h-6 w-6 text-blue-500" />
              <span>Real-time Translation</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Test the wellness app's multi-language support system
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button
                onClick={swapLanguages}
                variant="outline"
                size="icon"
                className="mt-6"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Translation Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getLanguageName(sourceLanguage)}
                  </label>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakText(sourceText, sourceLanguage)}
                      disabled={!sourceText}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(sourceText, "source")}
                      disabled={!sourceText}
                    >
                      {copiedId === "source" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white resize-none"
                />
              </div>

              {/* Translated Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getLanguageName(targetLanguage)}
                  </label>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakText(translatedText, targetLanguage)}
                      disabled={!translatedText}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(translatedText, "target")}
                      disabled={!translatedText}
                    >
                      {copiedId === "target" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="w-full h-32 p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 bg-gray-50 overflow-y-auto">
                  {isTranslating ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      <span>Translating...</span>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white">{translatedText}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Translation Button */}
            <Button
              onClick={translateText}
              disabled={!sourceText.trim() || isTranslating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Test Examples</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Click on any example to test translation
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickTranslateExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setSourceText(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Translation History */}
        <Card>
          <CardHeader>
            <CardTitle>Translation History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No translations yet. Start translating above!
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((translation) => (
                  <div
                    key={translation.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {getLanguageName(translation.fromLanguage)} → {getLanguageName(translation.toLanguage)}
                      </span>
                      <span>{translation.timestamp.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-gray-900 dark:text-white">
                          {translation.originalText}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <p className="text-gray-900 dark:text-white">
                          {translation.translatedText}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(translation.translatedText, translation.id)}
                      >
                        {copiedId === translation.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakText(translation.translatedText, translation.toLanguage)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>Translation Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Translation API: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Speech Synthesis: Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Voice Input: Testing</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a demo interface. In the full application, 
                translations would be powered by Google Cloud Translation API for real-time, 
                accurate multilingual support across all wellness features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslationTest;
