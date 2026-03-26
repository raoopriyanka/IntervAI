import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load your API key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("🔴 ERROR: No API key found in .env!")
else:
    genai.configure(api_key=API_KEY)
    print("🔍 Scanning Google's servers for your available models...\n")
    
    try:
        # Ask Google for every model this key is allowed to use
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ Found working model: {m.name}")
    except Exception as e:
        print(f"🔴 Error connecting to Google: {e}")