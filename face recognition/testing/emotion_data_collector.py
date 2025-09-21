"""
Emotion Data Collector - Advanced Testing Tool
Split screen interface for collecting emotion detection data

Features:
- Left: Live camera feed
- Right: Real-time API response display
- Text input for your expression verdict
- CSV logging with complete API data
- Slow detection intervals for comfortable data entry
"""

import cv2
import os
import csv
import time
import threading
from datetime import datetime
from dotenv import load_dotenv
from google.cloud import vision
import numpy as np

# Load environment
load_dotenv()
client = vision.ImageAnnotatorClient()

# Configuration
DETECTION_INTERVAL = 5.0  # 5 seconds between API calls - plenty of time to type
CSV_FILENAME = "emotion_data_collection.csv"
WINDOW_WIDTH = 1200
WINDOW_HEIGHT = 600
CAMERA_WIDTH = WINDOW_WIDTH // 2
CAMERA_HEIGHT = WINDOW_HEIGHT

# Likelihood mapping
LIKELIHOOD_MAP = {
    vision.Likelihood.VERY_UNLIKELY: 0,
    vision.Likelihood.UNLIKELY: 1,
    vision.Likelihood.POSSIBLE: 2,
    vision.Likelihood.LIKELY: 3,
    vision.Likelihood.VERY_LIKELY: 4,
}

LIKELIHOOD_TEXT = {
    0: "Very Unlikely",
    1: "Unlikely", 
    2: "Possible",
    3: "Likely",
    4: "Very Likely"
}

