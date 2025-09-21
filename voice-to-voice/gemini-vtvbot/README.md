# 🎤 Gemini Voice-to-Voice Bot

A sophisticated voice-interactive chatbot that enables natural conversation through speech using Google's Generative AI (Gemini). The bot listens to user voice input, processes it through AI, and responds with synthesized speech output.

## ✨ Features

### Core Functionality
- **Real-time Speech Recognition** using Google Speech Recognition
- **AI-Powered Conversations** via Google Gemini 1.5 Flash model
- **Text-to-Speech Audio Output** using Google TTS (gTTS)
- **Continuous Chat Sessions** with conversation history
- **Voice Command Support** (say "stop", "quit", "exit", or "end" to finish)

### GUI Interface
- **Modern Dark-Themed UI** with intuitive controls
- **Live Transcript Display** showing real-time conversation
- **Start/Stop Controls** for easy session management
- **Status Indicators** showing current activity (listening, processing, speaking)

### Data Management
- **Session-Based Organization** with timestamped folders
- **Audio Recording Storage** saves your voice inputs as WAV files
- **Complete Transcript Logging** with timestamps and metadata
- **AI-Generated Summaries** for each conversation session
- **JSON Export Format** for easy data processing

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Google API Key (from Google AI Studio)
- Microphone access

### Installation

1. **Navigate to the voice-to-voice directory**
   ```bash
   cd "voice-to-voice/gemini-vtvbot"
   ```

2. **Create virtual environment**
   ```bash
   python -m venv myenv
   myenv\Scripts\activate  # Windows
   # or
   source myenv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install speechrecognition google-generativeai gtts pygame python-dotenv pyaudio
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   GOOGLE_API_KEY=your_actual_google_api_key_here
   ```

5. **Get Google API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in and create an API key
   - Add it to your `.env` file

## 🎯 Usage

### GUI Version (Recommended)
```bash
python voice_chat_gui.py
```

1. Click **"🎤 Start Voice Chat"** to begin
2. Speak when you see **"🎤 Listening... (speak now)"**
3. AI responds with both text and voice
4. Continue conversation naturally
5. Click **"⏹️ Stop & Save"** or say "stop" to end session

### Command Line Version
```bash
python main.py
```
Simple one-time voice interaction for testing.

### API Testing
```bash
python test_api.py
```
Verify your Google API key and model availability.

## 📁 Project Structure

```
voice-to-voice/gemini-vtvbot/
├── voice_chat_gui.py      # Main GUI application
├── main.py                # Simple CLI version
├── test_api.py           # API verification script
├── .env                  # Environment variables (API keys)
├── README.md             # This file
├── myenv/                # Virtual environment
└── transcripts/          # Generated session data
    └── session_YYYYMMDD_HHMMSS/
        ├── chat_YYYYMMDD_HHMMSS.json    # Complete transcript
        └── temp_user_audio_HHMMSS.wav   # Voice recordings
```

## 🔧 Configuration

### Microphone Selection
The app automatically detects available microphones. If you experience issues:

1. Run the app and check the console for available devices
2. Modify `device_index` in the code:
   ```python
   self.microphone = sr.Microphone(device_index=1)  # Change index as needed
   ```

### Model Selection
Currently uses `gemini-1.5-flash` for fast responses. Available alternatives:
- `gemini-1.5-pro` (more capable, slower)
- `gemini-2.0-flash` (latest version)

## 📊 Output Format

### Transcript JSON Structure
```json
{
  "session_info": {
    "start_time": "2025-01-26T14:30:22.123456",
    "end_time": "2025-01-26T14:35:45.789012",
    "duration_minutes": 5.39,
    "session_folder": "transcripts/session_20250126_143022"
  },
  "summary": "AI-generated conversation summary",
  "conversation": [
    {
      "timestamp": "14:30:25",
      "speaker": "You",
      "message": "Hello, how are you?"
    },
    {
      "timestamp": "14:30:28",
      "speaker": "AI",
      "message": "Hello! I'm doing well, thank you for asking..."
    }
  ],
  "audio_recordings": [
    {
      "timestamp": "143025",
      "filename": "transcripts/session_20250126_143022/temp_user_audio_143025.wav",
      "type": "user_input"
    }
  ]
}
```

## 🛠️ Technology Stack

- **Python 3.x** - Core programming language
- **Google Generative AI (Gemini)** - Conversation AI model
- **Google Speech Recognition** - Speech-to-text conversion
- **Google Text-to-Speech (gTTS)** - Text-to-speech synthesis
- **Pygame** - Audio playback and mixing
- **Tkinter** - GUI framework
- **PyAudio** - Audio input/output handling

## 🔍 Troubleshooting

### Common Issues

**PyAudio Installation Error**
```bash
# Windows
pip install pipwin
pipwin install pyaudio

# Or download wheel from: https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio
```

**Microphone Not Detected**
- Check Windows microphone permissions
- Try different `device_index` values
- Ensure microphone is not used by other applications

**API Key Invalid**
- Verify key in Google AI Studio
- Check `.env` file format
- Ensure Generative AI API is enabled

**No Audio Output**
- Check system volume settings
- Verify pygame audio initialization
- Try different audio output devices

## 🚧 Known Limitations

- Requires internet connection for AI processing
- Speech recognition accuracy depends on audio quality
- TTS generation adds slight delay to responses
- Currently supports English language only

## 🔮 Future Enhancements (v2 Roadmap)

- [ ] Offline speech recognition options
- [ ] Multi-language support
- [ ] Voice cloning for personalized AI responses
- [ ] Real-time conversation analysis
- [ ] Integration with other AI models
- [ ] Mobile app version
- [ ] Voice activity detection improvements
- [ ] Custom wake word support

## 📝 Version History

### v1.0 (Current)
- Initial release with GUI interface
- Basic voice-to-voice conversation
- Session recording and transcript generation
- Google Gemini integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Gen AI Hackathon. See repository license for details.

## 🙏 Acknowledgments

- Google AI for Generative AI API
- Speech Recognition library contributors
- Pygame community for audio handling
- Open source community for various dependencies

---

**Made with ❤️ for natural human-AI voice interactions**