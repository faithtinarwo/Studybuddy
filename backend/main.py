from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, List
import os
from dotenv import load_dotenv
import openai
from PIL import Image
import base64
import io

from database import get_db, init_db
from models import User, ChatMessage, Credit
from schemas import UserCreate, UserResponse, ChatRequest, ChatResponse, CreditResponse
from auth import create_access_token, verify_token, get_password_hash, verify_password
from ai_service import process_homework_question, analyze_homework_image

load_dotenv()

app = FastAPI(title="StudyBuddy API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "StudyBuddy API is running! 🚀"}

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        credits=5  # Give 5 free credits to new users
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name,
        credits=db_user.credits,
        access_token=access_token
    )

@app.post("/api/auth/login", response_model=UserResponse)
async def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        credits=user.credits,
        access_token=access_token
    )

@app.get("/api/user/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current user info"""
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        credits=user.credits
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Process chat message with AI"""
    # Verify user and check credits
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.credits <= 0:
        raise HTTPException(status_code=402, detail="No credits remaining")
    
    try:
        # Process with AI
        ai_response = await process_homework_question(request.message, request.subject)
        
        # Save chat message to database
        chat_message = ChatMessage(
            user_id=user.id,
            user_message=request.message,
            ai_response=ai_response,
            subject=request.subject
        )
        db.add(chat_message)
        
        # Deduct credit
        user.credits -= 1
        db.commit()
        
        return ChatResponse(
            message=ai_response,
            credits_remaining=user.credits
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@app.post("/api/chat/image", response_model=ChatResponse)
async def chat_with_image(
    file: UploadFile = File(...),
    message: Optional[str] = Form(""),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Process homework image with AI"""
    # Verify user and check credits
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.credits <= 0:
        raise HTTPException(status_code=402, detail="No credits remaining")
    
    try:
        # Process image
        image_data = await file.read()
        
        # Convert to base64 for AI processing
        image = Image.open(io.BytesIO(image_data))
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Process with AI
        ai_response = await analyze_homework_image(img_base64, message)
        
        # Save chat message to database
        chat_message = ChatMessage(
            user_id=user.id,
            user_message=message or "Image uploaded",
            ai_response=ai_response,
            has_image=True
        )
        db.add(chat_message)
        
        # Deduct credit
        user.credits -= 1
        db.commit()
        
        return ChatResponse(
            message=ai_response,
            credits_remaining=user.credits
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

@app.get("/api/chat/history")
async def get_chat_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get user's chat history"""
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == user.id).order_by(ChatMessage.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": msg.id,
            "user_message": msg.user_message,
            "ai_response": msg.ai_response,
            "subject": msg.subject,
            "has_image": msg.has_image,
            "created_at": msg.created_at
        }
        for msg in messages
    ]

@app.post("/api/credits/purchase")
async def purchase_credits(
    amount: int = Form(...),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Purchase credits (mock implementation)"""
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Mock payment processing - in production, integrate with payment gateway
    if amount in [10, 50, 100]:  # Valid credit packages
        user.credits += amount
        
        # Record credit purchase
        credit_record = Credit(
            user_id=user.id,
            amount=amount,
            transaction_type="purchase"
        )
        db.add(credit_record)
        db.commit()
        
        return {"message": f"Successfully purchased {amount} credits", "new_balance": user.credits}
    else:
        raise HTTPException(status_code=400, detail="Invalid credit amount")

@app.get("/api/credits", response_model=CreditResponse)
async def get_credits(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get user's current credit balance"""
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return CreditResponse(credits=user.credits)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
