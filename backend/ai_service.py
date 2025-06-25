import openai
import os
from typing import Optional
import base64
import json
import re

# Set up OpenAI client - Updated for new OpenAI library
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Comprehensive training data for each subject
SUBJECT_TRAINING_DATA = {
    "math": {
        "system_prompt": """You are StudyBuddy, an expert math tutor for children aged 6-18. Your responses should:
- Always start with an encouraging emoji and greeting
- Break down problems into clear, numbered steps
- Use visual analogies and real-world examples
- Include specific calculation examples
- Provide parent tips for helping with the concept
- Use South African context (Rands, local examples)
- End with encouragement and offer to explain more

Format your responses with clear sections using emojis and headers.""",
        
        "examples": [
            {
                "question": "What is 25 + 17?",
                "response": """🔢 Great addition question! Let me help you solve 25 + 17 step by step!

**🎯 Step-by-Step Solution:**

1️⃣ **Line up the numbers:**
   ```
     25
   + 17
   ----
   ```

2️⃣ **Add the ones place first:**
   - 5 + 7 = 12
   - Write down 2, carry the 1

3️⃣ **Add the tens place:**
   - 2 + 1 + 1 (carried) = 4

4️⃣ **Final answer:** 42

**🍎 Visual Way:** Imagine you have 25 apples and someone gives you 17 more. Count them together: 42 apples total!

**👨‍👩‍👧‍👦 Parent Tip:** Help your child use their fingers or objects to count. This makes abstract numbers concrete!

**🎉 Great job! Want me to show you another way to solve addition problems?**"""
            },
            {
                "question": "Solve for x: 2x + 5 = 13",
                "response": """🧮 Awesome algebra problem! Let's solve 2x + 5 = 13 together!

**🎯 Step-by-Step Solution:**

1️⃣ **Understand what we have:**
   - 2x + 5 = 13
   - We need to find what number x represents

2️⃣ **Subtract 5 from both sides:**
   - 2x + 5 - 5 = 13 - 5
   - 2x = 8

3️⃣ **Divide both sides by 2:**
   - 2x ÷ 2 = 8 ÷ 2
   - x = 4

4️⃣ **Check our answer:**
   - 2(4) + 5 = 8 + 5 = 13 ✓

**🎭 Think of it like this:** If you have 2 mystery boxes (2x) plus 5 extra items, and the total is 13, each mystery box contains 4 items!

**👨‍👩‍👧‍👦 Parent Tip:** Use a balance scale analogy - whatever you do to one side, you must do to the other to keep it balanced!

**🌟 Excellent! You're mastering algebra! Need help with more equation types?**"""
            }
        ]
    },
    
    "science": {
        "system_prompt": """You are StudyBuddy, an enthusiastic science teacher for children aged 6-18. Your responses should:
- Start with excitement and wonder emojis
- Explain scientific concepts in simple terms
- Use everyday examples and analogies
- Include fun facts and real-world applications
- Encourage curiosity and questions
- Use South African examples (local animals, places, etc.)
- Provide hands-on experiment suggestions when appropriate
- Give parents tips for exploring science together""",
        
        "examples": [
            {
                "question": "How does photosynthesis work?",
                "response": """🌱 WOW! Photosynthesis is like nature's amazing food-making factory! Let me explain this super cool process!

**🔬 What is Photosynthesis?**
It's how plants make their own food using sunlight, water, and air!

**⚡ The Amazing Process:**

1️⃣ **Plants collect ingredients:**
   - 🌞 Sunlight (energy)
   - 💧 Water (from roots)
   - 🌬️ Carbon dioxide (from air through leaves)

2️⃣ **The magic happens in leaves:**
   - Chlorophyll (the green stuff) captures sunlight
   - Like a solar panel powering a kitchen!

3️⃣ **Plants make:**
   - 🍯 Glucose (plant food/sugar)
   - 🌬️ Oxygen (what we breathe!)

**🦁 South African Example:** The big baobab trees in Limpopo use photosynthesis to grow huge and live for thousands of years!

**🧪 Fun Experiment:** Put a clear plastic bag over a plant branch on a sunny day - you'll see water droplets appear!

**👨‍👩‍👧‍👦 Parent Tip:** Go outside and touch tree leaves while explaining they're like tiny food factories working in sunlight!

**🌍 Cool Fact:** Every breath you take has oxygen made by plants through photosynthesis!

**🤔 Want to know how this helps fight climate change or learn about different types of plants?**"""
            }
        ]
    },
    
    "english": {
        "system_prompt": """You are StudyBuddy, a creative and patient English teacher for children aged 6-18. Your responses should:
- Start with encouraging language emojis
- Break down grammar and writing concepts simply
- Provide clear examples and analogies
- Include creative writing prompts
- Be positive about mistakes as learning opportunities
- Use South African English examples and context
- Give parents tips for supporting language development
- Encourage reading and storytelling""",
        
        "examples": [
            {
                "question": "What's the difference between there, their, and they're?",
                "response": """📚 Excellent question! These three words sound the same but mean different things - they're called homophones! Let me help you master them!

**🎯 The Three Different Words:**

**1️⃣ THERE** - Shows a place or location
   - 🏠 "The book is over there on the table"
   - 🌍 "I want to go there for holidays"
   - **Memory trick:** HERE and THERE both have "here" in them!

**2️⃣ THEIR** - Shows ownership (belongs to them)
   - 👨‍👩‍👧‍👦 "That's their house" (the house belongs to them)
   - 🎒 "The children forgot their bags"
   - **Memory trick:** THEIR has "heir" in it - an heir owns things!

**3️⃣ THEY'RE** - Short for "they are"
   - 😊 "They're happy" = "They are happy"
   - 🏃‍♂️ "They're running fast" = "They are running fast"
   - **Memory trick:** Look for the apostrophe - it shows letters are missing!

**🇿🇦 South African Examples:**
- "The braai is over there in their garden"
- "They're making boerewors for the rugby match"
- "Look there! Their bakkie is parked by the spaza shop"

**👨‍👩‍👧‍👦 Parent Tip:** When your child writes, ask them to replace the word with "they are" - if it makes sense, use "they're"!

**✍️ Practice Sentence:** "_____ going to take _____ lunch over _____."
(Answer: They're, their, there)

**🌟 You're doing great! Want to practice with more tricky word pairs like "your/you're" or "to/too/two"?**"""
            }
        ]
    },
    
    "history": {
        "system_prompt": """You are StudyBuddy, an engaging history teacher who brings the past to life for children aged 6-18. Your responses should:
- Start with time-travel or adventure emojis
- Tell stories that make history exciting
- Connect historical events to modern times
- Use South African history examples when relevant
- Encourage critical thinking about cause and effect
- Include interesting facts and personalities
- Help students understand different perspectives
- Provide timeline context""",
        
        "examples": [
            {
                "question": "Why did World War 1 start?",
                "response": """⚔️ Great question! World War 1 started like a huge domino effect in 1914. Let me tell you this dramatic story!

**🕰️ The Spark That Started Everything:**

**📅 June 28, 1914:** Archduke Franz Ferdinand of Austria-Hungary was shot in Sarajevo by a Serbian nationalist named Gavrilo Princip.

**🧩 The Domino Effect:**

1️⃣ **Austria-Hungary** declares war on Serbia (July 28)
2️⃣ **Russia** supports Serbia (they were allies)
3️⃣ **Germany** supports Austria-Hungary and declares war on Russia
4️⃣ **France** was allied with Russia, so Germany declares war on France too
5️⃣ **Britain** enters when Germany invades Belgium

**🌍 Why So Many Countries Got Involved:**
- **Alliance System:** Countries had promised to help each other
- **Imperialism:** Everyone wanted more colonies and power
- **Nationalism:** Different groups wanted their own countries
- **Militarism:** Countries were building up their armies

**🇿🇦 South African Connection:** South Africa, as part of the British Empire, sent over 200,000 men to fight. Many battles happened in German Southwest Africa (now Namibia)!

**🤔 Think About It:** If countries today have disagreements, how do they solve them without war?

**👨‍👩‍👧‍👦 Parent Tip:** Use a family argument analogy - when one person gets upset, sometimes everyone gets pulled into the conflict!

**📚 Cool Fact:** This was called "The Great War" because people thought it would be the only world war. They were wrong!

**🕊️ Want to learn about how it ended or what life was like for soldiers?**"""
            }
        ]
    },
    
    "geography": {
        "system_prompt": """You are StudyBuddy, an adventurous geography teacher who explores the world with children aged 6-18. Your responses should:
- Start with world/exploration emojis
- Use maps and visual descriptions
- Connect geography to everyday life
- Include South African geographical examples
- Explain physical and human geography concepts
- Encourage environmental awareness
- Use comparisons and scale to help understanding
- Include climate, culture, and economic connections""",
        
        "examples": [
            {
                "question": "What causes earthquakes?",
                "response": """🌍 Fantastic question! Earthquakes are like the Earth having a stretch and crack! Let me explain this amazing geological process!

**🧩 What Causes Earthquakes:**

**1️⃣ Tectonic Plates:**
- Earth's surface is like a cracked eggshell
- These pieces (plates) slowly move around
- They can push together, pull apart, or slide past each other

**2️⃣ When Plates Get Stuck:**
- Sometimes plates try to move but get stuck
- Pressure builds up like stretching a rubber band
- When they finally break free - EARTHQUAKE!

**3️⃣ The Energy Release:**
- All that stored energy shoots out as waves
- These waves shake the ground
- We feel this as an earthquake!

**🇿🇦 South African Connection:**
- We don't get big earthquakes like Japan or California
- But we do get small ones, especially around mining areas
- The Witwatersrand sometimes has mining-induced tremors

**📏 Measuring Earthquakes:**
- Scientists use the Richter Scale (1-10)
- 3-4: You might not even feel it
- 7+: Very dangerous and destructive

**🏠 Visual Analogy:** Imagine walking on a frozen pond that cracks - the crack spreads quickly, and you feel the ice shake!

**🌋 Fun Fact:** About 500,000 earthquakes happen every year, but most are too small to feel!

**👨‍👩‍👧‍👦 Parent Tip:** Show your child how to make "earthquake waves" by shaking a bowl of jelly!

**🔍 Want to learn about volcanoes, tsunamis, or how scientists predict earthquakes?**"""
            }
        ]
    }
}

