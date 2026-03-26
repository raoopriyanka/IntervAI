from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# ==========================================
# 📥 API REQUEST MODELS (What React sends in)
# ==========================================

# What we expect when a user registers
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    # 🟢 NEW: Added to support Individual Students vs. Placement Cells
    role: str = Field(default="student", description="Either 'student' or 'college_admin'")
    college_name: Optional[str] = None

# What we expect when a user logs in
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# What we expect when React sends an interview answer to the AI
class InterviewAnswer(BaseModel):
    role: str
    difficulty: str
    question: str
    answer_text: str


# ==========================================
# 💾 DATABASE MODELS (What FastAPI saves to MongoDB)
# ==========================================

# The actual document saved in the "users" collection
class UserDB(BaseModel):
    name: str
    email: EmailStr
    hashed_password: str # Never save plain text passwords!
    role: str
    college_name: Optional[str] = None
    
    # Dashboard Stats
    current_streak: int = 0
    total_interviews: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# The actual document saved in the "interviews" collection
class InterviewSessionDB(BaseModel):
    student_id: str
    college_name: Optional[str] = None
    
    # Interview Configuration
    role_applied_for: str
    difficulty: str
    
    # AI Evaluation Results
    overall_score: int
    technical_score: int
    communication_score: int
    feedback: str
    improvement_insight: str
    strengths: List[str]
    weaknesses: List[str]
    hiring_decision: str
    
    # The Raw Transcript for Placement Cell Reports
    transcript_qa: str
    created_at: datetime = Field(default_factory=datetime.utcnow)