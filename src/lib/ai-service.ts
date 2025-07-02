// AI Service for generating homework responses
// This can be integrated with OpenAI or run as enhanced simulations

export async function generateAIResponse(
  question: string,
  subject?: string,
  hasImage: boolean = false,
): Promise<string> {
  // For production, this would call OpenAI API
  // For demo, we'll use enhanced simulated responses

  try {
    // If OpenAI API key is available, use real AI
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      return await callOpenAI(question, subject, hasImage);
    }

    // Otherwise use enhanced simulation
    return generateEnhancedSimulation(question, subject, hasImage);
  } catch (error) {
    console.error("AI service error:", error);
    return generateFallbackResponse(question, subject);
  }
}

async function callOpenAI(
  question: string,
  subject?: string,
  hasImage: boolean = false,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const systemPrompts = {
    math: `You are StudyBuddy, a friendly AI math tutor for South African students. Your responses should be:
- Kid-friendly and encouraging with appropriate emojis
- Step-by-step explanations that are easy to follow
- Include real-world South African examples (Rands, local context)
- Provide tips for parents to help their children understand
- Focus on teaching concepts, not just giving answers
- Use metric measurements and South African English`,

    science: `You are StudyBuddy, a friendly AI science tutor for South African students. Your responses should be:
- Exciting and curiosity-sparking with appropriate emojis
- Explain scientific concepts in simple, age-appropriate terms
- Use South African examples (local animals, plants, geography)
- Include fun facts and real-world applications
- Encourage scientific thinking and questioning
- Give parents tips on exploring science together`,

    english: `You are StudyBuddy, a friendly AI English tutor for South African students. Your responses should be:
- Encouraging and supportive with appropriate emojis
- Help with grammar, writing, and reading comprehension
- Use South African English examples and context
- Provide writing tips and practice suggestions
- Be patient and positive about mistakes
- Include tips for parents to support language development`,

    default: `You are StudyBuddy, a friendly AI homework assistant for South African students. Your responses should be:
- Kid-friendly and encouraging with appropriate emojis
- Educational but fun and engaging
- Step-by-step explanations appropriate for the student's level
- Include tips for parents to help their children
- Use South African context and examples
- Focus on learning and understanding, not just answers`,
  };

  const systemPrompt =
    systemPrompts[subject as keyof typeof systemPrompts] ||
    systemPrompts.default;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: hasImage
            ? `I've uploaded an image with this question: ${question}. Please help me understand this homework problem.`
            : question,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return (
    data.choices[0]?.message?.content ||
    generateFallbackResponse(question, subject)
  );
}

function generateEnhancedSimulation(
  question: string,
  subject?: string,
  hasImage: boolean = false,
): Promise<string> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(
      () => {
        const response = createDetailedResponse(question, subject, hasImage);
        resolve(response);
      },
      1500 + Math.random() * 1000,
    ); // 1.5-2.5 second delay
  });
}

function createDetailedResponse(
  question: string,
  subject?: string,
  hasImage: boolean = false,
): string {
  if (hasImage) {
    return generateImageResponse(question, subject);
  }

  switch (subject) {
    case "math":
      return generateMathResponse(question);
    case "science":
      return generateScienceResponse(question);
    case "english":
      return generateEnglishResponse(question);
    case "history":
      return generateHistoryResponse(question);
    case "geography":
      return generateGeographyResponse(question);
    default:
      return generateGeneralResponse(question);
  }
}

function generateImageResponse(question: string, subject?: string): string {
  const subjectContext = subject ? ` ${subject}` : "";

  return `🔍 I can see your homework photo! Let me help you solve this${subjectContext} problem step by step:

📝 **Problem Analysis:**
From your image, I can identify the key elements of this question. Let me break it down for you!

🎯 **Step-by-Step Solution:**

1️⃣ **Identify the Information**
   - Let's look at what we know from the problem
   - Circle or highlight the important numbers and keywords
   - Understand what the question is asking for

2️⃣ **Plan Our Approach**
   - Choose the right method or formula
   - Think about which steps we need to take
   - Consider any special rules or concepts that apply

3️⃣ **Work Through the Solution**
   - Follow our plan step by step
   - Show all our working clearly
   - Check each step makes sense

4️⃣ **Verify Our Answer**
   - Does our final answer seem reasonable?
   - Can we check it using a different method?
   - Make sure we've answered what was asked

💡 **South African Context:** Let me use examples you'll recognize - like calculating change from R20 at a spaza shop, or working out the distance between Cape Town and Johannesburg!

👨‍👩‍👧‍👦 **Parent Tip:** Encourage your child to explain each step back to you. This helps them truly understand the concept and builds their confidence!

🌟 **Remember:** Making mistakes is part of learning! Every expert started as a beginner. You're doing great by asking for help!

Want me to explain any specific part in more detail? I'm here to help you succeed! 💪✨`;
}

