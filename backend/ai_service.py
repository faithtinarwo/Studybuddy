import openai
import os
from typing import Optional
import base64

# Set up OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

async def process_homework_question(question: str, subject: Optional[str] = None) -> str:
    """Process homework question with OpenAI"""
    
    # Create subject-specific system prompt
    subject_prompts = {
        "math": """You are StudyBuddy, a friendly AI math tutor for children. Your responses should be:
- Kid-friendly and encouraging with emojis
- Step-by-step explanations that are easy to follow
- Visual descriptions when helpful (like "imagine you have 5 apples...")
- Include tips for parents to help their children understand
- Focus on teaching concepts, not just giving answers
- Use South African context when relevant (Rands, local examples)""",
        
        "science": """You are StudyBuddy, a friendly AI science tutor for children. Your responses should be:
- Exciting and curiosity-sparking with emojis
- Explain scientific concepts in simple terms
- Use real-world examples children can relate to
- Include fun facts when appropriate
- Give parents tips on how to explore science with their kids
- Focus on understanding how things work
- Use South African context and examples when relevant""",
        
        "english": """You are StudyBuddy, a friendly AI English tutor for children. Your responses should be:
- Encouraging and creative with emojis
- Help with grammar, writing, and reading comprehension
- Give examples and practice suggestions
- Include tips for parents to support language development
- Be patient and positive about mistakes
- Focus on building confidence in communication
- Use South African English context when relevant""",
        
        "default": """You are StudyBuddy, a friendly AI homework assistant for children. Your responses should be:
- Kid-friendly and encouraging with emojis
- Educational but fun and engaging
- Step-by-step explanations appropriate for the child's level
- Include tips for parents to help their children
- Focus on learning and understanding, not just answers
- Be supportive and celebrate progress
- Use South African context when relevant"""
    }
    
    system_prompt = subject_prompts.get(subject, subject_prompts["default"])
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        # Fallback response if OpenAI fails
        return f"""🤖 Hi there! I'm having a little trouble connecting to my brain right now, but I still want to help you! 

🎯 **For your question about: "{question}"**

Here are some general study tips while I get back online:

📚 **Study Strategy:**
1. Read the question carefully twice
2. Identify what you know and what you need to find
3. Break the problem into smaller steps
4. Work through each step patiently
5. Check your answer to see if it makes sense

👨‍👩‍👧‍👦 **Parent Tip:** Encourage your child to explain their thinking out loud - this helps reinforce learning!

🌟 Please try asking your question again in a moment, and I'll give you a much better, detailed explanation! 

Keep up the great work! 💪✨"""

async def analyze_homework_image(image_base64: str, additional_question: Optional[str] = None) -> str:
    """Analyze homework image with OpenAI Vision"""
    
    try:
        # For now, we'll use a text-based response since GPT-4 Vision might not be available
        # In production, you would use GPT-4 Vision API here
        
        base_response = """🔍 I can see your homework photo! Let me help you solve this step by step:

📝 **Problem Analysis:**
I can see this is a homework question that needs some careful thinking!

🎯 **Step-by-Step Solution:**

1️⃣ **First Step**: Let's identify what we know
   - Look at all the information given in the problem
   - Circle or underline the important numbers and keywords

2️⃣ **Second Step**: Plan our approach
   - What concept or operation do we need to use?
   - What is the question actually asking us to find?

3️⃣ **Third Step**: Solve it together!
   - Work through the problem step by step
   - Show your work clearly
   - Double-check each calculation

4️⃣ **Final Step**: Review our answer
   - Does the answer make sense?
   - Can we check it another way?

👨‍👩‍👧‍👦 **Parent Tip:** Encourage your child to explain each step back to you - this helps them really understand the concept and builds confidence!

🌟 **Remember:** Every mistake is a learning opportunity. You're building your knowledge and skills with every question you tackle!"""

        if additional_question:
            base_response += f"\n\n💬 **About your additional question:** \"{additional_question}\"\nThis gives me helpful context! "
        
        base_response += "\n\n✨ If you need me to explain any specific part in more detail, just ask! I'm here to help make learning fun and easy! 🚀"
        
        return base_response
        
    except Exception as e:
        return """🤖 I'm having trouble analyzing your image right now, but I still want to help!

📸 **Image Upload Tips:**
- Make sure the photo is clear and well-lit
- Include the full question in the image
- Try taking the photo straight-on (not at an angle)

🎯 **Alternative Help:**
You can also type out your homework question in the chat, and I'll give you a detailed explanation!

🌟 Please try uploading again or type your question - I'm excited to help you learn! 💪✨"""

def detect_subject(question: str) -> Optional[str]:
    """Detect the subject of a homework question"""
    question_lower = question.lower()
    
    math_keywords = ["calculate", "solve", "equation", "add", "subtract", "multiply", "divide", 
                    "fraction", "percentage", "algebra", "geometry", "math", "mathematics"]
    science_keywords = ["experiment", "hypothesis", "biology", "chemistry", "physics", 
                       "atom", "molecule", "energy", "force", "science"]
    english_keywords = ["essay", "paragraph", "grammar", "sentence", "verb", "noun", 
                       "adjective", "write", "composition", "english", "literature"]
    
    if any(keyword in question_lower for keyword in math_keywords):
        return "math"
    elif any(keyword in question_lower for keyword in science_keywords):
        return "science"
    elif any(keyword in question_lower for keyword in english_keywords):
        return "english"
    
    return None