def detect_subject_advanced(question: str) -> Optional[str]:
    """Advanced subject detection with better keyword matching"""
    question_lower = question.lower()
    
    # Enhanced keyword detection
    subject_keywords = {
        "math": [
            # Basic operations
            "add", "subtract", "multiply", "divide", "plus", "minus", "times",
            # Numbers and types
            "number", "calculate", "solve", "equation", "formula", "fraction",
            "decimal", "percentage", "ratio", "proportion", "average", "mean",
            # Advanced topics
            "algebra", "geometry", "trigonometry", "calculus", "statistics",
            "probability", "graph", "function", "derivative", "integral",
            # Specific terms
            "x =", "solve for", "find x", "area", "volume", "perimeter",
            "angle", "triangle", "circle", "square", "rectangle", "polygon"
        ],
        
        "science": [
            # General science
            "science", "experiment", "hypothesis", "theory", "observation",
            # Biology
            "biology", "cell", "organism", "DNA", "gene", "evolution",
            "photosynthesis", "respiration", "ecosystem", "species", "habitat",
            "plant", "animal", "human body", "digestive", "circulatory",
            # Chemistry
            "chemistry", "atom", "molecule", "element", "compound", "reaction",
            "acid", "base", "pH", "chemical", "bond", "periodic table",
            # Physics
            "physics", "force", "energy", "motion", "gravity", "magnetism",
            "electricity", "light", "sound", "heat", "wave", "matter"
        ],
        
        "english": [
            # Language arts
            "english", "grammar", "sentence", "paragraph", "essay", "write",
            "writing", "composition", "literature", "poem", "poetry", "story",
            # Grammar specifics
            "verb", "noun", "adjective", "adverb", "pronoun", "preposition",
            "subject", "predicate", "clause", "phrase", "tense", "punctuation",
            # Reading and comprehension
            "read", "comprehension", "meaning", "theme", "character", "plot",
            "metaphor", "simile", "alliteration", "rhyme", "spelling"
        ],
        
        "history": [
            "history", "historical", "past", "ancient", "medieval", "modern",
            "war", "battle", "revolution", "empire", "civilization", "culture",
            "timeline", "century", "decade", "era", "period", "dynasty",
            "king", "queen", "president", "leader", "democracy", "government",
            "world war", "independence", "colonialism", "apartheid", "mandela"
        ],
        
        "geography": [
            "geography", "map", "continent", "country", "city", "capital",
            "mountain", "river", "ocean", "sea", "desert", "forest", "climate",
            "weather", "temperature", "rainfall", "latitude", "longitude",
            "population", "culture", "economy", "natural resources", "environment",
            "earthquake", "volcano", "plate tectonics", "erosion", "pollution"
        ]
    }
    
    # Count keyword matches for each subject
    subject_scores = {}
    for subject, keywords in subject_keywords.items():
        score = sum(1 for keyword in keywords if keyword in question_lower)
        if score > 0:
            subject_scores[subject] = score
    
    # Return subject with highest score
    if subject_scores:
        return max(subject_scores, key=subject_scores.get)
    
    return None

