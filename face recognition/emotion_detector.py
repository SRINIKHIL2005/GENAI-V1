import os
import cv2
import time
import threading
from dotenv import load_dotenv
from google.cloud import vision

# Load credentials
load_dotenv()
client = vision.ImageAnnotatorClient()
print("[INFO] Vision client created successfully")

LIKELIHOOD_MAP = {
    vision.Likelihood.VERY_UNLIKELY: 0,
    vision.Likelihood.UNLIKELY: 1,
    vision.Likelihood.POSSIBLE: 2,
    vision.Likelihood.LIKELY: 3,
    vision.Likelihood.VERY_LIKELY: 4,
}

def interpret_emotion(face):
    """Return the emotion with the highest likelihood using improved thresholds"""
    scores = {
        "Happy :)": LIKELIHOOD_MAP[face.joy_likelihood],
        "Sad :(": LIKELIHOOD_MAP[face.sorrow_likelihood],
        "Angry >:(": LIKELIHOOD_MAP[face.anger_likelihood],
        "Surprised :O": LIKELIHOOD_MAP[face.surprise_likelihood],
    }
    
    # Find the emotion with the highest score
    best_emotion = max(scores, key=scores.get)
    best_score = scores[best_emotion]
    
    # More nuanced thresholds for different emotions
    # Happy and Surprised are often detected with higher confidence
    if best_emotion in ["Happy :)", "Surprised :O"] and best_score >= 2:
        return best_emotion
    # Sad and Angry need much lower thresholds as they're harder to detect
    elif best_emotion in ["Sad :(", "Angry >:("] and best_score >= 0:
        return best_emotion
    # If multiple emotions have the same score, check for specific patterns
    elif best_score >= 2:
        return best_emotion
    # Check if any emotion reaches a reasonable threshold
    elif any(score >= 2 for score in scores.values()):
        # Return the first emotion that meets threshold
        for emotion, score in scores.items():
            if score >= 2:
                return emotion
    # Lower threshold check for sad/angry
    elif any(score >= 0 and emotion in ["Sad :(", "Angry >:("] for emotion, score in scores.items()):
        for emotion, score in scores.items():
            if emotion in ["Sad :(", "Angry >:("] and score >= 0:
                return emotion
    # Fallback: if all scores are very low, return neutral
    else:
        return "Neutral :|"

def detect_emotion(frame):
    try:
        _, buf = cv2.imencode('.jpg', frame)
        image = vision.Image(content=buf.tobytes())
        response = client.face_detection(image=image)
        if not response.face_annotations:
            return "No face detected"
        
        face = response.face_annotations[0]
        # Add debug info to understand API responses
        scores = {
            "Happy": LIKELIHOOD_MAP[face.joy_likelihood],
            "Sad": LIKELIHOOD_MAP[face.sorrow_likelihood],
            "Angry": LIKELIHOOD_MAP[face.anger_likelihood],
            "Surprised": LIKELIHOOD_MAP[face.surprise_likelihood],
        }
        
        # Print debug info every few detections to avoid spam
        import random
        if random.random() < 0.1:  # 10% chance to print debug
            print(f"[DEBUG] Emotion scores: {scores}")
        
        return interpret_emotion(face)
    except Exception as e:
        print(f"[ERROR] Vision API failed: {e}")
        return "Error"

# Shared variables
last_emotion = "Scanning..."
frame_snapshot = None
stop_event = threading.Event()

def emotion_thread(interval=1.5):
    global last_emotion, frame_snapshot
    print("[INFO] Emotion thread started")
    while not stop_event.is_set():
        if frame_snapshot is not None:
            snapshot_copy = frame_snapshot.copy()
            last_emotion = detect_emotion(snapshot_copy)
        time.sleep(interval)
    print("[INFO] Emotion thread stopped")

# Open webcam
cap = cv2.VideoCapture(1)  # change to 0 if needed
if not cap.isOpened():
    raise Exception("[ERROR] Camera not available")
print("[INFO] Camera opened successfully")

cv2.namedWindow("Emotion Detector")

# Start background thread
thread = threading.Thread(target=emotion_thread, daemon=True)
thread.start()

while True:
    try:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Failed to read frame")
            break

        # Display frame immediately
        cv2.putText(frame, f"Emotion: {last_emotion}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        cv2.imshow("Emotion Detector", frame)
        cv2.waitKey(1)  # refresh GUI

        # Update snapshot for thread
        frame_snapshot = frame.copy()

        # Exit if window closed
        if cv2.getWindowProperty("Emotion Detector", cv2.WND_PROP_VISIBLE) < 1:
            print("[INFO] Window closed by user")
            stop_event.set()
            break

    except Exception as e:
        print(f"[ERROR] Exception in main loop: {e}")

cap.release()
cv2.destroyAllWindows()
print("[INFO] Program exited cleanly")
