import os
import json
from google import genai
from google.genai import types
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
import bcrypt 

# --- INTERNAL IMPORTS ---
from database import db, users_collection
from models import UserRegister, UserLogin, UserDB, InterviewSessionDB
from auth import create_access_token, verify_token

# 🟢 SETUP NEW GEMINI AI SDK
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY environment variable is missing!")

# Initialize the new client
client = genai.Client(api_key=api_key)
MODEL_ID = 'gemini-2.5-flash'

# 🟢 NEW PYDANTIC MODELS FOR REACT PAYLOADS
class InterviewConfig(BaseModel):
    interviewType: str
    targetRole: str
    techStack: str

class AnswerPayload(BaseModel):
    question: str
    answer: str

# --- SETUP PASSWORD HASHING ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_bytes.decode('utf-8')


# --- INIT FASTAPI ---
app = FastAPI(title="IntervAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 🚀 CORE ROUTES
# ==========================================

@app.get("/")
def read_root():
    return {"message": "Welcome to the IntervAI API! 🚀"}

@app.get("/test-db")
async def ping_db():
    try:
        await db.command("ping")
        return {"status": "success", "message": "MongoDB is connected! 🍃"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}


# 🟢 1. START INTERVIEW (Generates the First Question)
@app.post("/start-interview")
async def start_interview(config: InterviewConfig, current_user: dict = Depends(verify_token)):
    print(f"🟡 Generating first question for role: {config.targetRole}")
    
    prompt = f"""
    You are a strict, highly experienced Senior Engineering Manager conducting a {config.interviewType} interview.
    The candidate is applying for the role of {config.targetRole}.
    Their tech stack focus is: {config.techStack}.
    
    Generate ONE realistic, challenging interview question based on this profile.
    Do not include any greetings, pleasantries, or extra text.
    Output ONLY the raw question string.
    """
    
    try:
        # 🟢 NEW SYNTAX for generating content
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        return {"status": "success", "question": response.text.strip()}
    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate question")


# 🟢 2. SUBMIT ANSWER (Strict JSON Evaluator)
@app.post("/submit-answer")
async def submit_answer(payload: AnswerPayload, current_user: dict = Depends(verify_token)):
    user_id = current_user.get("sub")
    college_name = current_user.get("college_name")
    
    print(f"🟡 Evaluating answer for user {user_id}...")
    
    prompt = f"""
    You are a strict Senior Engineering Manager evaluating an interview answer.
    
    Interview Question: "{payload.question}"
    Candidate's Answer: "{payload.answer}"
    
    Evaluate the candidate based ONLY on these criteria:
    1. Did they directly answer the specific question asked?
    2. Is their technical logic accurate and sound?
    3. Is their communication clear and concise?
    
    Provide a score from 0 to 100.
    Provide 2 sentences of direct, actionable feedback.
    Generate the NEXT interview question to ask them.
    
    You MUST return the output strictly as a JSON object with the following schema:
    {{
        "score": integer,
        "feedback": "string",
        "next_question": "string"
    }}
    """
    
    try:
        # 🟢 NEW SYNTAX: Force Gemini to return valid JSON
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        result = json.loads(response.text)
        
        # 🟢 SAVE TO MONGODB (Safe Save)
        try:
            new_interview = InterviewSessionDB(
                student_id=user_id,
                college_name=college_name,
                role_applied_for="Dynamic Active Session", 
                difficulty="Adaptive",
                overall_score=result.get("score", 0),
                technical_score=result.get("score", 0), # Fallback to overall score
                communication_score=result.get("score", 0), # Fallback to overall score
                feedback=result.get("feedback", "No feedback generated."),
                improvement_insight="Keep practicing to structure your answers better.",
                strengths=["Attempted the question"],
                weaknesses=["Needs more technical depth"],
                hiring_decision="Review Needed",
                transcript_qa=f"Q: {payload.question}\nA: {payload.answer}"
            )
            await db.interviews.insert_one(new_interview.dict())
            
            # Increment interview count
            await users_collection.update_one(
                {"_id": user_id},
                {"$inc": {"total_interviews": 1}}
            )
        except Exception as db_error:
            print(f"⚠️ DB Save Error (Non-Fatal): {db_error}")

        # Return the exact JSON format React expects
        return result
        
    except Exception as e:
        print(f"Evaluation Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate answer")


@app.get("/get-feedback") 
async def get_feedback(current_user: dict = Depends(verify_token)):
    user_id = current_user.get("sub")

    # 1. Fetch the last 5 interview submissions for this user from MongoDB
    cursor = db.interviews.find({"student_id": user_id}).sort("_id", -1).limit(5)
    recent_answers = await cursor.to_list(length=5)

    if not recent_answers:
        # If they haven't taken an interview yet, tell React to show an error
        return {"status": "error", "message": "No interviews found."}

    # 2. Reverse the list so question 1 shows first, and question 5 shows last
    recent_answers.reverse()

    qna_list = []
    total_score = 0

    # 3. Loop through the real database records and format them for React
    for idx, ans in enumerate(recent_answers):
        # We extract your actual Question and Answer from the transcript_qa string
        transcript = ans.get("transcript_qa", "")
        parts = transcript.split("\nA: ")
        question_text = parts[0].replace("Q: ", "") if len(parts) > 0 else "Unknown Question"
        answer_text = parts[1] if len(parts) > 1 else "Unknown Answer"

        score = ans.get("overall_score", 0)
        total_score += score

        qna_list.append({
            "id": idx + 1,
            "question": question_text,
            "userAnswer": answer_text,
            "aiFeedback": ans.get("feedback", "No feedback recorded."),
            "score": score
        })

    # 4. Calculate the overall average score for the big circle graph!
    avg_score = int(total_score / len(recent_answers)) if recent_answers else 0

    # 5. Return the exact JSON structure that your React FeedbackScreen expects
    return {
        "status": "success",
        "feedback": {
            "overallScore": avg_score,
            "summary": f"Nova AI has analyzed your recent mock interview. You answered {len(recent_answers)} questions. Review your individual feedback below to see where you can improve.",
            "metrics": [
                {"name": "Technical Accuracy", "score": avg_score, "color": "bg-emerald-500", "text": "text-emerald-600"},
                {"name": "Communication", "score": min(avg_score + 5, 100), "color": "bg-indigo-500", "text": "text-indigo-600"},
                {"name": "Problem Solving", "score": max(avg_score - 5, 0), "color": "bg-amber-500", "text": "text-amber-600"}
            ],
            "qna": qna_list
        }
    }


# ==========================================
# 🔐 AUTHENTICATION ROUTES
# ==========================================

@app.post("/register")
async def register_user(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    new_user = UserDB(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        college_name=user.college_name
    )

    await users_collection.insert_one(new_user.dict())
    
    return {
        "status": "success", 
        "message": "User created successfully!",
        "name": user.name,
        "role": user.role
    }

@app.post("/login")
async def login_user(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {
        "sub": str(db_user["_id"]), 
        "email": db_user["email"],
        "role": db_user["role"],
        "college_name": db_user.get("college_name")
    }
    access_token = create_access_token(data=token_data)

    return {
        "status": "success", 
        "message": f"Welcome back, {db_user['name']}!",
        "access_token": access_token,
        "name": db_user["name"],
        "role": db_user["role"]
    }