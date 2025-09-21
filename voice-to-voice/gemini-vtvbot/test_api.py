import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the API key
api_key = os.getenv("GOOGLE_API_KEY")

print("Testing Google Generative AI API...")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")

if not api_key:
    print("ERROR: No API key found in .env file")
    print("Please add GOOGLE_API_KEY=your_actual_api_key to your .env file")
    exit()

# Show first few characters of API key for verification (masked)
print(f"API Key preview: {api_key[:10]}...{api_key[-4:] if len(api_key) > 14 else '****'}")

try:
    # Configure the API
    genai.configure(api_key=api_key)
    
    # First, list available models
    print("\nListing available models...")
    models = genai.list_models()
    available_models = []
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            available_models.append(model.name)
            print(f"- {model.name}")
    
    if not available_models:
        print("No models available for content generation")
        exit()
    
    # Use the first available model (usually gemini-1.5-flash or similar)
    model_name = available_models[0].replace('models/', '')
    print(f"\nUsing model: {model_name}")
    
    # Test with the available model
    model = genai.GenerativeModel(model_name)
    
    # Send a test message
    print("\nSending test message to Gemini...")
    response = model.generate_content("Say hello and confirm you're working")
    
    print("SUCCESS! API is working.")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"ERROR: API test failed - {e}")
    print("\nPossible issues:")
    print("1. Invalid API key")
    print("2. API key doesn't have Generative AI permissions")
    print("3. Billing not enabled on Google Cloud project")
    print("4. API not enabled in Google Cloud Console")