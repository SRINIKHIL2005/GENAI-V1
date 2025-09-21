# Emotion Detection Configuration
# Adjust these values to fine-tune emotion detection accuracy

# Confidence thresholds for each emotion (0-4 scale)
EMOTION_THRESHOLDS = {
    "happy": {
        "high_confidence": 3,
        "medium_confidence": 2,
        "min_detection": 1
    },
    "surprised": {
        "high_confidence": 3,
        "medium_confidence": 2,
        "min_detection": 1
    },
    "sad": {
        "high_confidence": 2,
        "medium_confidence": 1,
        "min_detection": 0
    },
    "angry": {
        "high_confidence": 2,
        "medium_confidence": 1,
        "min_detection": 0
    }
}

# Detection interval (seconds between API calls)
DETECTION_INTERVAL = 2.0

# Mood action trigger probabilities (0.0 to 1.0)
ACTION_PROBABILITIES = {
    "sad_video": 0.3,      # 30% chance to open uplifting video when sad
    "sad_music": 0.2,      # 20% chance to open uplifting music when sad
    "angry_relaxation": 0.2, # 20% chance to open relaxation content when angry
}

# Debug settings
DEBUG_ENABLED = True
DEBUG_PRINT_PROBABILITY = 0.05  # 5% chance to print debug scores

# Camera settings
CAMERA_INDEX = 1  # Try 1 first, fallback to 0
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
CAMERA_FPS = 30

# UI settings
MIRROR_EFFECT = True  # Flip camera horizontally
SHOW_FRAME_COUNTER = True
OVERLAY_TRANSPARENCY = 0.8
