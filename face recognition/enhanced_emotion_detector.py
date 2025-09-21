import os
import cv2
import time
import threading
import random
import webbrowser
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

# Mood enhancement responses
MOOD_RESPONSES = {
    "Happy :)": [
        "🎉 You're glowing! Keep that beautiful smile!",
        "✨ Your happiness is contagious!",
        "🌟 What a wonderful day to be you!",
        "😊 Your positive energy is amazing!"
    ],
    "Sad :(": [
        "💙 Take a deep breath. Tomorrow is a new day.",
        "🌈 Remember: storms don't last, but resilient people do.",
        "🤗 You're stronger than you know. This will pass.",
        "⭐ Every sunset is an opportunity for a new sunrise."
    ],
    "Angry >:(": [
        "🧘‍♀️ Take 5 deep breaths with me... 1... 2... 3... 4... 5...",
        "💚 Channel that energy into something positive.",
        "🌊 Like waves on the shore, let this feeling wash away.",
        "🕊️ Peace begins with you. You've got this."
    ],
    "Surprised :O": [
        "😲 Life is full of surprises! Embrace the unexpected!",
        "🎊 Surprise is the greatest gift life can grant us!",
        "✨ Your expression says it all - what caught you off guard?",
        "🎭 The best stories start with 'I never expected...'"
    ],
    "Neutral :|": [
        "🌻 How about we add some spark to your day?",
        "☕ A calm mind is a powerful mind.",
        "🎯 Ready to take on whatever comes next?",
        "🌿 Sometimes neutral is perfectly perfect."
    ]
}

# Motivational actions based on mood
MOOD_ACTIONS = {
    "Sad :(": {
        "videos": [
            "https://www.youtube.com/watch?v=ZbZSe6N_BXs",  # Happy dog compilation
            "https://www.youtube.com/watch?v=hFZFjoX2cGg",  # Cute animals
        ],
        "music": [
            "https://www.youtube.com/watch?v=y6Sxv-sUYtM",  # Uplifting music
            "https://www.youtube.com/watch?v=09R8_2nJtjg",  # Happy songs
        ]
    },
    "Angry >:(": {
        "relaxation": [
            "https://www.youtube.com/watch?v=YQcZKDSk4wI",  # Calming sounds
            "https://www.youtube.com/watch?v=1ZYbU82GVz4",  # Meditation
        ]
    }
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
    
    # Enhanced thresholds with confidence scoring
    confidence_level = ""
    
    # Happy and Surprised are often detected with higher confidence
    if best_emotion in ["Happy :)", "Surprised :O"]:
        if best_score >= 3:
            confidence_level = " (High Confidence)"
            return best_emotion + confidence_level
        elif best_score >= 2:
            confidence_level = " (Medium Confidence)"
            return best_emotion + confidence_level
    
    # Sad and Angry need much lower thresholds as they're harder to detect
    elif best_emotion in ["Sad :(", "Angry >:("]:
        if best_score >= 1:
            confidence_level = " (High Confidence)"
            return best_emotion + confidence_level
        elif best_score >= 0:  # Even score 0 can be valid if it's the highest
            confidence_level = " (Low Confidence)"
            return best_emotion + confidence_level
    
    # Check for any reasonably confident emotion
    for emotion, score in scores.items():
        if emotion in ["Happy :)", "Surprised :O"] and score >= 2:
            return emotion + " (Detected)"
        elif emotion in ["Sad :(", "Angry >:("] and score >= 0:  # Very low threshold for sad/angry
            return emotion + " (Detected)"
    
    # Fallback to neutral
    return "Neutral :|"

def get_mood_response(emotion_text):
    """Get an appropriate response based on detected emotion"""
    # Extract base emotion (remove confidence indicators)
    base_emotion = emotion_text.split(" (")[0]
    
    if base_emotion in MOOD_RESPONSES:
        return random.choice(MOOD_RESPONSES[base_emotion])
    return "🤖 I'm here with you!"

def trigger_mood_action(emotion_text):
    """Trigger actions to improve mood based on emotion"""
    base_emotion = emotion_text.split(" (")[0]
    
    if base_emotion == "Sad :(" and random.random() < 0.3:  # 30% chance
        action_type = random.choice(["videos", "music"])
        if action_type in MOOD_ACTIONS["Sad :("]:
            url = random.choice(MOOD_ACTIONS["Sad :("][action_type])
            print(f"[MOOD ACTION] Opening {action_type} to cheer you up!")
            # Uncomment the next line to actually open browser
            # webbrowser.open(url)
    
    elif base_emotion == "Angry >:(" and random.random() < 0.2:  # 20% chance
        if "relaxation" in MOOD_ACTIONS["Angry >:("]:
            url = random.choice(MOOD_ACTIONS["Angry >:("]["relaxation"])
            print(f"[MOOD ACTION] Opening relaxation content to help you calm down!")
            # Uncomment the next line to actually open browser
            # webbrowser.open(url)

def detect_emotion(frame):
    try:
        _, buf = cv2.imencode('.jpg', frame)
        image = vision.Image(content=buf.tobytes())
        response = client.face_detection(image=image)
        if not response.face_annotations:
            return "No face detected", ""
        
        face = response.face_annotations[0]
        # Add debug info to understand API responses
        scores = {
            "Happy": LIKELIHOOD_MAP[face.joy_likelihood],
            "Sad": LIKELIHOOD_MAP[face.sorrow_likelihood],
            "Angry": LIKELIHOOD_MAP[face.anger_likelihood],
            "Surprised": LIKELIHOOD_MAP[face.surprise_likelihood],
        }
        
        # Print debug info occasionally
        if random.random() < 0.05:  # 5% chance to avoid spam
            print(f"[DEBUG] Emotion scores: {scores}")
        
        emotion = interpret_emotion(face)
        response_text = get_mood_response(emotion)
        
        # Trigger mood actions occasionally
        trigger_mood_action(emotion)
        
        return emotion, response_text
        
    except Exception as e:
        print(f"[ERROR] Vision API failed: {e}")
        return "Error", ""

# Shared variables
last_emotion = "Scanning..."
last_response = ""
frame_snapshot = None
stop_event = threading.Event()

def emotion_thread(interval=2.0):  # Slightly longer interval for better accuracy
    global last_emotion, last_response, frame_snapshot
    print("[INFO] Enhanced emotion thread started")
    while not stop_event.is_set():
        if frame_snapshot is not None:
            snapshot_copy = frame_snapshot.copy()
            emotion, response = detect_emotion(snapshot_copy)
            last_emotion = emotion
            last_response = response
            if response:
                print(f"[MOOD BOOST] {response}")
        time.sleep(interval)
    print("[INFO] Enhanced emotion thread stopped")

# Open webcam
cap = cv2.VideoCapture(1)  # change to 0 if needed
if not cap.isOpened():
    cap = cv2.VideoCapture(0)  # fallback to default camera
    if not cap.isOpened():
        raise Exception("[ERROR] No camera available")

print("[INFO] Camera opened successfully")

# Set camera properties for better quality
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 30)

