"""
Test script for emotion detection improvements
Run this to validate the enhanced emotion detection system
"""

import cv2
import time
from emotion_detector import detect_emotion, interpret_emotion, LIKELIHOOD_MAP
from google.cloud import vision
from dotenv import load_dotenv

# Load environment
load_dotenv()
client = vision.ImageAnnotatorClient()

def test_emotion_detection():
    """Test the emotion detection with webcam"""
    print("=== EMOTION DETECTION TEST ===")
    print("This will capture 10 frames and test emotion detection")
    print("Try making different facial expressions!")
    print("Press 's' to start test, 'q' to quit")
    
    cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("ERROR: Cannot access camera")
        return
    
    test_results = []
    frame_count = 0
    testing = False
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        cv2.putText(frame, "Press 's' to start test, 'q' to quit", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        if testing:
            cv2.putText(frame, f"Testing... Frame {frame_count}/10", (10, 70),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            if frame_count < 10:
                try:
                    # Test the detection
                    _, buf = cv2.imencode('.jpg', frame)
                    image = vision.Image(content=buf.tobytes())
                    response = client.face_detection(image=image)
                    
                    if response.face_annotations:
                        face = response.face_annotations[0]
                        scores = {
                            "Happy": LIKELIHOOD_MAP[face.joy_likelihood],
                            "Sad": LIKELIHOOD_MAP[face.sorrow_likelihood],
                            "Angry": LIKELIHOOD_MAP[face.anger_likelihood],
                            "Surprised": LIKELIHOOD_MAP[face.surprise_likelihood],
                        }
                        emotion = interpret_emotion(face)
                        
                        result = {
                            'frame': frame_count + 1,
                            'emotion': emotion,
                            'scores': scores.copy()
                        }
                        test_results.append(result)
                        
                        print(f"Frame {frame_count + 1}: {emotion} | Scores: {scores}")
                        
                    frame_count += 1
                    time.sleep(1)  # Wait 1 second between tests
                    
                except Exception as e:
                    print(f"Error in frame {frame_count + 1}: {e}")
                    frame_count += 1
            else:
                testing = False
                print("\n=== TEST RESULTS ===")
                analyze_test_results(test_results)
        
        cv2.imshow("Emotion Test", frame)
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord('q'):
            break
        elif key == ord('s') and not testing:
            print("Starting test...")
            testing = True
            frame_count = 0
            test_results = []
    
    cap.release()
    cv2.destroyAllWindows()

def analyze_test_results(results):
    """Analyze the test results and provide insights"""
    if not results:
        print("No results to analyze")
        return
    
    print(f"\nAnalyzed {len(results)} frames:")
    
    # Count emotions
    emotion_counts = {}
    total_confidence = {}
    
    for result in results:
        emotion = result['emotion'].split(' (')[0]  # Remove confidence indicator
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        # Calculate average confidence for each emotion type
        for emo_type, score in result['scores'].items():
            if emo_type not in total_confidence:
                total_confidence[emo_type] = []
            total_confidence[emo_type].append(score)
    
    print("\nEmotion Detection Summary:")
    for emotion, count in emotion_counts.items():
        percentage = (count / len(results)) * 100
        print(f"  {emotion}: {count} times ({percentage:.1f}%)")
    
    print("\nAverage Confidence Scores:")
    for emo_type, scores in total_confidence.items():
        avg_score = sum(scores) / len(scores)
        print(f"  {emo_type}: {avg_score:.2f} (max possible: 4)")
    
    # Recommendations
    print("\n=== RECOMMENDATIONS ===")
    
    # Check if neutral is dominating
    neutral_percentage = (emotion_counts.get("Neutral :|", 0) / len(results)) * 100
    if neutral_percentage > 70:
        print("⚠️  High neutral detection rate. Consider:")
        print("   - Lowering emotion thresholds in emotion_config.py")
        print("   - Better lighting conditions")
        print("   - More expressive facial expressions")
    
    # Check confidence levels
    for emo_type, scores in total_confidence.items():
        avg_score = sum(scores) / len(scores)
        if avg_score < 1.5:
            print(f"⚠️  Low {emo_type} confidence. Try more exaggerated expressions.")
        elif avg_score > 2.5:
            print(f"✅ Good {emo_type} detection confidence!")

if __name__ == "__main__":
    test_emotion_detection()
