from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    credits: int
    access_token: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    subject: Optional[str] = None  # math, science, english, etc.

class ChatResponse(BaseModel):
    message: str
    credits_remaining: int

class CreditResponse(BaseModel):
    credits: int

class ChatMessageResponse(BaseModel):
    id: int
    user_message: str
    ai_response: str
    subject: Optional[str]
    has_image: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
