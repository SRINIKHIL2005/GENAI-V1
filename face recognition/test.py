import os
from dotenv import load_dotenv
from google.cloud import vision

# Load variables from .env file
load_dotenv()

# Now GOOGLE_APPLICATION_CREDENTIALS is available
client = vision.ImageAnnotatorClient()
print("✅ Client constructed successfully with .env")