cv2.namedWindow("Enhanced Emotion Detector", cv2.WINDOW_AUTOSIZE)

# Start background thread
thread = threading.Thread(target=emotion_thread, daemon=True)
thread.start()

print("[INFO] Enhanced Emotion Detection Started!")
print("[INFO] - Detecting: Happy, Sad, Angry, Surprised, Neutral")
print("[INFO] - Providing mood responses and occasional actions")
print("[INFO] - Press ESC or close window to exit")

frame_count = 0
while True:
    try:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Failed to read frame")
            break

        frame_count += 1
        
        # Flip frame for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Create overlay for text with background
        overlay = frame.copy()
        
        # Add emotion text with background
        text_size = cv2.getTextSize(f"Emotion: {last_emotion}", cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        cv2.rectangle(overlay, (20, 20), (text_size[0] + 40, 80), (0, 0, 0), -1)
        cv2.putText(overlay, f"Emotion: {last_emotion}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Add response text if available
        if last_response:
            response_lines = [last_response[i:i+40] for i in range(0, len(last_response), 40)]
            for i, line in enumerate(response_lines[:2]):  # Max 2 lines
                cv2.putText(overlay, line, (30, 100 + i*25),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # Blend overlay with original frame
        cv2.addWeighted(overlay, 0.8, frame, 0.2, 0, frame)
        
        # Add frame counter
        cv2.putText(frame, f"Frame: {frame_count}", (frame.shape[1] - 150, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        cv2.imshow("Enhanced Emotion Detector", frame)
        
        # Handle key events
        key = cv2.waitKey(1) & 0xFF
        if key == 27:  # ESC key
            print("[INFO] ESC pressed - exiting")
            stop_event.set()
            break
        elif key == ord('s'):  # Save screenshot
            screenshot_name = f"emotion_screenshot_{int(time.time())}.jpg"
            cv2.imwrite(screenshot_name, frame)
            print(f"[INFO] Screenshot saved as {screenshot_name}")

        # Update snapshot for thread
        frame_snapshot = frame.copy()

        # Exit if window closed
        if cv2.getWindowProperty("Enhanced Emotion Detector", cv2.WND_PROP_VISIBLE) < 1:
            print("[INFO] Window closed by user")
            stop_event.set()
            break

    except Exception as e:
        print(f"[ERROR] Exception in main loop: {e}")

cap.release()
cv2.destroyAllWindows()
print("[INFO] Enhanced emotion detector exited cleanly")
