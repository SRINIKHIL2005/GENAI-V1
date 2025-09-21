"""
Local Emotion Detection Demo (No Google Cloud Required)
Uses OpenCV's built-in face detection with simulated emotion responses
"""
import cv2
import time
import threading
import random
from datetime import datetime

# Mock emotion detection without Google Cloud
def detect_local_emotion(frame):
    """Simulate emotion detection using basic face detection"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Use OpenCV's built-in face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return "No face detected"
    
    # Simulate emotion detection with random but weighted results
    emotions = [
        ("Happy :)", 0.3),
        ("Neutral :|", 0.4), 
        ("Surprised :O", 0.15),
        ("Sad :(", 0.1),
        ("Angry >:(", 0.05)
    ]
    
    # Weighted random selection
    rand = random.random()
    cumulative = 0
    for emotion, weight in emotions:
        cumulative += weight
        if rand <= cumulative:
            return emotion
    
    return "Neutral :|"

# Mood responses (same as original)
MOOD_RESPONSES = {
    "Happy :)": [
        "🎉 You're glowing! Keep that beautiful smile!",
        "✨ Your happiness is contagious!",
        "🌟 What a wonderful day to be you!"
    ],
    "Sad :(": [
        "💙 Take a deep breath. Tomorrow is a new day.",
        "🌈 Remember: storms don't last, but resilient people do.",
        "🤗 You're stronger than you know."
    ],
    "Angry >:(": [
        "🧘‍♀️ Take 5 deep breaths... 1... 2... 3... 4... 5...",
        "💚 Channel that energy into something positive.",
        "🌊 Like waves, let this feeling wash away."
    ],
    "Surprised :O": [
        "😲 Life is full of surprises! Embrace the unexpected!",
        "🎊 Surprise is the greatest gift life can grant us!"
    ],
    "Neutral :|": [
        "🌻 How about we add some spark to your day?",
        "☕ A calm mind is a powerful mind."
    ]
}

def get_mood_response(emotion):
    """Get encouraging response for detected emotion"""
    base_emotion = emotion.split(" (")[0]
    if base_emotion in MOOD_RESPONSES:
        return random.choice(MOOD_RESPONSES[base_emotion])
    return "🤖 I'm here with you!"

# Shared variables
last_emotion = "Scanning..."
last_response = ""
frame_snapshot = None
stop_event = threading.Event()

def emotion_thread(interval=2.0):
    """Background thread for emotion detection"""
    global last_emotion, last_response, frame_snapshot
    print("[INFO] Local emotion detection started")
    
    while not stop_event.is_set():
        if frame_snapshot is not None:
            snapshot_copy = frame_snapshot.copy()
            emotion = detect_local_emotion(snapshot_copy)
            response = get_mood_response(emotion)
            
            last_emotion = emotion
            last_response = response
            
            if response and emotion != "No face detected":
                print(f"[MOOD] {response}")
        
        time.sleep(interval)
    
    print("[INFO] Local emotion detection stopped")

def main():
    global frame_snapshot
    
    print("🎭 LOCAL EMOTION DETECTION DEMO")
    print("=" * 40)
    print("✨ No Google Cloud required!")
    print("🎯 Uses OpenCV face detection + simulated emotions")
    print("💡 Press ESC to exit")
    print()
    
    # Open camera
    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Cannot access camera")
        return
    
    print("✅ Camera opened successfully")
    
    # Set camera properties
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    cv2.namedWindow("Local Emotion Demo", cv2.WINDOW_AUTOSIZE)
    
    # Start background thread
    thread = threading.Thread(target=emotion_thread, daemon=True)
    thread.start()
    
    frame_count = 0
    start_time = time.time()
    
    while True:
        try:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read frame")
                break
            
            frame_count += 1
            
            # Mirror effect
            frame = cv2.flip(frame, 1)
            
            # Add face detection rectangles
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            
            # Create text overlay
            overlay = frame.copy()
            cv2.rectangle(overlay, (20, 20), (600, 120), (0, 0, 0), -1)
            
            # Add emotion text
            cv2.putText(overlay, f"Emotion: {last_emotion}", (30, 50),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            
            # Add response text
            if last_response:
                # Split long responses
                words = last_response.split()
                line1 = " ".join(words[:6])
                line2 = " ".join(words[6:12]) if len(words) > 6 else ""
                
                cv2.putText(overlay, line1, (30, 80),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
                if line2:
                    cv2.putText(overlay, line2, (30, 100),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
            
            # Blend overlay
            cv2.addWeighted(overlay, 0.8, frame, 0.2, 0, frame)
            
            # Add demo info
            runtime = int(time.time() - start_time)
            cv2.putText(frame, f"LOCAL DEMO | Runtime: {runtime}s | Frames: {frame_count}", 
                       (10, frame.shape[0] - 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            cv2.imshow("Local Emotion Demo", frame)
            
            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == 27:  # ESC
                print("[INFO] ESC pressed - exiting")
                stop_event.set()
                break
            
            # Update snapshot for thread
            frame_snapshot = frame.copy()
            
            # Check if window closed
            if cv2.getWindowProperty("Local Emotion Demo", cv2.WND_PROP_VISIBLE) < 1:
                print("[INFO] Window closed")
                stop_event.set()
                break
                
        except Exception as e:
            print(f"❌ Error: {e}")
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Local demo completed successfully!")

if __name__ == "__main__":
    main()