# 🎭 Real-Time Emotion Detection & Mood Enhancement System

A computer vision application that uses webcam input and Google Cloud Vision API to detect facial emotions in real-time and provide mood-enhancing responses.

## 🚀 Features

- **Real-time emotion detection** using Google Cloud Vision API
- **5 emotion categories**: Happy, Sad, Angry, Surprised, Neutral
- **Hybrid detection approach**: API + facial geometry analysis for better accuracy
- **Mood enhancement system** with personalized responses and suggestions
- **Interactive training tools** for practicing facial expressions
- **Data collection and analysis** suite for system optimization
- **Configurable thresholds** and detection parameters

## 📁 Project Structure

```
emotion-detection/
├── emotion_detector.py              # Core emotion detection (improved)
├── enhanced_emotion_detector.py     # Full-featured detector with mood system
├── improved_emotion_detector.py     # Hybrid API + geometry detection
├── final_emotion_detector.py        # Optimized based on test results
├── expression_trainer.py            # Interactive training tool
├── mood_enhancer.py                # Standalone mood enhancement system
├── emotion_config.py               # Central configuration file
├── test_emotions.py                # Testing and validation tools
├── test.py                         # API connection test
├── test_mock.py                    # Mock test without credentials
├── verify_credentials.py           # Google Cloud credentials validator
├── expression_guide.md             # Guide for making detectable expressions
├── testing/                        # Data collection and analysis suite
│   ├── emotion_data_collector.py   # Advanced data collection tool
│   ├── data_analyzer.py            # Analysis and insights tool
│   └── README.md                   # Testing suite documentation
└── README_IMPROVEMENTS.md          # Detailed improvement documentation
```

## 🛠️ Technology Stack

- **Python 3.x** - Primary development language
- **OpenCV (cv2)** - Computer vision and webcam capture
- **Google Cloud Vision API** - Facial emotion detection service
- **python-dotenv** - Environment variable management
- **pandas** - Data analysis and CSV processing
- **threading** - Background processing for UI responsiveness

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/karthikeyamaddu/gen-ai-hackathon.git
cd gen-ai-hackathon
git checkout emotion_recognition-v1
```

### 2. Create Virtual Environment
```bash
python -m venv myenv
myenv\Scripts\activate  # Windows
# or
source myenv/bin/activate  # Linux/Mac
```

### 3. Install Dependencies
```bash
pip install opencv-python google-cloud-vision python-dotenv pandas
```

### 4. Google Cloud Setup
1. Create a Google Cloud project
2. Enable the Vision API
3. Create a service account and download the JSON key
4. Create `.env` file:
```bash
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
PROJECT_ID=your-project-id
LOCATION=us-central1
```

### 5. Test Installation
```bash
python verify_credentials.py
```

## 🎮 Usage

### Basic Emotion Detection
```bash
python emotion_detector.py
```

### Enhanced Detection with Mood Responses
```bash
python enhanced_emotion_detector.py
```

### Final Optimized Version
```bash
python final_emotion_detector.py
```

### Expression Training Tool
```bash
python expression_trainer.py
```

### Data Collection for Analysis
```bash
cd testing
python emotion_data_collector.py
```

## 📊 Performance Results

Based on extensive testing:

| Emotion | Google API Accuracy | Enhanced System Accuracy |
|---------|-------------------|-------------------------|
| Happy | 100% ✅ | 100% ✅ |
| Surprised | 100% ✅ | 100% ✅ |
| Neutral | 100% ✅ | 100% ✅ |
| Sad | 0% ❌ | 14-70% 🔄 |
| Angry | 0% ❌ | 0-70% 🔄 |

## 🔍 Key Findings

1. **Google Vision API Limitation**: Completely fails to detect negative emotions (sad/angry)
2. **Facial Geometry Solution**: Custom landmark analysis improves detection for difficult emotions
3. **Expression Consistency**: Success heavily depends on making exaggerated, consistent expressions
4. **Hybrid Approach**: Combining API (for positive emotions) + geometry (for negative emotions) works best

## 🎯 Technical Challenges Solved

### Problem: Google Vision API Bias
- **Issue**: API gives 0/4 confidence for sad and angry expressions
- **Solution**: Implemented facial landmark geometry analysis
- **Result**: Improved detection through mouth curvature and eyebrow position analysis

### Problem: Inconsistent Expression Detection
- **Issue**: Same user expression giving different results
- **Solution**: Created expression training tools and guides
- **Result**: Better user education on making detectable expressions

### Problem: Real-time Performance
- **Issue**: API calls blocking UI
- **Solution**: Threading architecture with background processing
- **Result**: Smooth real-time detection without UI freezing

## 🔧 Configuration

Edit `emotion_config.py` to customize:

```python
# Detection thresholds (0-4 scale)
EMOTION_THRESHOLDS = {
    "happy": {"high_confidence": 3, "medium_confidence": 2},
    "sad": {"high_confidence": 2, "medium_confidence": 1},
    # ...
}

# Detection interval
DETECTION_INTERVAL = 2.0

# Camera settings
CAMERA_INDEX = 1
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
```

## 📈 Data Collection & Analysis

The project includes a comprehensive testing suite:

1. **Data Collection**: `testing/emotion_data_collector.py`
   - Split-screen interface
   - Real-time API response display
   - CSV logging with complete data

2. **Analysis Tools**: `testing/data_analyzer.py`
   - Accuracy analysis by emotion
   - Confusion pattern detection
   - Threshold optimization suggestions

## 🎭 Expression Guide

For best detection results:

- **Sad**: Drop mouth corners significantly downward (mouth curvature < -0.025)
- **Angry**: Furrow eyebrows together, keep mouth neutral (eyebrow ratio < 0.22)
- **Happy**: Big genuine smile (works perfectly with API)
- **Surprised**: Raise eyebrows high (works well with API)

## 🚀 Future Improvements

1. **Alternative AI Models**: Explore other emotion detection APIs/models
2. **Custom Training**: Train own model on collected data
3. **Multi-modal Detection**: Combine facial, voice, and gesture analysis
4. **Real-time Feedback**: Live coaching for better expressions
5. **Mobile App**: Port to mobile platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of the Gen AI Hackathon. See repository license for details.

## 🙏 Acknowledgments

- Google Cloud Vision API for facial detection capabilities
- OpenCV community for computer vision tools
- Testing participants for expression data collection

---

**Note**: This system works best with exaggerated facial expressions. The Google Vision API has known limitations with negative emotions, which this project addresses through innovative hybrid detection methods.