class EmotionDataCollector:
    def __init__(self):
        self.current_frame = None
        self.captured_frame = None  # Frame captured during detection
        self.api_response = None
        self.emotion_scores = {}
        self.detection_count = 0
        self.user_input = ""
        self.input_complete = False
        self.stop_event = threading.Event()
        self.last_detection_time = 0
        self.waiting_for_input = False
        self.current_input_text = ""
        self.input_cursor_visible = True
        self.last_cursor_blink = 0
        self.enhanced_detection = "Waiting..."
        
        # Initialize CSV file
        self.init_csv()
        
        print("🎯 Emotion Data Collector Started!")
        print("📊 This tool will help us understand why sad/angry detection isn't working")
        print("⏰ Detection happens every 5 seconds AFTER you enter your verdict")
        print("💾 All data is saved to emotion_data_collection.csv")
        print("🔤 Type your expression in the console when prompted")
        print("❌ Press ESC to exit")
        
    def init_csv(self):
        """Initialize CSV file with headers"""
        csv_path = CSV_FILENAME  # We're already in the testing folder
        with open(csv_path, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                'Timestamp',
                'Detection_Count', 
                'User_Expression_Input',
                'Joy_Score',
                'Joy_Text',
                'Sorrow_Score', 
                'Sorrow_Text',
                'Anger_Score',
                'Anger_Text', 
                'Surprise_Score',
                'Surprise_Text',
                'System_Detected_Emotion',
                'Enhanced_Detection',
                'Notes'
            ])
        print(f"📁 CSV file initialized: {csv_path}")
    
    def analyze_facial_geometry(self, face):
        """Analyze facial landmarks for better emotion detection"""
        landmarks = face.landmarks
        landmark_dict = {}
        for landmark in landmarks:
            landmark_dict[landmark.type_] = landmark.position
        
        try:
            # Get key landmarks
            left_mouth = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_LEFT)
            right_mouth = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_RIGHT)
            mouth_center = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.MOUTH_CENTER)
            left_eyebrow = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.LEFT_EYEBROW_UPPER_MIDPOINT)
            right_eyebrow = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.RIGHT_EYEBROW_UPPER_MIDPOINT)
            left_eye = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.LEFT_EYE)
            right_eye = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.RIGHT_EYE)
            nose_tip = landmark_dict.get(vision.FaceAnnotation.Landmark.Type.NOSE_TIP)
            
            if not all([left_mouth, right_mouth, mouth_center, left_eyebrow, right_eyebrow, nose_tip]):
                return None
            
            # Calculate mouth curvature (FIXED: negative = sad, positive = happy)
            mouth_width = abs(right_mouth.x - left_mouth.x)
            mouth_center_y = mouth_center.y
            mouth_corners_avg_y = (left_mouth.y + right_mouth.y) / 2
            mouth_curvature = (mouth_corners_avg_y - mouth_center_y) / mouth_width if mouth_width > 0 else 0
            
            # Calculate eyebrow furrow (for anger detection)
            if left_eye and right_eye:
                eye_center_y = (left_eye.y + right_eye.y) / 2
                eyebrow_center_y = (left_eyebrow.y + right_eyebrow.y) / 2
                eyebrow_distance = eye_center_y - eyebrow_center_y
                
                # Normalize by face height
                face_height = abs(mouth_center.y - eyebrow_center_y)
                eyebrow_ratio = eyebrow_distance / face_height if face_height > 0 else 0
            else:
                eyebrow_ratio = 0
            
            # Calculate eyebrow spread (for surprise detection)
            eyebrow_spread = abs(right_eyebrow.x - left_eyebrow.x)
            face_width = abs(right_mouth.x - left_mouth.x)
            eyebrow_spread_ratio = eyebrow_spread / face_width if face_width > 0 else 0
            
            return {
                'mouth_curvature': mouth_curvature,
                'eyebrow_ratio': eyebrow_ratio,
                'eyebrow_spread': eyebrow_spread_ratio
            }
            
        except Exception as e:
            return None

    def detect_emotion_enhanced(self, frame):
        """Enhanced emotion detection using API + facial geometry"""
        try:
            _, buf = cv2.imencode('.jpg', frame)
            image = vision.Image(content=buf.tobytes())
            response = client.face_detection(image=image)
            
            if not response.face_annotations:
                return None, None
            
            face = response.face_annotations[0]
            
            # Get API scores
            api_scores = {
                'joy': LIKELIHOOD_MAP[face.joy_likelihood],
                'sorrow': LIKELIHOOD_MAP[face.sorrow_likelihood],
                'anger': LIKELIHOOD_MAP[face.anger_likelihood],
                'surprise': LIKELIHOOD_MAP[face.surprise_likelihood]
            }
            
            # Get geometry analysis
            geometry = self.analyze_facial_geometry(face)
            
            # Enhanced detection logic
            detected_emotion = "Neutral/Unclear"
            detection_method = "API"
            
            # If API gives good results for positive emotions, use them
            max_api_score = max(api_scores.values())
            if max_api_score >= 2:
                best_api_emotion = max(api_scores, key=api_scores.get)
                if best_api_emotion in ['joy', 'surprise']:
                    detected_emotion = f"{best_api_emotion.title()} (API Score: {max_api_score})"
                    return api_scores, detected_emotion
            
            # Use geometry for better detection when API fails
            if geometry and max_api_score <= 1:
                mouth_curve = geometry['mouth_curvature']
                eyebrow_ratio = geometry['eyebrow_ratio']
                eyebrow_spread = geometry['eyebrow_spread']
                
                # Improved thresholds based on your data
                if mouth_curve < -0.015:  # Mouth corners below center = sad
                    detected_emotion = f"Sad (Geometry: mouth={mouth_curve:.3f})"
                    detection_method = "Geometry"
                elif eyebrow_ratio < 0.20:  # Very low eyebrows = angry
                    detected_emotion = f"Angry (Geometry: brow={eyebrow_ratio:.3f})"
                    detection_method = "Geometry"
                elif eyebrow_ratio > 0.28 and eyebrow_spread > 1.2:  # High + wide eyebrows = surprised
                    detected_emotion = f"Surprised (Geometry: brow={eyebrow_ratio:.3f})"
                    detection_method = "Geometry"
                elif mouth_curve > 0.020:  # Mouth corners above center = happy
                    detected_emotion = f"Happy (Geometry: mouth={mouth_curve:.3f})"
                    detection_method = "Geometry"
                else:
                    detected_emotion = f"Neutral (mouth={mouth_curve:.3f}, brow={eyebrow_ratio:.3f})"
                    detection_method = "Geometry"
            
            return api_scores, detected_emotion
            
        except Exception as e:
            print(f"❌ Enhanced API Error: {e}")
            return None, None
    
    def get_detected_emotion(self, scores):
        """Determine which emotion has highest score"""
        if not scores:
            return "No Face Detected"
        
        max_emotion = max(scores, key=scores.get)
        max_score = scores[max_emotion]
        
        if max_score >= 2:
            return f"{max_emotion.title()} (Score: {max_score})"
        elif max_score >= 1:
            return f"{max_emotion.title()} (Low Confidence: {max_score})"
        else:
            return "Neutral/Unclear"
    
    def save_to_csv(self, user_input, scores):
        """Save detection data to CSV"""
        csv_path = CSV_FILENAME  # We're already in the testing folder
        
        if scores:
            detected_emotion = self.get_detected_emotion(scores)
            
            row = [
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                self.detection_count,
                user_input,
                scores['joy'],
                LIKELIHOOD_TEXT[scores['joy']],
                scores['sorrow'],
                LIKELIHOOD_TEXT[scores['sorrow']],
                scores['anger'],
                LIKELIHOOD_TEXT[scores['anger']],
                scores['surprise'],
                LIKELIHOOD_TEXT[scores['surprise']],
                detected_emotion,
                self.enhanced_detection,
                f"Total detections: {self.detection_count}"
            ]
        else:
            row = [
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                self.detection_count,
                user_input,
                "N/A", "No Face", "N/A", "No Face", 
                "N/A", "No Face", "N/A", "No Face",
                "No Face Detected",
                "No Enhanced Detection",
                "API call failed or no face found"
            ]
        
        with open(csv_path, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(row)
        
        print(f"💾 Data saved to CSV (Entry #{self.detection_count})")
    
    def start_user_input(self):
        """Start user input process (non-blocking)"""
        self.waiting_for_input = True
        self.current_input_text = ""
        self.input_complete = False
        
        print(f"\n🎭 DETECTION #{self.detection_count}")
        print("💡 Type your expression in the camera window!")
        print("Options: happy, sad, angry, surprised, neutral, other")
        print("Press ENTER when done, ESC to skip")
    
    def complete_user_input(self):
        """Complete user input and return the result"""
        user_input = self.current_input_text.strip()
        if not user_input:
            user_input = "not_specified"
        
        self.waiting_for_input = False
        return user_input
    
    def create_display_frame(self, camera_frame):
        """Create split screen display"""
        # Create display canvas
        display = np.zeros((WINDOW_HEIGHT, WINDOW_WIDTH, 3), dtype=np.uint8)
        
        # Left side - Show captured frame if waiting for input, otherwise live feed
        frame_to_show = self.captured_frame if (self.waiting_for_input and self.captured_frame is not None) else camera_frame
        
        if frame_to_show is not None:
            # Resize camera frame to fit left half
            camera_resized = cv2.resize(frame_to_show, (CAMERA_WIDTH, CAMERA_HEIGHT))
            display[0:CAMERA_HEIGHT, 0:CAMERA_WIDTH] = camera_resized
            
            # Add overlay text to show what's being displayed
            if self.waiting_for_input and self.captured_frame is not None:
                cv2.putText(display, "CAPTURED EXPRESSION", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
                cv2.putText(display, f"Detection #{self.detection_count}", (10, 60),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            else:
                cv2.putText(display, "LIVE FEED", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Right side - Clean API Response display
        right_start_x = CAMERA_WIDTH
        
        # Background for right side
        cv2.rectangle(display, (right_start_x, 0), (WINDOW_WIDTH, WINDOW_HEIGHT), (30, 30, 30), -1)
        
        # Clean header
        cv2.putText(display, f"Detection #{self.detection_count}", (right_start_x + 20, 40),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        
        # Status
        if not self.waiting_for_input:
            time_since_last = time.time() - self.last_detection_time
            time_remaining = max(0, DETECTION_INTERVAL - time_since_last)
            if time_remaining > 0:
                cv2.putText(display, f"Next in: {time_remaining:.1f}s", (right_start_x + 20, 75),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            else:
                cv2.putText(display, "Ready...", (right_start_x + 20, 75),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        else:
            cv2.putText(display, "Enter your expression:", (right_start_x + 20, 75),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 100, 100), 2)
        
        # Clean API Response data
        if self.emotion_scores:
            y_offset = 110
            
            # Enhanced Detection - Show both API and geometry results
            cv2.putText(display, "Enhanced Detection:", (right_start_x + 20, y_offset),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
            cv2.putText(display, self.enhanced_detection, (right_start_x + 20, y_offset + 25),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
            
            # Also show old API detection for comparison
            old_detected = self.get_detected_emotion(self.emotion_scores)
            cv2.putText(display, f"API Only: {old_detected}", (right_start_x + 20, y_offset + 50),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, (150, 150, 150), 1)
            
            # Clean emotion scores
            emotions = [
                ("Happy", self.emotion_scores.get('joy', 0), (0, 255, 0)),
                ("Sad", self.emotion_scores.get('sorrow', 0), (100, 150, 255)),
                ("Angry", self.emotion_scores.get('anger', 0), (0, 100, 255)),
                ("Surprised", self.emotion_scores.get('surprise', 0), (0, 255, 255))
            ]
            
            y_start = y_offset + 70
            for i, (emotion_name, score, color) in enumerate(emotions):
                y_pos = y_start + (i * 35)
                
                # Simple, clean display
                cv2.putText(display, f"{emotion_name}:", (right_start_x + 20, y_pos),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # Score with color coding
                score_color = color if score > 0 else (100, 100, 100)
                cv2.putText(display, f"{score}/4", (right_start_x + 120, y_pos),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, score_color, 2)
                
                # Simple confidence bar
                if score > 0:
                    bar_length = int(score * 30)
                    cv2.rectangle(display, (right_start_x + 180, y_pos - 8), 
                                 (right_start_x + 180 + bar_length, y_pos - 3), score_color, -1)
        else:
            # No API response yet
            cv2.putText(display, "Waiting for detection...", (right_start_x + 20, 150),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # Clean Input Box or Instructions
        if self.waiting_for_input:
            # Clean input section
            y_input_start = 280
            
            cv2.putText(display, "Your expression:", (right_start_x + 20, y_input_start),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Input field
            cv2.rectangle(display, (right_start_x + 20, y_input_start + 20), (WINDOW_WIDTH - 30, y_input_start + 55), (50, 50, 50), -1)
            cv2.rectangle(display, (right_start_x + 20, y_input_start + 20), (WINDOW_WIDTH - 30, y_input_start + 55), (255, 255, 255), 2)
            
            input_display = self.current_input_text
            if time.time() - self.last_cursor_blink > 0.5:
                self.input_cursor_visible = not self.input_cursor_visible
                self.last_cursor_blink = time.time()
            
            if self.input_cursor_visible:
                input_display += "|"
            
            cv2.putText(display, input_display, (right_start_x + 30, y_input_start + 45),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            
            # Simple instructions
            cv2.putText(display, "Options: happy, sad, angry, surprised, neutral", (right_start_x + 20, y_input_start + 80),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)
            cv2.putText(display, "ENTER = confirm | ESC = skip", (right_start_x + 20, y_input_start + 100),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 0), 1)
        else:
            # Minimal instructions
            y_inst_start = 280
            instructions = [
                "1. Make expression",
                "2. Wait for detection", 
                "3. Type what you made",
                "4. Press ENTER",
                "",
                "Focus on sad & angry!",
                "ESC = exit"
            ]
            
            for i, instruction in enumerate(instructions):
                color = (0, 255, 255) if "sad & angry" in instruction else (180, 180, 180)
                cv2.putText(display, instruction, (right_start_x + 20, y_inst_start + i*25),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
        
        return display
    
    def run(self):
        """Main application loop"""
        # Initialize camera
        cap = cv2.VideoCapture(1)
        if not cap.isOpened():
            cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("❌ Cannot access camera")
            return
        
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        print("\n🚀 Application started!")
        print("📹 Camera feed will appear in split screen")
        print("📊 API data will appear on the right side")
        print("⏰ First detection will happen in 5 seconds...")
        
        # Give user time to get ready
        self.last_detection_time = time.time() + 3  # Add 3 second delay
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read camera frame")
                break
            
            # Flip frame for mirror effect
            frame = cv2.flip(frame, 1)
            self.current_frame = frame.copy()
            
            # Check if it's time for detection
            current_time = time.time()
            if current_time - self.last_detection_time >= DETECTION_INTERVAL and not self.waiting_for_input:
                self.detection_count += 1
                self.last_detection_time = current_time
                
                # Capture the frame for display during input
                self.captured_frame = frame.copy()
                
                print(f"\n🔄 Running detection #{self.detection_count}...")
                
                # Get enhanced API response
                scores, enhanced_detection = self.detect_emotion_enhanced(frame)
                self.emotion_scores = scores if scores else {}
                self.enhanced_detection = enhanced_detection if enhanced_detection else "No Detection"
                
                if scores:
                    print("📊 API Response:")
                    print(f"   Joy (Happy): {scores['joy']} - {LIKELIHOOD_TEXT[scores['joy']]}")
                    print(f"   Sorrow (Sad): {scores['sorrow']} - {LIKELIHOOD_TEXT[scores['sorrow']]}")
                    print(f"   Anger: {scores['anger']} - {LIKELIHOOD_TEXT[scores['anger']]}")
                    print(f"   Surprise: {scores['surprise']} - {LIKELIHOOD_TEXT[scores['surprise']]}")
                    print(f"   System thinks: {self.get_detected_emotion(scores)}")
                else:
                    print("❌ No face detected or API error")
                
                # Start user input process (non-blocking)
                self.start_user_input()
            
            # Create and show display
            display = self.create_display_frame(frame)
            cv2.imshow("Emotion Data Collector - Testing Tool", display)
            
            # Handle key events
            key = cv2.waitKey(1) & 0xFF
            
            if self.waiting_for_input:
                # Handle text input
                if key == 13:  # ENTER
                    user_input = self.complete_user_input()
                    print(f"✅ Input received: '{user_input}'")
                    
                    # Save to CSV
                    self.save_to_csv(user_input, self.emotion_scores)
                    
                    print(f"✅ Detection #{self.detection_count} complete!")
                    print(f"⏰ Next detection in {DETECTION_INTERVAL} seconds...")
                    
                    # Reset timer AFTER user input is complete
                    self.last_detection_time = time.time()
                    
                elif key == 27:  # ESC - skip input
                    self.current_input_text = "skipped"
                    user_input = self.complete_user_input()
                    print("⚠️ Input skipped")
                    
                    # Save to CSV even if skipped
                    self.save_to_csv(user_input, self.emotion_scores)
                    
                    print(f"✅ Detection #{self.detection_count} complete!")
                    print(f"⏰ Next detection in {DETECTION_INTERVAL} seconds...")
                    
                    # Reset timer AFTER user input is complete
                    self.last_detection_time = time.time()
                    
                elif key == 8:  # BACKSPACE
                    if len(self.current_input_text) > 0:
                        self.current_input_text = self.current_input_text[:-1]
                elif key != 255 and 32 <= key <= 126:  # Printable characters
                    if len(self.current_input_text) < 20:  # Limit input length
                        self.current_input_text += chr(key)
            else:
                # Normal navigation
                if key == 27:  # ESC
                    print("\n👋 Exiting application...")
                    break
        
        cap.release()
        cv2.destroyAllWindows()
        
        print(f"\n📊 Data Collection Complete!")
        print(f"📁 {self.detection_count} entries saved to {CSV_FILENAME}")
        print("🔍 Review the CSV file to analyze patterns and improve detection")

if __name__ == "__main__":
    collector = EmotionDataCollector()
    collector.run()
