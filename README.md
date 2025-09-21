# 🚀 Gen AI Hackathon - Multi-Modal Emotion Detection & Voice Interaction Suite

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-AI%20Powered-orange.svg)](https://cloud.google.com)

A comprehensive AI-powered emotion detection and voice interaction system that combines **facial emotion recognition**, **text sentiment analysis**, and **voice-to-voice conversation** capabilities. Built for the Gen AI Hackathon, this project demonstrates cutting-edge applications of computer vision, natural language processing, and conversational AI.

## 🌟 Project Overview

This repository contains three interconnected AI modules:

1. **🎭 Face Recognition & Emotion Detection** - Real-time facial emotion analysis using computer vision and Google Cloud Vision API
2. **📝 Text Emotion Detection** - Sentiment analysis and emotion classification for text inputs
3. **🎤 Voice-to-Voice Chat Bot** - Natural conversation through speech with Google Gemini AI

## ✨ Key Features

### 🎭 Facial Emotion Detection
- **Real-time emotion recognition** from webcam feed
- **Hybrid detection approach** combining Google Cloud Vision API + facial geometry analysis
- **5 emotion categories**: Happy, Sad, Angry, Surprised, Neutral
- **Mood enhancement system** with personalized responses
- **Expression training tools** for improved detection accuracy
- **Data collection suite** for system optimization

### 📝 Text Emotion Analysis
- **Multi-model sentiment analysis** using Google Cloud Natural Language API
- **Vertex AI integration** for advanced text understanding
- **RESTful API server** for easy integration
- **Real-time processing** with Express.js backend

### 🎤 Voice-to-Voice Interaction
- **Speech-to-text conversion** with Google Speech Recognition
- **AI-powered conversations** using Google Gemini 1.5 Flash
- **Text-to-speech synthesis** for natural voice responses
- **Modern GUI interface** with conversation transcripts
- **Session recording and analysis** capabilities

## 🏗️ Project Structure

```
gen-ai-hackathon/
├── 📁 face recognition/              # Facial emotion detection system
│   ├── emotion_detector.py          # Core emotion detection engine
│   ├── enhanced_emotion_detector.py # Full-featured detector with mood system
│   ├── final_emotion_detector.py    # Optimized production version
│   ├── expression_trainer.py        # Interactive training tool
│   ├── mood_enhancer.py            # Standalone mood enhancement
│   ├── emotion_config.py           # Configuration management
│   ├── requirements.txt            # Python dependencies
│   ├── testing/                    # Data collection & analysis suite
│   └── README.md                   # Detailed documentation
│
├── 📁 text emotion detection/       # Text sentiment analysis API
│   ├── server.js                   # Express.js API server
│   ├── models.js                   # AI model integrations
│   ├── package.json               # Node.js dependencies
│   └── [API endpoints & utilities]
│
├── 📁 voice-to-voice/              # Voice interaction system
│   └── gemini-vtvbot/
│       ├── voice_chat_gui.py       # Main GUI application
│       ├── main.py                 # CLI version
│       ├── test_api.py            # API verification
│       ├── transcripts/           # Session recordings
│       └── README.md              # Voice bot documentation
│
├── 📁 frontend/                    # Web interface components
├── 📁 myenv/                      # Python virtual environment
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Google Cloud account** with API access
- **Microphone and webcam** for full functionality

### 1. Clone Repository
```bash
git clone https://github.com/karthikeyamaddu/gen-ai-hackathon.git
cd gen-ai-hackathon
```

### 2. Set Up Python Environment
```bash
# Create virtual environment
python -m venv myenv

# Activate environment
myenv\Scripts\activate          # Windows
source myenv/bin/activate       # Linux/Mac

# Install face recognition dependencies
cd "face recognition"
pip install -r requirements.txt
```

### 3. Set Up Node.js Environment
```bash
# Install text emotion detection dependencies
cd "text emotion detection"
npm install
```

### 4. Configure Google Cloud APIs
Create `.env` files in respective directories:

**For Face Recognition:**
```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
PROJECT_ID=your-project-id
LOCATION=us-central1
```

**For Voice-to-Voice:**
```env
GOOGLE_API_KEY=your_google_ai_studio_api_key
```

**For Text Emotion Detection:**
```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
GOOGLE_API_KEY=your_google_ai_studio_api_key
```

### 5. Test Installation
```bash
# Test face recognition
cd "face recognition"
python verify_credentials.py

# Test voice bot
cd "../voice-to-voice/gemini-vtvbot"
python test_api.py

# Test text emotion API
cd "../../text emotion detection"
npm start
```

## 🎯 Usage Examples

### 🎭 Real-Time Emotion Detection
```bash
cd "face recognition"

# Basic emotion detection
python emotion_detector.py

# Enhanced version with mood responses
python enhanced_emotion_detector.py

# Production-optimized version
python final_emotion_detector.py

# Expression training tool
python expression_trainer.py
```

### 🎤 Voice-to-Voice Chat
```bash
cd "voice-to-voice/gemini-vtvbot"

# GUI version (recommended)
python voice_chat_gui.py

# Command line version
python main.py
```

### 📝 Text Emotion API
```bash
cd "text emotion detection"

# Start the API server
npm start

# API will be available at http://localhost:3000
```

**API Usage:**
```javascript
// POST /analyze
{
  "text": "I'm feeling really happy today!"
}

// Response
{
  "sentiment": "positive",
  "confidence": 0.95,
  "emotions": {
    "joy": 0.85,
    "excitement": 0.72
  }
}
```

## 🔧 Technology Stack

### Backend Technologies
- **Python 3.8+** - Core AI processing
- **Node.js 18+** - API server and real-time processing
- **Express.js** - Web framework for APIs

### AI & Machine Learning
- **Google Cloud Vision API** - Facial emotion detection
- **Google Cloud Natural Language API** - Text sentiment analysis
- **Google Vertex AI** - Advanced text understanding
- **Google Generative AI (Gemini)** - Conversational AI
- **OpenCV** - Computer vision and image processing

### Audio & Speech
- **Google Speech Recognition** - Speech-to-text conversion
- **Google Text-to-Speech (gTTS)** - Voice synthesis
- **PyAudio** - Audio input/output handling
- **Pygame** - Audio playback

### Data & Storage
- **pandas** - Data analysis and processing
- **JSON** - Session and transcript storage
- **CSV** - Data collection and export

### UI & Interface
- **Tkinter** - Desktop GUI framework
- **HTML/CSS/JavaScript** - Web interface components

## 📊 Performance Metrics

### Facial Emotion Detection Results
| Emotion | Google API Accuracy | Enhanced System Accuracy |
|---------|-------------------|--------------------------|
| Happy | 100% ✅ | 100% ✅ |
| Surprised | 100% ✅ | 100% ✅ |
| Neutral | 100% ✅ | 100% ✅ |
| Sad | 0% ❌ | 14-70% 🔄 |
| Angry | 0% ❌ | 0-70% 🔄 |

### Key Technical Achievements
- **Solved Google Vision API Bias**: Implemented facial geometry analysis for negative emotions
- **Real-time Performance**: Optimized threading for smooth user experience
- **Hybrid Detection**: Combined multiple AI models for improved accuracy
- **Comprehensive Data Pipeline**: Full analytics suite for continuous improvement

## 🛠️ Development & Contributing

### Setting Up Development Environment
```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/gen-ai-hackathon.git
cd gen-ai-hackathon

# Create feature branch
git checkout -b feature/your-feature-name

# Set up development environment
python -m venv dev-env
dev-env\Scripts\activate  # Windows
pip install -r "face recognition/requirements.txt"

cd "text emotion detection"
npm install

# Install development dependencies
npm install --save-dev nodemon jest
```

### Code Quality Standards
- **Python**: Follow PEP 8 style guidelines
- **JavaScript**: Use ESLint with standard configuration
- **Documentation**: Update README files for any new features
- **Testing**: Add tests for new functionality

### Contribution Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes with tests
4. **Update** documentation
5. **Submit** a pull request

## 🐛 Troubleshooting

### Common Issues

**Google Cloud Authentication**
```bash
# Verify credentials
python "face recognition/verify_credentials.py"

# Check environment variables
echo $GOOGLE_APPLICATION_CREDENTIALS  # Linux/Mac
echo %GOOGLE_APPLICATION_CREDENTIALS%  # Windows
```

**Audio/Microphone Issues**
```bash
# Install PyAudio (Windows)
pip install pipwin
pipwin install pyaudio

# Check microphone permissions in system settings
```

**Node.js Dependencies**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Python Environment Conflicts**
```bash
# Create fresh virtual environment
python -m venv fresh-env
fresh-env\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

## 📈 Future Roadmap

### Phase 1: Enhanced AI Models
- [ ] Integration with newer Google AI models
- [ ] Custom emotion detection model training
- [ ] Multi-language support for voice interactions

### Phase 2: Advanced Features
- [ ] Real-time emotion-based music recommendations
- [ ] Voice emotion analysis integration
- [ ] Mobile app development (React Native)

### Phase 3: Enterprise Features
- [ ] Multi-user session support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and authentication
- [ ] Cloud deployment automation

### Phase 4: Research Extensions
- [ ] Multi-modal emotion fusion
- [ ] Behavioral pattern analysis
- [ ] Accessibility improvements
- [ ] Edge computing optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud AI** for providing powerful APIs and infrastructure
- **OpenCV Community** for computer vision tools and resources
- **Open Source Contributors** for various libraries and frameworks
- **Gen AI Hackathon Organizers** for the opportunity to build and showcase this project

## 📞 Contact & Support

- **Repository**: [github.com/karthikeyamaddu/gen-ai-hackathon](https://github.com/karthikeyamaddu/gen-ai-hackathon)
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ **Starring** the repository
- 🍴 **Forking** for your own experiments
- 📢 **Sharing** with others who might be interested
- 🐛 **Reporting** bugs or suggesting improvements

---

**Built with ❤️ for the Gen AI Hackathon | Pushing the boundaries of human-AI interaction**

*Last updated: December 2024*