function generateMathResponse(question: string): string {
  return `🔢 Excellent math question! Let's solve this together step by step.

🎯 **Understanding the Problem:**
Let me help you break down this mathematical challenge!

📊 **Step-by-Step Solution:**

1️⃣ **Read and Understand**
   - Read the problem twice to fully understand what it's asking
   - Identify the known information and what we need to find

2️⃣ **Identify the Operation**
   - Do we need to add ➕, subtract ➖, multiply ✖️, or divide ➗?
   - Are we working with fractions, decimals, or whole numbers?

3️⃣ **Set Up the Problem**
   - Write down the equation or method we'll use
   - Organize our information clearly

4️⃣ **Solve Step by Step**
   - Work through the calculation carefully
   - Show each step of our working

5️⃣ **Check Our Answer**
   - Does our answer make sense in the real world?
   - Can we verify it using estimation or a different method?

💰 **South African Example:** If you have R50 and buy 3 items costing R12 each, how much change do you get?
- Cost: 3 × R12 = R36
- Change: R50 - R36 = R14

👨‍👩‍👧‍👦 **Parent Tip:** Help your child draw pictures or use real objects (like coins) to visualize the problem. This makes abstract math concepts much more concrete!

🌟 **Remember:** Every mathematician started with basic problems like this. You're building the foundation for more advanced math skills!

Need help with any specific step? I'm here to guide you through it! 🚀📐`;
}

function generateScienceResponse(question: string): string {
  return `🔬 Fantastic science question! Let's explore this together and discover how our amazing world works!

🌟 **Scientific Investigation:**

🔍 **Observation**
   - What do we already know about this topic?
   - What can we observe or measure?

🤔 **Question & Hypothesis**
   - What exactly are we trying to understand?
   - What do we think might happen and why?

🧪 **Investigation Method**
   - How can we find the answer?
   - What tools or methods should we use?

💡 **Explanation**
   - Let's understand the science behind what's happening
   - How does this connect to everyday life?

🇿🇦 **South African Connection:** 
Let me use examples from our beautiful country - like how the baobab trees in Limpopo use photosynthesis, or why Table Mountain creates its famous "tablecloth" of clouds!

🌱 **Fun Science Fact:** Did you know that science is everywhere around us? From the braai cooking your boerewors (chemical reactions) to the sunrise over the Drakensberg mountains (Earth's rotation)!

👨‍👩‍👧‍👦 **Parent Tip:** Encourage your child to ask "Why?" and "How?" questions. These are the most important tools in a scientist's toolkit! Try simple experiments at home using everyday items.

🎯 **Real-World Application:** Understanding science helps us solve problems, make informed decisions, and appreciate the incredible world we live in!

What specific part of this science topic interests you most? Let's dive deeper into the fascinating world of discovery! 🌍🔬✨`;
}

function generateEnglishResponse(question: string): string {
  return `📚 Wonderful English question! Language is like a superpower that helps us share our thoughts and stories with the world!

✍️ **Language Learning Journey:**

📖 **Understanding the Task**
   - Let's break down what we're working on
   - Is this about reading, writing, grammar, or vocabulary?

💭 **Planning Our Response**
   - What's the main idea we want to express?
   - How can we organize our thoughts clearly?

✏️ **Crafting Our Answer**
   - Choose the right words to express our ideas
   - Use proper grammar and sentence structure
   - Make sure our writing flows smoothly

🔍 **Review and Improve**
   - Read our work aloud to check how it sounds
   - Look for any spelling or grammar errors
   - Make sure we've answered the question completely

��� **Writing Tips for Success:**
- Start with your main idea (topic sentence)
- Use descriptive words to paint pictures with language
- Vary your sentence lengths to keep it interesting
- Don't worry about being perfect - just start writing!

🇿🇦 **South African English:** Remember that South African English is unique and beautiful! Whether you say "braai" or "barbecue," "robot" or "traffic light," your way of speaking is valid and important.

👨‍👩‍👧‍👦 **Parent Tip:** Reading together every day is the best way to improve language skills. Take turns reading aloud, use different voices for characters, and discuss what you've read!

📝 **Remember:** Every great writer started with a single word. You're building your storytelling superpowers with every sentence you write!

What aspect of English would you like to explore further? Let's create something amazing together! 🎨📖✨`;
}