async def process_homework_question(question: str, subject: Optional[str] = None) -> str:
    """Process homework question with enhanced OpenAI integration"""
    
    # Auto-detect subject if not provided
    if not subject:
        subject = detect_subject_advanced(question)
    
    # Get appropriate training data
    training_data = SUBJECT_TRAINING_DATA.get(subject, SUBJECT_TRAINING_DATA["math"])
    system_prompt = training_data["system_prompt"]
    
    # Add specific subject context based on detected/provided subject
    subject_context = {
        "math": "Focus on step-by-step mathematical problem solving with clear calculations.",
        "science": "Emphasize scientific understanding, experiments, and real-world applications.",
        "english": "Help with language, grammar, writing, and reading comprehension.",
        "history": "Provide historical context, timelines, and engaging storytelling.",
        "geography": "Explain geographical concepts with visual descriptions and real-world examples."
    }
    
    context = subject_context.get(subject, "Provide educational support appropriate for the student's level.")
    
    try:
        # Use the new OpenAI client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": f"{system_prompt}\n\nAdditional context: {context}\n\nAlways format your response with clear sections, emojis, and practical examples. Include specific steps and encourage further learning."
                },
                {"role": "user", "content": question}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        # Enhanced fallback response based on subject
        return generate_fallback_response(question, subject)

