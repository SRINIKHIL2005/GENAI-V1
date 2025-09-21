import os
import speech_recognition as sr
import google.generativeai as genai
from gtts import gTTS
import pygame
from dotenv import load_dotenv

# Load environment variables

load_dotenv()

# Set up the text-to-speech engine 

# Configure the Google Generative AI API with the provided API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize the speech recognizer
recognizer = sr.Recognizer()

# Print available microphone devices
print("Available microphone devices:")
for index, name in enumerate(sr.Microphone.list_microphone_names()):
    print(f"{index}: {name}")

# Select the microphone device index (try different ones if needed)
# Good options from your list: 1, 7, 14, 19, or 21
device_index = 1  # Start with Microphone (Realtek(R) Audio)

# Use the selected microphone as the audio source
try:
    with sr.Microphone(device_index=device_index) as source:
        print("Please say something:")
        print("Adjusting for ambient noise... Please wait.")
        recognizer.adjust_for_ambient_noise(source, duration=3)
        print("Listening... (speak now)")
        # Increased timeout and phrase limit for better detection
        audio_data = recognizer.listen(source, timeout=10, phrase_time_limit=15)
except sr.WaitTimeoutError:
    print("No speech detected. Please try again and speak louder or closer to the microphone.")
    print("You might also try a different microphone device index (1, 7, 14, 19, or 21)")
    exit()
except Exception as e:
    print(f"Error with microphone: {e}")
    exit()

# Recognize speech using Google Speech Recognition
try:
    text = recognizer.recognize_google(audio_data, language="en-in")
    spoken_text = text
    print("You said:", spoken_text)
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand the audio")
except sr.RequestError as e:
    print(f"Could not request results from Google Speech Recognition service; {e}")

# Model to be used
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])

# Function to get response from the generative model and play it
def get_gemini_response(question):
    response = chat.send_message(question, stream=True)
    full_output = ""
    for chunk in response:
        full_output += chunk.text  # Append each chunk to the full_output string
        print(full_output)
    tts = gTTS(text=full_output, lang='en')
    tts.save("output.mp3")
    pygame.mixer.init()
    pygame.mixer.music.load("output.mp3")
    pygame.mixer.music.play()
    print("Audio is playing...")

    # Wait for the audio to finish playing
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)


gemini_response = get_gemini_response(spoken_text)


print("END OF OUTPUT")
