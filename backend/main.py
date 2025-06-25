from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, List
import os
from dotenv import load_dotenv
import base64
import io
from PIL import Image

from database import get_db, init_db
from models import User, ChatMessage, Credit
from schemas import UserCreate, UserResponse, ChatRequest, ChatResponse, CreditResponse
from auth import create_access_token, verify_token, get_password_hash, verify_password
from ai_service import process_homework_question, analyze_homework_image, detect_subject_advanced

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
        raise HTTPException(status_code=402, detail="No credits remaining. Please purchase more credits to continue learning!")
    
    try:
        # Auto-detect subject if not provided
        subject = request.subject
        if not subject:
            subject = detect_subject_advanced(request.message)
        
        # Process with AI
        ai_response = await process_homework_question(request.message, subject)
        
        # Save chat message to database
        chat_message = ChatMessage(
            user_id=user.id,
            user_message=request.message,
            ai_response=ai_response,
            subject=subject
        )
        db.add(chat_message)
        
        # Deduct credit and record transaction
        user.credits -= 1
        credit_transaction = Credit(
            user_id=user.id,
            amount=-1,
            transaction_type="usage",
            description=f"Chat question: {request.message[:50]}..."
        )
        db.add(credit_transaction)
        db.commit()
        
        return ChatResponse(
            message=ai_response,
            credits_remaining=user.credits
        )
    
    except Exception as e:
        print(f"Chat processing error: {e}")
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
        raise HTTPException(status_code=402, detail="No credits remaining. Please purchase more credits to continue learning!")
    
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
            user_message=message or "Image uploaded with homework question",
            ai_response=ai_response,
            has_image=True,
            subject=detect_subject_advanced(message) if message else None
        )
        db.add(chat_message)
        
        # Deduct credit and record transaction
        user.credits -= 1
        credit_transaction = Credit(
            user_id=user.id,
            amount=-1,
            transaction_type="usage",
            description="Image analysis question"
        )
        db.add(credit_transaction)
        db.commit()
        
        return ChatResponse(
            message=ai_response,
            credits_remaining=user.credits
        )
    
    except Exception as e:
        print(f"Image processing error: {e}")
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
    
    # Valid credit packages with South African pricing
    credit_packages = {
        5: 5,    # R 5 for 5 credits
        10: 10,  # R 10 for 10 credits  
        25: 20,  # R 20 for 25 credits (bonus!)
        50: 40,  # R 40 for 50 credits (better deal!)
        100: 75  # R 75 for 100 credits (best value!)
    }
    
    if amount not in credit_packages:
        raise HTTPException(status_code=400, detail="Invalid credit package. Choose from: 5, 10, 25, 50, or 100 credits")
    
    # Mock payment processing - in production, integrate with payment gateway
    try:
        # Add credits to user account
        user.credits += amount
        
        # Record credit purchase
        credit_record = Credit(
            user_id=user.id,
            amount=amount,
            transaction_type="purchase",
            description=f"Purchased {amount} credits for R{credit_packages[amount]}"
        )
        db.add(credit_record)
        db.commit()
        
        return {
            "success": True,
            "message": f"🎉 Successfully purchased {amount} credits for R{credit_packages[amount]}!", 
            "new_balance": user.credits,
            "amount_purchased": amount,
            "cost": credit_packages[amount]
        }
        
    except Exception as e:
        print(f"Credit purchase error: {e}")
        raise HTTPException(status_code=500, detail="Credit purchase failed. Please try again.")

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

@app.get("/api/credits/packages")
async def get_credit_packages():
    """Get available credit packages"""
    return {
        "packages": [
            {"credits": 5, "price": 5, "currency": "R", "description": "Starter Pack"},
            {"credits": 10, "price": 10, "currency": "R", "description": "Popular Choice"},
            {"credits": 25, "price": 20, "currency": "R", "description": "Great Value!", "bonus": True},
            {"credits": 50, "price": 40, "currency": "R", "description": "Family Pack", "bonus": True},
            {"credits": 100, "price": 75, "currency": "R", "description": "Best Deal!", "bonus": True}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
