# Technology Stack

## Core Technologies
- **Python 3.x** - Primary programming language
- **Google Generative AI (Gemini Pro)** - AI conversation model
- **Google Speech Recognition** - Speech-to-text conversion
- **Google Text-to-Speech (gTTS)** - Text-to-speech synthesis
- **Pygame** - Audio playback and mixing

## Key Dependencies
```
speechrecognition
google-generativeai
gtts
pygame
python-dotenv
```

## Environment Configuration
- Uses `.env` file for API key management
- Requires `GOOGLE_API_KEY` environment variable
- Google Cloud Project with Generative AI API enabled

## Common Commands

### Installation
```bash
pip install speechrecognition google-generativeai gtts pygame python-dotenv
```

### Running the Application
```bash
python main.py
```

### Setup Requirements
1. Create `.env` file with Google API key
2. Configure microphone device index if needed
3. Ensure microphone permissions are granted

## API Integration Patterns
- Environment-based API key configuration
- Streaming response handling from Gemini
- Error handling for speech recognition failures
- Audio device enumeration and selection