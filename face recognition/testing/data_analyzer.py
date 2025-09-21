"""
Emotion Data Analyzer
Analyzes the collected emotion data to identify patterns and suggest improvements
"""

import pandas as pd
import os
from collections import Counter

class EmotionDataAnalyzer:
    def __init__(self, csv_filename="emotion_data_collection.csv"):
        self.csv_path = csv_filename  # We're already in the testing folder
        self.data = None
        
    def load_data(self):
        """Load CSV data"""
        try:
            self.data = pd.read_csv(self.csv_path)
            print(f"📊 Loaded {len(self.data)} entries from {self.csv_path}")
            return True
        except FileNotFoundError:
            print(f"❌ CSV file not found: {self.csv_path}")
            print("🔄 Run the data collector first to generate data")
            return False
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def analyze_accuracy(self):
        """Analyze detection accuracy for each emotion"""
        if self.data is None:
            return
        
        print("\n🎯 ACCURACY ANALYSIS")
        print("=" * 70)
        
        # Map user inputs to standard emotions
        emotion_mapping = {
            'happy': ['happy', 'joy', 'smile', 'smiling'],
            'sad': ['sad', 'sorrow', 'crying', 'down'],
            'angry': ['angry', 'anger', 'mad', 'furious'],
            'surprised': ['surprised', 'surprise', 'shocked'],
            'neutral': ['neutral', 'normal', 'calm']
        }
        
        for emotion, keywords in emotion_mapping.items():
            user_cases = self.data[self.data['User_Expression_Input'].str.lower().isin(keywords)]
            
            if len(user_cases) == 0:
                continue
                
            print(f"\n{emotion.upper()} Analysis ({len(user_cases)} cases):")
            print("-" * 40)
            
            # Get the right score column
            score_columns = {
                'happy': 'Joy_Score',
                'sad': 'Sorrow_Score', 
                'angry': 'Anger_Score',
                'surprised': 'Surprise_Score'
            }
            
            if emotion in score_columns:
                score_col = score_columns[emotion]
                scores = user_cases[score_col].value_counts().sort_index()
                
                print(f"  API Score Distribution:")
                for score, count in scores.items():
                    percentage = (count / len(user_cases)) * 100
                    print(f"    Score {score}: {count} times ({percentage:.1f}%)")
                
                # Show what API detected vs what user said
                print(f"  API Detection Results:")
                api_detections = user_cases['System_Detected_Emotion'].value_counts()
                for detection, count in api_detections.items():
                    percentage = (count / len(user_cases)) * 100
                    print(f"    '{detection}': {count} times ({percentage:.1f}%)")
                
                # Show enhanced detection results if available
                if 'Enhanced_Detection' in user_cases.columns:
                    print(f"  Enhanced Detection Results:")
                    enhanced_detections = user_cases['Enhanced_Detection'].value_counts()
                    for detection, count in enhanced_detections.items():
                        percentage = (count / len(user_cases)) * 100
                        print(f"    '{detection}': {count} times ({percentage:.1f}%)")
                
                # Calculate accuracy rates
                all_scores = user_cases[score_col].tolist()
                if all_scores:
                    max_score = max(all_scores)
                    avg_score = sum(all_scores) / len(all_scores)
                    print(f"  📊 API Stats: Avg={avg_score:.2f}, Max={max_score}")
                    
                    if avg_score == 0:
                        print(f"  🚨 CRITICAL: API NEVER detects {emotion}!")
                    elif avg_score < 1.0:
                        print(f"  ⚠️  Very low API sensitivity for {emotion}")
                    else:
                        print(f"  ✅ API works reasonably for {emotion}")
            
            print()
    
    def show_confusion_patterns(self):
        """Show detailed comparison of user input vs system detection"""
        if self.data is None:
            return
        
        print("\n🔀 DETAILED DETECTION COMPARISON")
        print("=" * 70)
        
        for _, row in self.data.iterrows():
            user_input = row['User_Expression_Input'].lower()
            api_detection = row['System_Detected_Emotion']
            enhanced_detection = row.get('Enhanced_Detection', 'N/A')
            
            scores = {
                'Joy': row['Joy_Score'],
                'Sorrow': row['Sorrow_Score'], 
                'Anger': row['Anger_Score'],
                'Surprise': row['Surprise_Score']
            }
            
            print(f"\n#{row['Detection_Count']} - User: '{user_input}'")
            print(f"  API Detection: {api_detection}")
            print(f"  Enhanced Detection: {enhanced_detection}")
            print(f"  API Scores: Joy={scores['Joy']}, Sorrow={scores['Sorrow']}, Anger={scores['Anger']}, Surprise={scores['Surprise']}")
            
            # Analyze accuracy
            correct_api = self.is_detection_correct(user_input, api_detection)
            correct_enhanced = self.is_detection_correct(user_input, enhanced_detection)
            
            if correct_api and correct_enhanced:
                print("  ✅ Both methods correct")
            elif correct_enhanced and not correct_api:
                print("  🎯 Enhanced method fixed API error!")
            elif correct_api and not correct_enhanced:
                print("  ⚠️  Enhanced method made it worse")
            else:
                print("  ❌ Both methods failed")
    
    def is_detection_correct(self, user_input, detection):
        """Check if detection matches user input"""
        user_input = user_input.lower()
        detection = detection.lower()
        
        if user_input in ['happy', 'joy'] and ('happy' in detection or 'joy' in detection):
            return True
        elif user_input in ['sad', 'sorrow'] and 'sad' in detection:
            return True
        elif user_input in ['angry', 'anger'] and 'angry' in detection:
            return True
        elif user_input in ['surprised', 'surprise'] and 'surprised' in detection:
            return True
        elif user_input in ['neutral', 'normal'] and 'neutral' in detection:
            return True
        return False
    
    def suggest_improvements(self):
        """Suggest threshold improvements based on data"""
        if self.data is None:
            return
        
        print("\n💡 IMPROVEMENT SUGGESTIONS")
        print("=" * 50)
        
        # Analyze sad cases
        sad_cases = self.data[self.data['User_Expression_Input'].str.lower().isin(['sad', 'sorrow'])]
        if len(sad_cases) > 0:
            max_sorrow = sad_cases['Sorrow_Score'].max()
            avg_sorrow = sad_cases['Sorrow_Score'].mean()
            
            print(f"SAD Emotion Analysis:")
            print(f"  📊 {len(sad_cases)} sad expressions collected")
            print(f"  📊 Max Sorrow score: {max_sorrow}")
            print(f"  📊 Average Sorrow score: {avg_sorrow:.2f}")
            
            if max_sorrow == 0:
                print("  🚨 CRITICAL: Google Vision NEVER detects sadness!")
                print("  💡 Solution: Use facial feature analysis or different approach")
            elif avg_sorrow < 0.5:
                print("  ⚠️  Very low sad detection - consider threshold 0")
            else:
                print("  💡 Consider lowering sad threshold to 0 or 1")
        
        # Analyze angry cases
        angry_cases = self.data[self.data['User_Expression_Input'].str.lower().isin(['angry', 'anger', 'mad'])]
        if len(angry_cases) > 0:
            max_anger = angry_cases['Anger_Score'].max()
            avg_anger = angry_cases['Anger_Score'].mean()
            
            print(f"\nANGRY Emotion Analysis:")
            print(f"  📊 {len(angry_cases)} angry expressions collected")
            print(f"  📊 Max Anger score: {max_anger}")
            print(f"  📊 Average Anger score: {avg_anger:.2f}")
            
            if max_anger == 0:
                print("  🚨 CRITICAL: Google Vision NEVER detects anger!")
                print("  💡 Solution: Use facial feature analysis or different approach")
            elif avg_anger < 0.5:
                print("  ⚠️  Very low anger detection - consider threshold 0")
            else:
                print("  💡 Consider lowering anger threshold to 0 or 1")
        
        print(f"\n🔧 RECOMMENDED CODE CHANGES:")
        print("Update your emotion detection thresholds:")
        print("```python")
        print("# In interpret_emotion function:")
        print("if best_emotion == 'Sad :(' and best_score >= 0:")
        print("    return best_emotion")
        print("elif best_emotion == 'Angry >:(' and best_score >= 0:")
        print("    return best_emotion")
        print("```")
    
    def export_summary(self):
        """Export analysis summary"""
        if self.data is None:
            return
        
        summary_file = "analysis_summary.txt"  # We're already in the testing folder
        
        with open(summary_file, 'w') as f:
            f.write("EMOTION DETECTION ANALYSIS SUMMARY\n")
            f.write("=" * 50 + "\n\n")
            
            f.write(f"Total entries analyzed: {len(self.data)}\n")
            f.write(f"Analysis date: {pd.Timestamp.now()}\n\n")
            
            # User input distribution
            user_inputs = self.data['User_Expression_Input'].value_counts()
            f.write("User Expression Distribution:\n")
            for expr, count in user_inputs.items():
                f.write(f"  {expr}: {count} times\n")
            
            f.write(f"\nDetailed data available in: {self.csv_path}\n")
        
        print(f"📄 Summary exported to: {summary_file}")
    
    def run_full_analysis(self):
        """Run complete analysis"""
        if not self.load_data():
            return
        
        self.analyze_accuracy()
        self.show_confusion_patterns()
        self.suggest_improvements()
        self.export_summary()
        
        print(f"\n✅ Analysis complete!")
        print(f"📊 Review the output above and the CSV file for detailed insights")

if __name__ == "__main__":
    analyzer = EmotionDataAnalyzer()
    analyzer.run_full_analysis()
