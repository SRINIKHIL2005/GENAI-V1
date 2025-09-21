"""
Improved Emotion Detector with Facial Landmark Analysis
Uses both Google Vision API and facial geometry for better sad/angry detection
"""

import cv2
import numpy as np
import time
import threading
from dotenv import load_dotenv
from google.cloud import vision

# Load credentials
load_dotenv()
client = vision.ImageAnnotatorClient()

LIKELIHOOD_MAP = {
    vision.Likelihood.VERY_UNLIKELY: 0,
    vision.Likelihood.UNLIKELY: 1,
    vision.Likelihood.POSSIBLE: 2,
    vision.Likelihood.LIKELY: 3,
    vision.Likelihood.VERY_LIKELY: 4,
}

def analyze_facial_geometry(face):
    """Analyze facial landmarks for sad/angry detection when API fails"""
    landmarks = face.landmarks
    
    # Get key landmark positions
    landmark_dict = {}
    for landmark in landmarks:
        landmark_dict[landmark.type_] = landmark.position
    
    # Calculate facial ratios for emotion detection
    try:
        # Get mouth corners and center
        left_mouth = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_LEFT)
        right_mouth = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_RIGHT)
        mouth_center = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_CENTER)
        
        # Get eyebrow positions
        left_eyebrow_upper = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.LEFT_EYEBROW_UPPER_MIDPOINT)
        right_eyebrow_upper = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.RIGHT_EYEBROW_UPPER_MIDPOINT)
        
        # Get eye positions
        left_eye = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.LEFT_EYE)
        right_eye = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.RIGHT_EYE)
        
        if not all([left_mouth, right_mouth, mouth_center, left_eyebrow_upper, right_eyebrow_upper]):
            return None
        
        # Calculate mouth curvature (sad detection)
        mouth_width = abs(right_mouth.x - left_mouth.x)
        mouth_drop = mouth_center.y - ((left_mouth.y + right_mouth.y) / 2)
        mouth_curvature = mouth_drop / mouth_width if mouth_width > 0 else 0
        
        # Calculate eyebrow position (angry detection)
        if left_eye and right_eye:
            eye_level = (left_eye.y + right_eye.y) / 2
            eyebrow_level = (left_eyebrow_upper.y + right_eyebrow_upper.y) / 2
            eyebrow_distance = eye_level - eyebrow_level
            
            # Normalize by face size (approximate)
            face_height = abs(mouth_center.y - eyebrow_level)
            eyebrow_ratio = eyebrow_distance / face_height if face_height > 0 else 0
        else:
            eyebrow_ratio = 0
        
        return {
            'mouth_curvature': mouth_curvature,
            'eyebrow_ratio': eyebrow_ratio
        }
        
    except Exception as e:
        print(f"[DEBUG] Landmark analysis failed: {e}")
        return None

def interpret_emotion_enhanced(face):
    """Enhanced emotion detection using both API and facial geometry"""
    # Get standard API scores
    api_scores = {
        "Happy :)": LIKELIHOOD_MAP[face.joy_likelihood],
        "Sad :(": LIKELIHOOD_MAP[face.sorrow_likelihood],
        "Angry >:(": LIKELIHOOD_MAP[face.anger_likelihood],
        "Surprised :O": LIKELIHOOD_MAP[face.surprise_likelihood],
    }
    
    # If API gives good results for happy/surprised, use them
    max_api_score = max(api_scores.values())
    if max_api_score >= 2:
        best_emotion = max(api_scores, key=api_scores.get)
        if best_emotion in ["Happy :)", "Surprised :O"]:
            return f"{best_emotion} (API Confident)"
    
    # If API fails (all scores 0 or 1), use facial geometry
    if max_api_score <= 1:
        geometry = analyze_facial_geometry(face)
        if geometry:
            mouth_curve = geometry['mouth_curvature']
            eyebrow_pos = geometry['eyebrow_ratio']
            
            print(f"[DEBUG] Geometry - Mouth curve: {mouth_curve:.3f}, Eyebrow: {eyebrow_pos:.3f}")
            
            # Sad detection: mouth curves down
            if mouth_curve > 0.02:  # Mouth droops down
                return "Sad :( (Geometry Detected)"
            
            # Angry detection: eyebrows close to eyes (furrowed)
            elif eyebrow_pos < 0.15:  # Eyebrows very close to eyes
                return "Angry >:( (Geometry Detected)"
            
            # Surprised detection: eyebrows far from eyes
            elif eyebrow_pos > 0.25:
                return "Surprised :O (Geometry Detected)"
    
    # Fallback to API if geometry fails
    if max_api_score > 0:
        best_emotion = max(api_scores, key=api_scores.get)
        return f"{best_emotion} (API Low Confidence)"
    
    return "Neutral :| (No Clear Emotion)"

def detect_emotion(frame):
    try:
        _, buf = cv2.imencode('.jpg', frame)
        image = vision.Image(content=buf.tobytes())
        response = client.face_detection(image=image)
        
        if not response.face_annotations:
            return "No face detected"
        
        face = response.face_annotations[0]
        return interpret_emotion_enhanced(face)
        
    except Exception as e:
        print(f"[ERROR] Vision API failed: {e}")
        return "Error"

# Rest of the code remains the same as emotion_detector.py
last_emotion = "Scanning..."
frame_snapshot = None
stop_event = threading.Event()

def emotion_thread(interval=2.0):
    global last_emotion, frame_snapshot
    print("[INFO] Enhanced emotion thread started")
    while not stop_event.is_set():
        if frame_snapshot is not None:
            snapshot_copy = frame_snapshot.copy()
            last_emotion = detect_emotion(snapshot_copy)
        time.sleep(interval)
    print("[INFO] Enhanced emotion thread stopped")

# Camera setup
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise Exception("[ERROR] Camera not available")

print("[INFO] Enhanced Emotion Detector Started!")
print("[INFO] Using API + Facial Geometry for better sad/angry detection")

cv2.namedWindow("Enhanced Emotion Detector")

# Start background thread
thread = threading.Thread(target=emotion_thread, daemon=True)
thread.start()

while True:
    try:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        
        # Display with enhanced info
        cv2.putText(frame, f"Emotion: {last_emotion}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        cv2.putText(frame, "Enhanced Detection: API + Geometry", (30, frame.shape[0] - 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
        
        cv2.imshow("Enhanced Emotion Detector", frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == 27:  # ESC
            stop_event.set()
            break

        frame_snapshot = frame.copy()

        if cv2.getWindowProperty("Enhanced Emotion Detector", cv2.WND_PROP_VISIBLE) < 1:
            stop_event.set()
            break

    except Exception as e:
        print(f"[ERROR] Exception: {e}")

cap.release()
cv2.destroyAllWindows()
print("[INFO] Enhanced detector exited cleanly")