"""
Facial Expression Training Tool
This helps you practice sad and angry expressions and see real-time scores
"""

import cv2
import time
from dotenv import load_dotenv
from google.cloud import vision

# Load environment
load_dotenv()
client = vision.ImageAnnotatorClient()

LIKELIHOOD_MAP = {
    vision.Likelihood.VERY_UNLIKELY: 0,
    vision.Likelihood.UNLIKELY: 1,
    vision.Likelihood.POSSIBLE: 2,
    vision.Likelihood.LIKELY: 3,
    vision.Likelihood.VERY_LIKELY: 4,
}

def get_emotion_scores(frame):
    """Get detailed emotion scores from Google Vision API"""
    try:
        _, buf = cv2.imencode('.jpg', frame)
        image = vision.Image(content=buf.tobytes())
        response = client.face_detection(image=image)
        
        if not response.face_annotations:
            return None
        
        face = response.face_annotations[0]
        scores = {
            "Happy": LIKELIHOOD_MAP[face.joy_likelihood],
            "Sad": LIKELIHOOD_MAP[face.sorrow_likelihood],
            "Angry": LIKELIHOOD_MAP[face.anger_likelihood],
            "Surprised": LIKELIHOOD_MAP[face.surprise_likelihood],
        }
        return scores
    except Exception as e:
        print(f"Error: {e}")
        return None

def draw_emotion_guide(frame, current_emotion="neutral"):
    """Draw expression guide on frame"""
    guides = {
        "sad": [
            "SAD Expression Guide:",
            "- Turn mouth corners DOWN",
            "- Make eyes droopy/half-closed", 
            "- Lower eyebrows together",
            "- Look downward/dejected",
            "- Hold for 3-5 seconds"
        ],
        "angry": [
            "ANGRY Expression Guide:",
            "- Furrow eyebrows together",
            "- Narrow/squint eyes",
            "- Tighten lips or scowl",
            "- Clench jaw",
            "- Look intense",
            "- Hold for 3-5 seconds"
        ],
        "neutral": [
            "Press keys to practice:",
            "S = Practice SAD expressions",
            "A = Practice ANGRY expressions",
            "H = Practice HAPPY expressions",
            "N = Return to NEUTRAL guide",
            "Q = Quit"
        ]
    }
    
    guide = guides.get(current_emotion, guides["neutral"])
    
    # Draw background for text
    for i, line in enumerate(guide):
        y_pos = 30 + i * 25
        cv2.putText(frame, line, (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

def expression_trainer():
    """Interactive expression training tool"""
    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("ERROR: Cannot access camera")
        return
    
    print("=== FACIAL EXPRESSION TRAINER ===")
    print("This tool helps you practice sad and angry expressions")
    print("Watch the real-time scores to see what the API detects")
    print("Press S for SAD guide, A for ANGRY guide, Q to quit")
    
    current_mode = "neutral"
    last_api_call = 0
    current_scores = None
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Flip frame for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Call API every 2 seconds to avoid rate limits
        current_time = time.time()
        if current_time - last_api_call > 2:
            current_scores = get_emotion_scores(frame)
            last_api_call = current_time
        
        # Draw emotion guide
        draw_emotion_guide(frame, current_mode)
        
        # Draw current scores if available
        if current_scores:
            cv2.putText(frame, "CURRENT SCORES:", (10, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            y_offset = 225
            for emotion, score in current_scores.items():
                color = (0, 255, 0) if score > 0 else (128, 128, 128)
                if emotion in ["Sad", "Angry"] and score > 0:
                    color = (0, 255, 255)  # Highlight sad/angry detections
                cv2.putText(frame, f"{emotion}: {score}/4", (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                y_offset += 25
            
            # Show which emotion is winning
            best_emotion = max(current_scores, key=current_scores.get)
            best_score = current_scores[best_emotion]
            if best_score > 0:
                cv2.putText(frame, f"DETECTED: {best_emotion} ({best_score})", (10, y_offset + 20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Instructions at bottom
        cv2.putText(frame, "Keys: S=Sad Guide | A=Angry Guide | H=Happy | N=Neutral | Q=Quit", 
                   (10, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
        
        cv2.imshow("Expression Trainer", frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            current_mode = "sad"
            print("\n=== PRACTICING SAD EXPRESSIONS ===")
            print("Try the sad expression guide and watch your scores!")
        elif key == ord('a'):
            current_mode = "angry"
            print("\n=== PRACTICING ANGRY EXPRESSIONS ===")
            print("Try the angry expression guide and watch your scores!")
        elif key == ord('h'):
            current_mode = "happy"
            print("\n=== PRACTICING HAPPY EXPRESSIONS ===")
            print("Smile wide and see the Happy score increase!")
        elif key == ord('n'):
            current_mode = "neutral"
            print("\n=== NEUTRAL MODE ===")
            print("Relax your face and choose an expression to practice")
    
    cap.release()
    cv2.destroyAllWindows()
    
    print("\n=== TIPS FOR BETTER DETECTION ===")
    print("If Sad/Angry scores are still 0:")
    print("1. Try MORE EXAGGERATED expressions")
    print("2. Hold expressions for 3-5 seconds")
    print("3. Ensure good lighting on your face")
    print("4. Try different angles slightly")
    print("5. Google Vision API sometimes has low sensitivity for these emotions")

if __name__ == "__main__":
    expression_trainer()