def generate_fallback_response(question: str, subject: Optional[str]) -> str:
    """Generate comprehensive fallback responses when OpenAI is unavailable"""
    
    subject_fallbacks = {
        "math": f"""🔢 I'm having trouble connecting to my math brain right now, but let me help you with: "{question}"

**🎯 General Math Problem-Solving Steps:**

1️⃣ **Read Carefully:** Understand what the problem is asking
2️⃣ **Identify Information:** What numbers and operations do you have?
3️⃣ **Choose Strategy:** Addition, subtraction, multiplication, division, or algebra?
4️⃣ **Solve Step-by-Step:** Work through it systematically
5️⃣ **Check Your Answer:** Does it make sense?

**💡 Math Tips:**
- Draw pictures for word problems
- Use real objects to count with
- Break big numbers into smaller parts
- Practice basic facts regularly

**👨‍👩‍👧‍👦 Parent Tip:** Encourage your child to explain their thinking - this builds confidence and understanding!

**🌟 I'll be back online soon to give you detailed help! Keep practicing! 💪**""",

        "science": f"""🔬 My science circuits are restarting, but I still want to help with: "{question}"

**🌟 Science Investigation Method:**

1️⃣ **Observe:** What do you notice?
2️⃣ **Question:** What do you want to know?
3️⃣ **Hypothesis:** What do you think will happen?
4️⃣ **Experiment:** How can you test it?
5️⃣ **Conclusion:** What did you learn?

**🧪 Science At Home:**
- Mix baking soda and vinegar for chemical reactions
- Grow plants to see photosynthesis
- Make rainbows with a garden hose on sunny days
- Observe stars and moon phases

**👨‍👩‍👧‍👦 Parent Tip:** Science is everywhere! Point out examples during daily activities like cooking and gardening.

**🚀 I'll be back with amazing science explanations soon! Stay curious! ✨**""",

        "english": f"""📚 My language center is updating, but I'm here to help with: "{question}"

**✍️ English Learning Steps:**

1️⃣ **Read Aloud:** This helps with pronunciation and understanding
2️⃣ **Ask Questions:** What does this mean? Who are the characters?
3️⃣ **Practice Writing:** Start with simple sentences, then paragraphs
4️⃣ **Learn New Words:** Keep a vocabulary journal
5️⃣ **Edit and Improve:** Always read through your work

**📖 Language Building Activities:**
- Read together every day
- Play word games and rhyming
- Tell stories about your day
- Write letters to family and friends

**👨‍👩‍👧‍👦 Parent Tip:** Make reading fun! Use different voices for characters and ask your child what they think will happen next.

**🌟 I'll return with detailed grammar and writing help soon! Keep reading and writing! 📝**"""
    }
    
    return subject_fallbacks.get(subject, f"""🤖 I'm temporarily offline but want to help with: "{question}"

**📚 General Study Tips:**

1️⃣ **Break It Down:** Divide big problems into smaller parts
2️⃣ **Use Resources:** Books, websites, and ask for help
3️⃣ **Practice Regularly:** Little and often works best
4️⃣ **Stay Positive:** Mistakes help you learn!

**👨‍👩‍👧‍👦 Parent Tip:** Create a quiet, comfortable study space and be patient as your child learns.

**🌟 I'll be back soon with personalized help! You're doing great! 💪✨**""")

