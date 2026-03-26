import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load the API key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

# 🟢 THE FIX: Using the exact model we found in your terminal!
model = genai.GenerativeModel('gemini-2.5-flash')

async def evaluate_interview_answer(role: str, difficulty: str, question: str, answer_transcript: str):
    # 🟢 UPGRADED PROMPT: Added Name, Transcript context, and new JSON fields
    prompt = f"""
    You are Nova, a strict but fair AI Senior Engineering Manager conducting a technical interview.
    The candidate is applying for a {role} role. The difficulty level is {difficulty}.
    
    Interview Transcript:
    Questions Asked: "{question}"
    Candidate's Answers: "{answer_transcript}"
    
    CRITICAL CONTEXT FOR NOVA:
    The candidate's answers were recorded using a live Speech-to-Text browser API. The text will contain grammatical errors, missing punctuation, and severe phonetic misunderstandings of technical jargon (e.g., "Virtual DOM" might be transcribed as "virtual dawn", "useEffect" as "use effect" or "you select"). 
    
    You MUST look past these transcription errors. Evaluate the underlying INTENT and technical knowledge of the candidate. Do not penalize their communication or technical score for obvious speech-to-text API failures. Evaluate them ruthlessly on the actual concepts they are trying to explain.
    
    Return your evaluation strictly using this JSON schema:
    {{
        "overall_score": <int>,
        "communication_score": <int>,
        "technical_score": <int>,
        "feedback": "<A tough but fair 2-sentence overall critique>",
        "improvement_insight": "<One specific actionable tip>",
        "strengths": ["<strength 1>", "<strength 2>"],
        "weaknesses": ["<weakness 1>", "<weakness 2>"],
        "hiring_decision": "<Strong Hire | Leaning Hire | Not a Fit>"
    }}
    """
    
    try:
        print("🟡 Sending transcript to Nova (Gemini 2.5 Flash)...")
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        print("🟢 Nova has generated the report!")
        
        evaluation = json.loads(response.text)
        return evaluation
        
    except Exception as e:
        print(f"🔴 AI Evaluation Error: {e}")
        return {
            "overall_score": 0, "communication_score": 0, "technical_score": 0,
            "feedback": "Nova encountered a system error.",
            "improvement_insight": "System error.",
            "strengths": ["N/A"], "weaknesses": ["N/A"], "hiring_decision": "Error"
        }