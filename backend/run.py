#!/usr/bin/env python3
"""
StudyBuddy Backend Server
Run this to start the FastAPI backend server
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print("🚀 Starting StudyBuddy Backend Server...")
    print(f"📍 Server will run at: http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("📚 API Documentation available at: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
