"""
Mock test to verify project structure without Google Cloud credentials
"""
import cv2
import time
import random

print("🔧 Testing project structure without Google Cloud...")

# Test OpenCV camera access
try:
    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    if cap.isOpened():
        print("✅ Camera access working")
        cap.release()
    else:
        print("❌ No camera found")
except Exception as e:
    print(f"❌ Camera test failed: {e}")

# Test imports
try:
    import pandas as pd
    print("✅ Pandas imported successfully")
except ImportError:
    print("❌ Pandas import failed")

try:
    from dotenv import load_dotenv
    print("✅ python-dotenv imported successfully")
except ImportError:
    print("❌ python-dotenv import failed")

# Mock emotion detection
def mock_detect_emotion():
    emotions = ["Happy :)", "Sad :(", "Angry >:(", "Surprised :O", "Neutral :|"]
    return random.choice(emotions)

print("✅ Mock emotion detection:", mock_detect_emotion())
print("\n🎯 Project structure is ready!")
print("📝 Next step: Add Google Cloud credentials to run full emotion detection")