# StudyBuddy Backend

A FastAPI-based backend for the StudyBuddy homework helper application.

## Features

- 🤖 **AI Integration**: OpenAI GPT-3.5/4 for homework assistance
- 🔐 **Authentication**: JWT-based user authentication
- 💳 **Credit System**: Pay-per-use and subscription management
- 📸 **Image Processing**: Homework photo analysis
- 📊 **Database**: SQLAlchemy ORM with SQLite/PostgreSQL
- 🚀 **FastAPI**: Modern, fast web framework with automatic API docs

## Quick Setup

1. **Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

2. **Set Up Environment Variables**

```bash
cp .env.example .env
# Edit .env with your OpenAI API key and other settings
```

3. **Run the Server**

```bash
python run.py
```

4. **Access API Documentation**

- Open http://localhost:8000/docs for Swagger UI
- Open http://localhost:8000/redoc for ReDoc

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/me` - Get current user info

### Chat & AI

- `POST /api/chat` - Send text message to AI
- `POST /api/chat/image` - Upload homework image for AI analysis
- `GET /api/chat/history` - Get user's chat history

### Credits

- `GET /api/credits` - Get current credit balance
- `POST /api/credits/purchase` - Purchase credits

## Database Models

### User

- Email, full name, hashed password
- Credit balance
- Registration timestamp

### ChatMessage

- User message and AI response
- Subject classification
- Image flag
- Timestamp

### Credit

- Credit transactions (purchases, usage)
- Transaction types and amounts
- Timestamp

## Environment Variables

| Variable         | Description                         | Required                 |
| ---------------- | ----------------------------------- | ------------------------ |
| `OPENAI_API_KEY` | OpenAI API key for AI functionality | Yes                      |
| `SECRET_KEY`     | JWT secret key                      | Yes                      |
| `DATABASE_URL`   | Database connection string          | No (defaults to SQLite)  |
| `HOST`           | Server host                         | No (defaults to 0.0.0.0) |
| `PORT`           | Server port                         | No (defaults to 8000)    |
| `DEBUG`          | Debug mode                          | No (defaults to True)    |

## AI Service

The AI service provides:

- Subject-specific tutoring (Math, Science, English)
- Kid-friendly explanations with emojis
- Parent tips and guidance
- South African context and examples
- Image analysis (homework photos)

## Development

### Adding New Features

1. **New API Endpoint**: Add to `main.py`
2. **Database Model**: Add to `models.py`
3. **Request/Response Schema**: Add to `schemas.py`
4. **Business Logic**: Add to appropriate service file

### Testing

```bash
# Run with auto-reload for development
python run.py

# Test API endpoints using the interactive docs at /docs
```

### Database Migration

```bash
# For production, use Alembic for database migrations
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Production Deployment

1. **Use PostgreSQL** instead of SQLite
2. **Set strong SECRET_KEY**
3. **Enable HTTPS** with proper SSL certificates
4. **Set up monitoring** and logging
5. **Configure rate limiting**
6. **Set up proper CORS** policies

## Security Notes

- JWT tokens expire in 30 minutes
- Passwords are hashed using bcrypt
- Rate limiting should be implemented for production
- Input validation via Pydantic schemas
- SQL injection protection via SQLAlchemy ORM