function generateHistoryResponse(question: string): string {
  return `🏛️ Fascinating history question! Let's travel back in time and explore the amazing stories of our past!

⏰ **Historical Investigation:**

🕰️ **Setting the Scene**
   - When and where did this event take place?
   - What was happening in the world at this time?

👥 **The People Involved**
   - Who were the key figures in this story?
   - What were their motivations and challenges?

🎭 **The Story Unfolds**
   - What happened and why was it significant?
   - How did events lead from one to another?

🌍 **Impact and Legacy**
   - How did this affect people at the time?
   - What lasting impact can we still see today?

🇿🇦 **South African Connection:** Our country has an incredibly rich history! From the ancient Khoi and San peoples, through the great kingdoms like Mapungubwe, to our journey to democracy - every story teaches us something valuable.

🏆 **Historical Thinking Skills:**
- Look at different perspectives and viewpoints
- Use evidence to support your conclusions
- Connect past events to present situations
- Ask critical questions about causes and effects

👨‍👩‍👧‍👦 **Parent Tip:** Visit local museums, heritage sites, or even just explore your family's own history. Stories from grandparents and community elders bring history to life!

📚 **Remember:** History isn't just about memorizing dates - it's about understanding how people lived, what they believed, and how their choices shaped our world today.

What aspect of this historical topic interests you most? Let's explore the fascinating human stories behind the events! 🗺️⚔️👑`;
}

function generateGeographyResponse(question: string): string {
  return `🌍 Amazing geography question! Let's explore our incredible planet and understand how it shapes the way we live!

🗺️ **Geographical Exploration:**

📍 **Location and Place**
   - Where exactly are we studying?
   - What are the key features of this place?

🌡️ **Physical Geography**
   - What's the climate and weather like?
   - What landforms, rivers, or natural features exist?

🏘️ **Human Geography**
   - How do people live and work in this area?
   - What settlements, cities, or economic activities are there?

🔄 **Interactions and Processes**
   - How do people interact with their environment?
   - What geographical processes are at work?

🇿🇦 **South African Geography:** Our country is geographically amazing! From the Drakensberg mountains to the Karoo desert, from Cape Town's Mediterranean climate to Durban's subtropical weather - we have incredible diversity in one country!

🌟 **Geographical Skills:**
- Reading and interpreting maps and satellite images
- Understanding scale and distance
- Recognizing patterns and connections
- Thinking about cause and effect in geography

👨‍👩‍👧‍👦 **Parent Tip:** Use Google Earth or maps to explore places together. Plan family trips using geographical skills, and notice geography in everyday life - like why certain shops are located where they are!

🏔️ **Fun Geography Fact:** South Africa is the only country in the world to voluntarily dismantle its nuclear weapons program, and we have three capital cities! Geography isn't just about physical features - it's about understanding how humans organize space.

What geographical concept would you like to explore further? Let's discover the amazing connections between people and places! 🛰️🏞️🌊`;
}

function generateGeneralResponse(question: string): string {
  return `🌟 Great question! I love helping curious minds explore new ideas and solve problems!

💡 **Problem-Solving Approach:**

🎯 **Understanding the Question**
   - Let's make sure we fully understand what you're asking
   - What subject area does this relate to?

🔍 **Breaking It Down**
   - Let's split this into smaller, manageable parts
   - What information do we have, and what do we need to find?

💪 **Working Through It**
   - Step by step, let's tackle each part
   - Use logical thinking and problem-solving skills

✨ **Bringing It Together**
   - Combine our findings for a complete answer
   - Make sure everything makes sense

🧠 **Learning Strategy:**
Every question is an opportunity to grow your knowledge and skills. The most important thing is not just getting the right answer, but understanding how to think through problems!

🇿🇦 **South African Excellence:** Just like our country's amazing diversity makes us stronger, your curiosity and willingness to learn make you smarter every day!

👨‍👩‍👧‍👦 **Parent Tip:** Learning happens best when we're patient and encouraging. Celebrate every step forward, and remember that asking questions is a sign of intelligence, not confusion!

🚀 **Growth Mindset:** Your brain literally grows stronger every time you learn something new. You're not just solving homework - you're building your superpowers!

What subject area is this question from? Once I know whether it's math, science, English, or something else, I can give you much more specific and helpful guidance!

Keep up the fantastic work - you're doing great! 🌟💝`;
}

function generateFallbackResponse(question: string, subject?: string): string {
  return `🤖 I want to help you with your question about: "${question}"

While I work on getting you a detailed response, here are some study strategies:

📚 **General Study Tips:**
1. Break big problems into smaller steps
2. Use reliable sources like textbooks and educational websites
3. Practice regularly - little and often works best
4. Don't be afraid to ask for help from teachers, parents, or friends
5. Stay positive - mistakes help you learn!

🇿🇦 **South African Study Resources:**
- Your school textbooks aligned with CAPS curriculum
- Public libraries in your area
- Online resources like Khan Academy
- Study groups with classmates

👨‍👩‍👧‍👦 **Parent Tip:** Create a quiet, comfortable study space and be patient as your child learns. Every question is a step toward understanding!

Please try asking your question again, and I'll give you a detailed, helpful response! 💪✨`;
}