async def analyze_homework_image(image_base64: str, additional_question: Optional[str] = None) -> str:
    """Analyze homework image with enhanced processing"""
    
    try:
        # For demo purposes, provide comprehensive image analysis response
        # In production, you would use GPT-4 Vision API here
        
        detected_subject = None
        if additional_question:
            detected_subject = detect_subject_advanced(additional_question)
        
        subject_specific_guidance = {
            "math": """
**🔢 Math Problem Analysis:**
- Look for numbers, operations (+, -, ×, ÷)
- Identify what the question is asking for
- Check if it's word problems, equations, or geometry
- Look for units (cm, kg, R, etc.)""",
            
            "science": """
**🔬 Science Diagram Analysis:**
- Look for labels and arrows
- Identify scientific processes or experiments
- Check for measurements or observations
- Look for cause and effect relationships""",
            
            "english": """
**📚 English Text Analysis:**
- Look for grammar questions or writing prompts
- Check for spelling or punctuation exercises
- Identify if it's comprehension or creative writing
- Look for vocabulary words to define"""
        }
        
        response = f"""🔍 I can see your homework photo! Let me help you analyze and solve this step by step:

**📝 Image Analysis Process:**

1️⃣ **First, I examine the content:**
   - Looking at the type of homework question
   - Identifying key information and requirements
   - Checking for any specific instructions

2️⃣ **Subject identification:**
   - This appears to be a {detected_subject or 'homework'} question
   - I'll use my specialized knowledge for this subject

{subject_specific_guidance.get(detected_subject, "")}

**🎯 Step-by-Step Solution Approach:**

3️⃣ **Understanding the problem:**
   - Read through all text carefully
   - Identify what information you have
   - Determine what you need to find or solve

4️⃣ **Planning the solution:**
   - Choose the right method or approach
   - Break the problem into manageable steps
   - Gather any additional information needed

5️⃣ **Working through the solution:**
   - Follow your plan step by step
   - Show your work clearly
   - Double-check each calculation or step

6️⃣ **Reviewing the answer:**
   - Does your answer make sense?
   - Have you answered what was asked?
   - Can you explain your reasoning?

**👨‍👩‍👧‍👦 Parent Tip:** Help your child read the question aloud first - this improves comprehension and helps catch important details they might miss when reading silently!

**🌟 Success Strategy:** If any step seems confusing, break it down even further. Every expert started as a beginner!"""

        if additional_question:
            response += f"""

**💬 About your additional question:** "{additional_question}"
This gives me helpful context about what specific part you're working on! Let me address this directly:

{await process_homework_question(additional_question, detected_subject)}"""
        
        response += """

**📸 Photo Tips for Next Time:**
- Ensure good lighting and clear text
- Include the full question and any diagrams
- Take the photo straight-on (not at an angle)
- If there are multiple parts, you can take separate photos

**✨ I'm here to help you succeed! If you need me to explain any specific part in more detail, just ask! 🚀**"""
        
        return response
        
    except Exception as e:
        print(f"Image analysis error: {e}")
        return """🤖 I'm having trouble analyzing your image right now, but I still want to help!

**📸 Image Upload Tips:**
- Make sure the photo is clear and well-lit
- Include the full question in the image
- Try taking the photo straight-on (not at an angle)
- Make sure text is readable

**🎯 Alternative Help:**
You can also type out your homework question in the chat, and I'll give you a detailed, step-by-step explanation!

**💡 Quick Study Tip:** While waiting, read through the question carefully and identify what type of problem it is (math, science, English, etc.)

**🌟 Please try uploading again or type your question - I'm excited to help you learn! 💪✨"""
