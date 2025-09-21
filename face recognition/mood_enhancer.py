"""
Mood Enhancement System
Provides responses and actions based on detected emotions
"""

import random
import webbrowser
import os
import time
from datetime import datetime

class MoodEnhancer:
    def __init__(self):
        self.responses = {
            "Happy :)": [
                "🎉 You're radiating joy! Keep that beautiful energy flowing!",
                "✨ Your smile is lighting up the room!",
                "🌟 Happiness looks amazing on you!",
                "😊 Your positive vibes are contagious!",
                "🎊 You're absolutely glowing today!"
            ],
            "Sad :(": [
                "💙 I see you're going through a tough time. You're not alone.",
                "🌈 After every storm comes a rainbow. This will pass.",
                "🤗 Sending you virtual hugs. You're stronger than you know.",
                "⭐ Even in darkness, stars still shine. You're one of them.",
                "🌅 Tomorrow brings new possibilities and hope."
            ],
            "Angry >:(": [
                "🧘‍♀️ Take a deep breath with me... inhale peace, exhale tension.",
                "💚 Your feelings are valid. Let's channel this energy positively.",
                "🌊 Like ocean waves, let this feeling wash over and past you.",
                "🕊️ In stillness, you'll find your strength again.",
                "🌿 Take a moment to ground yourself. You've got this."
            ],
            "Surprised :O": [
                "😲 Life keeps things interesting, doesn't it?",
                "🎊 Surprise is the spice of life!",
                "✨ Your expression says it all - what an adventure!",
                "🎭 The best stories start with unexpected moments!",
                "🌟 Embrace the wonder - you're living fully!"
            ],
            "Neutral :|": [
                "🌻 Perfect moment to set a positive intention for your day.",
                "☕ Sometimes calm is exactly what we need.",
                "🎯 You look ready to take on whatever comes next!",
                "🌿 There's beauty in peaceful moments like this.",
                "🌸 Neutral is a great starting point for any emotion!"
            ]
        }
        
        self.actions = {
            "Sad :(": {
                "motivational_quotes": [
                    "The darkest nights produce the brightest stars.",
                    "You are braver than you believe, stronger than you seem.",
                    "This too shall pass, and you will emerge stronger.",
                    "Every ending is a new beginning in disguise.",
                    "You've survived 100% of your worst days so far."
                ],
                "activities": [
                    "Try listening to your favorite uplifting song",
                    "Call someone who makes you laugh",
                    "Take a short walk outside if possible",
                    "Write down three things you're grateful for",
                    "Watch a funny video or cute animal compilation"
                ],
                "emergency_urls": [
                    "https://www.youtube.com/watch?v=ZbZSe6N_BXs",  # Happy dogs
                    "https://www.youtube.com/watch?v=hFZFjoX2cGg",  # Cute animals
                    "https://www.youtube.com/watch?v=mNrXMOSkBas"   # Motivational
                ]
            },
            "Angry >:(": {
                "calming_techniques": [
                    "Count to 10 slowly while taking deep breaths",
                    "Tense and release your muscles, starting from your toes",
                    "Picture a peaceful place that makes you feel calm",
                    "Try the 4-7-8 breathing technique",
                    "Write down what's bothering you, then crumple up the paper"
                ],
                "relaxation_urls": [
                    "https://www.youtube.com/watch?v=YQcZKDSk4wI",  # Rain sounds
                    "https://www.youtube.com/watch?v=1ZYbU82GVz4",  # Meditation
                    "https://www.youtube.com/watch?v=aEIBEECfO7k"   # Calming music
                ]
            },
            "Happy :)": {
                "celebration": [
                    "🎉 Share this joy with someone special!",
                    "🌟 Capture this moment - take a photo!",
                    "💫 Spread your happiness - compliment someone today!",
                    "🎵 Dance like nobody's watching!",
                    "📝 Write down what made you happy today!"
                ]
            }
        }
        
        self.action_cooldown = {}  # Prevent spam
        self.response_history = []
    
    def get_response(self, emotion):
        """Get a random response for the given emotion"""
        base_emotion = emotion.split(" (")[0]  # Remove confidence indicators
        
        if base_emotion in self.responses:
            response = random.choice(self.responses[base_emotion])
            self.response_history.append({
                'emotion': base_emotion,
                'response': response,
                'timestamp': datetime.now()
            })
            return response
        
        return "🤖 I'm here with you, whatever you're feeling!"
    
    def trigger_action(self, emotion, force=False):
        """Trigger mood-enhancing actions based on emotion"""
        base_emotion = emotion.split(" (")[0]
        current_time = time.time()
        
        # Cooldown check (prevent spam)
        if not force and base_emotion in self.action_cooldown:
            if current_time - self.action_cooldown[base_emotion] < 30:  # 30 second cooldown
                return None
        
        self.action_cooldown[base_emotion] = current_time
        
        actions_taken = []
        
        if base_emotion == "Sad :(":
            # Random chance for different actions
            if random.random() < 0.4:  # 40% chance
                quote = random.choice(self.actions["Sad :("]["motivational_quotes"])
                actions_taken.append(f"💭 {quote}")
            
            if random.random() < 0.3:  # 30% chance
                activity = random.choice(self.actions["Sad :("]["activities"])
                actions_taken.append(f"💡 Suggestion: {activity}")
            
            if random.random() < 0.1:  # 10% chance for video
                print("🎬 Opening uplifting content to brighten your day...")
                # Uncomment to actually open:
                # url = random.choice(self.actions["Sad :("]["emergency_urls"])
                # webbrowser.open(url)
                actions_taken.append("🎬 Opened uplifting video content")
        
        elif base_emotion == "Angry >:(":
            if random.random() < 0.5:  # 50% chance
                technique = random.choice(self.actions["Angry >:("]["calming_techniques"])
                actions_taken.append(f"🧘 Try this: {technique}")
            
            if random.random() < 0.2:  # 20% chance
                print("🎵 Opening calming content to help you relax...")
                # Uncomment to actually open:
                # url = random.choice(self.actions["Angry >:("]["relaxation_urls"])
                # webbrowser.open(url)
                actions_taken.append("🎵 Opened calming audio content")
        
        elif base_emotion == "Happy :)":
            if random.random() < 0.3:  # 30% chance
                celebration = random.choice(self.actions["Happy :)"]["celebration"])
                actions_taken.append(celebration)
        
        return actions_taken if actions_taken else None
    
    def get_statistics(self):
        """Get statistics about emotion responses"""
        if not self.response_history:
            return "No emotion data recorded yet."
        
        emotion_counts = {}
        for entry in self.response_history:
            emotion = entry['emotion']
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        total_responses = len(self.response_history)
        stats = "📊 Emotion Statistics:\n"
        
        for emotion, count in sorted(emotion_counts.items()):
            percentage = (count / total_responses) * 100
            stats += f"  {emotion}: {count} times ({percentage:.1f}%)\n"
        
        return stats
    
    def force_mood_boost(self, target_emotion=None):
        """Manually trigger a mood boost"""
        if target_emotion:
            response = self.get_response(target_emotion)
            actions = self.trigger_action(target_emotion, force=True)
            return response, actions
        else:
            # Generic mood boost
            boosts = [
                "🌟 You're amazing just as you are!",
                "💪 You've got the strength to handle anything!",
                "🌈 Every day is a chance for something wonderful!",
                "✨ Your potential is limitless!",
                "🎯 You're exactly where you need to be right now!"
            ]
            return random.choice(boosts), ["🚀 Manual mood boost activated!"]

# Test the mood enhancer
if __name__ == "__main__":
    enhancer = MoodEnhancer()
    
    print("=== MOOD ENHANCER TEST ===")
    test_emotions = ["Happy :)", "Sad :(", "Angry >:(", "Surprised :O", "Neutral :|"]
    
    for emotion in test_emotions:
        print(f"\n--- Testing {emotion} ---")
        response = enhancer.get_response(emotion)
        print(f"Response: {response}")
        
        actions = enhancer.trigger_action(emotion)
        if actions:
            print("Actions:")
            for action in actions:
                print(f"  {action}")
        else:
            print("No actions triggered this time")
    
    print("\n" + enhancer.get_statistics())
