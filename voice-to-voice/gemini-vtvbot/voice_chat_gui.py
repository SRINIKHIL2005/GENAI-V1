import os
import tkinter as tk
from tkinter import ttk, scrolledtext
import threading
import speech_recognition as sr
import google.generativeai as genai
from gtts import gTTS
import pygame
from dotenv import load_dotenv
from datetime import datetime
import json
import wave
import pyaudio

class VoiceChatGUI:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Configure AI
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.chat = self.model.start_chat(history=[])
        
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone(device_index=1)  # Adjust if needed
        
        # Initialize pygame for audio
        pygame.mixer.init()
        
        # Chat state
        self.is_listening = False
        self.conversation_history = []
        self.session_start_time = None
        self.audio_recordings = []
        
        # Audio recording settings
        self.audio_format = pyaudio.paInt16
        self.channels = 1
        self.rate = 44100
        self.chunk = 1024
        
        # Create GUI
        self.setup_gui()
        
    def setup_gui(self):
        self.root = tk.Tk()
        self.root.title("Gemini Voice Chat")
        self.root.geometry("600x500")
        self.root.configure(bg='#2b2b2b')
        
        # Title
        title_label = tk.Label(self.root, text="🎤 Gemini Voice Chat", 
                              font=("Arial", 16, "bold"), 
                              bg='#2b2b2b', fg='white')
        title_label.pack(pady=10)
        
        # Status label
        self.status_label = tk.Label(self.root, text="Ready to start conversation", 
                                    font=("Arial", 10), 
                                    bg='#2b2b2b', fg='#00ff00')
        self.status_label.pack(pady=5)
        
        # Transcript area
        transcript_frame = tk.Frame(self.root, bg='#2b2b2b')
        transcript_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        tk.Label(transcript_frame, text="Conversation Transcript:", 
                font=("Arial", 12, "bold"), bg='#2b2b2b', fg='white').pack(anchor='w')
        
        self.transcript_text = scrolledtext.ScrolledText(
            transcript_frame, 
            wrap=tk.WORD, 
            width=70, 
            height=20,
            bg='#1e1e1e', 
            fg='white',
            font=("Consolas", 10),
            insertbackground='white'
        )
        self.transcript_text.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Button frame
        button_frame = tk.Frame(self.root, bg='#2b2b2b')
        button_frame.pack(pady=20)
        
        # Start button
        self.start_button = tk.Button(
            button_frame, 
            text="🎤 Start Voice Chat", 
            command=self.start_chat,
            bg='#00aa00', 
            fg='white', 
            font=("Arial", 12, "bold"),
            padx=20, 
            pady=10,
            relief='raised'
        )
        self.start_button.pack(side=tk.LEFT, padx=10)
        
        # Stop button
        self.stop_button = tk.Button(
            button_frame, 
            text="⏹️ Stop & Save", 
            command=self.stop_chat,
            bg='#aa0000', 
            fg='white', 
            font=("Arial", 12, "bold"),
            padx=20, 
            pady=10,
            relief='raised',
            state='disabled'
        )
        self.stop_button.pack(side=tk.LEFT, padx=10)
        
    def update_status(self, message, color='#00ff00'):
        self.status_label.config(text=message, fg=color)
        self.root.update()
        
    def add_to_transcript(self, speaker, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{timestamp}] {speaker}: {message}\n\n"
        
        self.transcript_text.insert(tk.END, formatted_message)
        self.transcript_text.see(tk.END)
        self.root.update()
        
        # Store in conversation history
        self.conversation_history.append({
            "timestamp": timestamp,
            "speaker": speaker,
            "message": message
        })
        
    def speak_text(self, text):
        try:
            self.update_status("🔊 Speaking response...", '#00aaff')
            
            # Create TTS audio file
            tts = gTTS(text=text, lang='en', slow=False)
            audio_filename = f"temp_response_{datetime.now().strftime('%H%M%S')}.mp3"
            tts.save(audio_filename)
            
            # Play the audio
            pygame.mixer.music.load(audio_filename)
            pygame.mixer.music.play()
            
            # Wait for audio to finish playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                if not self.is_listening:  # Allow interruption
                    pygame.mixer.music.stop()
                    break
                    
            # Clean up temp file
            try:
                os.remove(audio_filename)
            except:
                pass
                
        except Exception as e:
            self.update_status(f"🔊 TTS Error: {str(e)}", '#ff0000')
            print(f"TTS Error: {e}")
            
    def record_audio_to_file(self, audio_data, filename):
        """Save audio data to WAV file"""
        try:
            with wave.open(filename, 'wb') as wf:
                wf.setnchannels(self.channels)
                wf.setsampwidth(pyaudio.PyAudio().get_sample_size(self.audio_format))
                wf.setframerate(self.rate)
                wf.writeframes(audio_data.get_wav_data())
        except Exception as e:
            print(f"Audio save error: {e}")
    
    def listen_for_speech(self):
        try:
            with self.microphone as source:
                self.update_status("🎧 Adjusting for ambient noise...", '#ffaa00')
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                
                self.update_status("🎤 Listening... (speak now)", '#00ff00')
                audio_data = self.recognizer.listen(source, timeout=10, phrase_time_limit=15)
                
                # Save the audio recording
                timestamp = datetime.now().strftime("%H%M%S")
                audio_filename = f"temp_user_audio_{timestamp}.wav"
                self.record_audio_to_file(audio_data, audio_filename)
                self.audio_recordings.append({
                    "timestamp": timestamp,
                    "filename": audio_filename,
                    "type": "user_input"
                })
                
                self.update_status("🔄 Processing speech...", '#ffaa00')
                text = self.recognizer.recognize_google(audio_data, language="en-in")
                return text
                
        except sr.WaitTimeoutError:
            self.update_status("⏰ No speech detected, continuing...", '#ffaa00')
            return None
        except sr.UnknownValueError:
            self.update_status("❓ Could not understand audio", '#ff6600')
            return None
        except Exception as e:
            self.update_status(f"❌ Error: {str(e)}", '#ff0000')
            return None
            
    def get_ai_response(self, user_input):
        try:
            self.update_status("🤖 Getting AI response...", '#ffaa00')
            response = self.chat.send_message(user_input)
            return response.text
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
            
    def chat_loop(self):
        # Initial greeting
        greeting = "Hello! I'm your voice assistant. How can I help you today?"
        self.add_to_transcript("AI", greeting)
        self.speak_text(greeting)
        
        while self.is_listening:
            # Listen for user input
            user_input = self.listen_for_speech()
            
            if not self.is_listening:  # Check if stopped during listening
                break
                
            if user_input:
                # Check for stop command
                if any(word in user_input.lower() for word in ['stop', 'quit', 'exit', 'end']):
                    self.add_to_transcript("You", user_input)
                    goodbye = "Goodbye! Saving our conversation now."
                    self.add_to_transcript("AI", goodbye)
                    self.speak_text(goodbye)
                    self.stop_chat()
                    break
                    
                # Add user input to transcript
                self.add_to_transcript("You", user_input)
                
                # Get AI response
                ai_response = self.get_ai_response(user_input)
                self.add_to_transcript("AI", ai_response)
                
                # Speak the response
                self.speak_text(ai_response)
                
        self.update_status("💾 Chat session ended", '#ffaa00')
        
    def start_chat(self):
        self.is_listening = True
        self.session_start_time = datetime.now()
        self.conversation_history = []
        self.audio_recordings = []
        
        # Create session folder for audio files
        session_id = self.session_start_time.strftime("%Y%m%d_%H%M%S")
        self.session_folder = f"transcripts/session_{session_id}"
        os.makedirs(self.session_folder, exist_ok=True)
        
        # Update UI
        self.start_button.config(state='disabled')
        self.stop_button.config(state='normal')
        self.transcript_text.delete(1.0, tk.END)
        
        # Start chat in separate thread
        chat_thread = threading.Thread(target=self.chat_loop, daemon=True)
        chat_thread.start()
        
    def stop_chat(self):
        self.is_listening = False
        
        # Update UI
        self.start_button.config(state='normal')
        self.stop_button.config(state='disabled')
        
        # Save transcript
        self.save_transcript()
        
    def save_transcript(self):
        if not self.conversation_history:
            return
            
        # Move audio files to session folder
        self.update_status("📁 Organizing audio files...", '#ffaa00')
        for recording in self.audio_recordings:
            old_path = recording["filename"]
            new_path = os.path.join(self.session_folder, os.path.basename(old_path))
            try:
                if os.path.exists(old_path):
                    os.rename(old_path, new_path)
                    recording["filename"] = new_path
            except Exception as e:
                print(f"Error moving audio file: {e}")
        
        # Generate filename with timestamp
        timestamp = self.session_start_time.strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.session_folder, f"chat_{timestamp}.json")
        
        # Generate summary
        self.update_status("📝 Generating summary...", '#ffaa00')
        summary = self.generate_summary()
        
        # Prepare data
        transcript_data = {
            "session_info": {
                "start_time": self.session_start_time.isoformat(),
                "end_time": datetime.now().isoformat(),
                "duration_minutes": round((datetime.now() - self.session_start_time).total_seconds() / 60, 2),
                "session_folder": self.session_folder
            },
            "summary": summary,
            "conversation": self.conversation_history,
            "audio_recordings": self.audio_recordings
        }
        
        # Save to file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(transcript_data, f, indent=2, ensure_ascii=False)
            
        self.update_status(f"💾 Session saved: {self.session_folder}", '#00ff00')
        
    def generate_summary(self):
        try:
            # Create conversation text for summary
            conversation_text = ""
            for entry in self.conversation_history:
                conversation_text += f"{entry['speaker']}: {entry['message']}\n"
                
            # Ask AI to summarize
            summary_prompt = f"Please provide a brief summary of this conversation:\n\n{conversation_text}"
            summary_response = self.model.generate_content(summary_prompt)
            return summary_response.text
        except:
            return "Summary generation failed."
            
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = VoiceChatGUI()
    app.run()