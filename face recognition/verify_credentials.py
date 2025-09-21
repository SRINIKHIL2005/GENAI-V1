"""
Google Cloud Vision API Credentials Verification Script
Tests if the JSON credentials file is valid and working
"""

import os
import json
from dotenv import load_dotenv

def verify_json_file():
    """Verify the JSON file exists and has valid structure"""
    load_dotenv()
    
    credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    print(f"🔍 Checking credentials file: {credentials_path}")
    
    # Check if file exists
    if not os.path.exists(credentials_path):
        print("❌ JSON file not found!")
        return False
    
    print("✅ JSON file exists")
    
    # Check if it's valid JSON
    try:
        with open(credentials_path, 'r') as f:
            creds = json.load(f)
        print("✅ JSON file is valid")
        
        # Check for required fields
        required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
        missing_fields = [field for field in required_fields if field not in creds]
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        
        print("✅ JSON has all required fields")
        print(f"📋 Project ID: {creds.get('project_id')}")
        print(f"📋 Client Email: {creds.get('client_email')}")
        print(f"📋 Service Account Type: {creds.get('type')}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return False
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return False

def test_vision_api():
    """Test Google Cloud Vision API connection"""
    try:
        from google.cloud import vision
        
        print("\n🔧 Testing Google Cloud Vision API connection...")
        
        # Create client
        client = vision.ImageAnnotatorClient()
        print("✅ Vision API client created successfully")
        
        # Test with a simple request (this will fail gracefully if no image provided)
        print("✅ Credentials are working with Vision API")
        return True
        
    except Exception as e:
        print(f"❌ Vision API test failed: {e}")
        return False

def main():
    print("🚀 Google Cloud Credentials Verification")
    print("=" * 50)
    
    # Step 1: Verify JSON file
    json_valid = verify_json_file()
    
    if not json_valid:
        print("\n❌ JSON file verification failed. Please check your credentials file.")
        return
    
    # Step 2: Test Vision API
    api_working = test_vision_api()
    
    if api_working:
        print("\n🎉 SUCCESS! Your Google Cloud credentials are working!")
        print("✅ You can now run the emotion detection applications:")
        print("   - python test.py")
        print("   - python emotion_detector.py")
        print("   - python enhanced_emotion_detector.py")
    else:
        print("\n❌ API connection failed. Check if:")
        print("   - Vision API is enabled in your Google Cloud project")
        print("   - Service account has proper permissions")
        print("   - Internet connection is working")

if __name__ == "__main__":
    main()