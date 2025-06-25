import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Camera,
  Send,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Zap,
  User,
  Bot,
  GraduationCap,
  Heart,
  Star,
  Trophy,
  Target,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  image?: string;
}

const HomeworkHelper = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "🌟 Hi there! I'm StudyBuddy, your super smart AI homework helper! 🤖✨ I'm here to make learning fun and easy for you and your family! \n\n📸 You can take a photo of your homework question, or just type it out - I'm ready to help with math, science, English, and more! \n\n🎯 Let's turn homework time into an awesome adventure! What would you like to learn about today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real AI integration function
  const callOpenAI = async (userMessage: string, imageData?: string) => {
    try {
      // For demo purposes, we'll simulate the API call
      // In production, you'd call your backend which then calls OpenAI
      const systemPrompt = `You are StudyBuddy, a friendly AI homework assistant designed specifically for children and their parents. Your responses should be:

1. Kid-friendly and encouraging
2. Educational but fun
3. Step-by-step explanations
4. Use emojis to make it engaging
5. Explain concepts in simple terms parents can understand
6. Focus on helping children learn, not just providing answers
7. Be supportive and positive

If an image is provided, analyze the homework question in the image and provide a detailed explanation.

Always structure your response with:
- A friendly greeting acknowledging the question
- Step-by-step breakdown
- Tips for parents to help their child understand
- Encouragement for the student`;

      // This is where you'd make the actual API call to OpenAI
      // For now, we'll use a more sophisticated mock response
      return generateSmartResponse(userMessage, imageData);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return "🤖 Oops! I'm having a little trouble right now. Please try again in a moment! 💝";
    }
  };

  // Enhanced mock response generator for demo
  const generateSmartResponse = (userMessage: string, imageData?: string) => {
    const mathKeywords = [
      "math",
      "add",
      "subtract",
      "multiply",
      "divide",
      "fraction",
      "equation",
      "solve",
      "calculate",
    ];
    const scienceKeywords = [
      "science",
      "experiment",
      "biology",
      "chemistry",
      "physics",
      "plant",
      "animal",
    ];
    const englishKeywords = [
      "english",
      "grammar",
      "write",
      "essay",
      "sentence",
      "paragraph",
      "spelling",
    ];

    const isMath = mathKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword),
    );
    const isScience = scienceKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword),
    );
    const isEnglish = englishKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword),
    );

    if (imageData) {
      return `🔍 I can see your homework photo! Let me help you solve this step by step:

📝 **Problem Analysis:**
From your image, I can see this is a ${isMath ? "math" : isScience ? "science" : "homework"} question that needs some careful thinking!

🎯 **Step-by-Step Solution:**

1️⃣ **First Step**: Let's identify what we know
   - Look for the key information in the problem
   - Circle or underline the important numbers/words

2️⃣ **Second Step**: Plan our approach
   - What operation or concept do we need to use?
   - What's the question actually asking for?

3️⃣ **Third Step**: Solve it together!
   - Work through the problem step by step
   - Check our work to make sure it makes sense

👨‍👩‍👧‍👦 **Parent Tip**: Encourage your child to explain each step back to you - this helps them really understand the concept!

🌟 **Remember**: It's okay to make mistakes - that's how we learn and grow! You're doing great! 

Need me to explain any part in more detail? I'm here to help! 💪✨`;
    }

    if (isMath) {
      return `🔢 Great math question! Let's solve this together! 

🎯 **Understanding the Problem:**
Math can be like solving a fun puzzle! Let's break it down step by step.

📊 **Step-by-Step Solution:**

1️⃣ **Read Carefully**: First, let's read the problem twice to understand what it's asking
2️⃣ **Find the Numbers**: What numbers do we have to work with?
3️⃣ **Choose the Operation**: Do we need to add ➕, subtract ➖, multiply ✖️, or divide ➗?
4️⃣ **Solve**: Let's work through it together!
5️⃣ **Check**: Does our answer make sense?

👨‍👩‍👧‍👦 **Parent Tip**: Help your child draw pictures or use objects to visualize the problem - this makes math much easier to understand!

🌟 Remember: Every math expert started as a beginner. You're building your math superpowers! 💪

What specific part would you like me to explain more? I'm here to help make math fun! 🚀`;
    }

    if (isScience) {
      return `🔬 Awesome science question! Science is all about discovering how our amazing world works!

🌟 **Let's Explore Together:**

🔍 **Observation**: What do we notice or see in this problem?
🤔 **Question**: What are we trying to understand or find out?
🧪 **Investigation**: How can we find the answer?
💡 **Explanation**: Let's understand why this happens!

🌱 **Fun Fact**: Science is everywhere around us! From the plants in your garden to the stars in the sky!

👨‍👩‍👧‍👦 **Parent Tip**: Encourage your child to ask "Why?" and "How?" - these are the most important questions in science!

🎯 **Remember**: Scientists make discoveries by being curious and asking questions - just like you're doing right now!

What part of science would you like to explore deeper? Let's go on a learning adventure! 🚀🌟`;
    }

    if (isEnglish) {
      return `📚 Fantastic English question! Language is like magic - it helps us share our thoughts and stories!

✍️ **Let's Write and Learn Together:**

📖 **Reading**: Let's understand what we're working with
💭 **Thinking**: What's the main idea or message?
✏️ **Writing**: How can we express our thoughts clearly?
🔍 **Checking**: Let's make sure everything flows nicely!

🌈 **Writing Tips:**
- Start with your main idea
- Use descriptive words to paint a picture
- Read it out loud to see how it sounds
- Don't worry about perfect - just start writing!

👨‍👩‍👧‍👦 **Parent Tip**: Reading together every day helps build strong language skills. Make it fun with different voices for characters!

🌟 **Remember**: Every great writer started with a single word. You're building your storytelling superpowers! ✨

What part of English would you like to work on? Let's create something amazing together! 🎨📝`;
    }

    return `🌟 What a great question! I love helping curious minds like yours!

💡 **Let's Figure This Out Together:**

🎯 **Step 1**: Let's understand exactly what you're asking
🔍 **Step 2**: Break down the problem into smaller pieces  
💪 **Step 3**: Work through each piece together
✨ **Step 4**: Put it all together for the final answer!

👨‍👩‍👧‍👦 **Parent Tip**: Learning happens best when we're patient and encouraging. Celebrate every small step forward!

🚀 **Fun Learning Fact**: Your brain grows stronger every time you learn something new - you're literally becoming smarter right now!

What subject is this question about? I can give you more specific help once I know if it's math, science, English, or something else! 

Keep up the amazing work! 🌟💝`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage || "I uploaded an image with my homework question.",
      timestamp: new Date(),
      image: uploadedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setUploadedImage(null);
    setIsLoading(true);

    try {
      // Call the AI service
      const aiResponse = await callOpenAI(
        inputMessage,
        uploadedImage || undefined,
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCredits((prev) => Math.max(0, prev - 1));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "🤖 Oops! I'm having a little trouble right now. Please try again in a moment! 💝",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen kids-gradient-bg">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 border-kids-yellow/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-kids-yellow/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-kids-purple to-brand-500 p-2 rounded-xl animate-bounce-gentle">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-black gradient-text">
                  StudyBuddy
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="bg-kids-yellow text-kids-purple-dark border-kids-yellow font-bold px-3 py-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                {credits} credits left
              </Badge>
              <Button
                variant="outline"
                className="hidden sm:flex bright-button"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="rounded-2xl border-2 border-kids-yellow/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center font-black text-kids-purple">
                  <Sparkles className="w-5 h-5 mr-2 text-kids-yellow-bright" />
                  🎯 Learning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    📸 Take clear, bright photos
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    📝 Include the full question
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    🤔 Ask follow-up questions
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    👨‍👩‍👧‍👦 Learn together with family
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-kids-purple/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black text-kids-purple">
                  🎓 Subjects We Love
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-orange text-white font-bold"
                >
                  🔢 Math
                </Badge>
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-green text-white font-bold"
                >
                  🔬 Science
                </Badge>
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-blue text-white font-bold"
                >
                  📚 English
                </Badge>
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-pink text-white font-bold"
                >
                  🌍 Social Studies
                </Badge>
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-yellow text-kids-purple-dark font-bold"
                >
                  🗺️ Geography
                </Badge>
                <Badge
                  variant="secondary"
                  className="mr-2 mb-2 bg-kids-purple text-white font-bold"
                >
                  🏛️ History
                </Badge>
              </CardContent>
            </Card>

            {credits <= 2 && (
              <Card className="border-2 border-kids-orange bg-gradient-to-br from-kids-orange/10 to-kids-yellow/10 rounded-2xl shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-kids-orange font-black">
                    <AlertCircle className="w-5 w-5 mr-2" />⚡ Low Credits!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-kids-orange font-medium mb-3">
                    🎯 You're running low on learning power! Get our Family Fun
                    Pack for unlimited homework adventures!
                  </p>
                  <Button size="sm" className="w-full bright-button font-bold">
                    🚀 Upgrade Now!
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col rounded-2xl border-2 border-kids-purple/30 shadow-2xl">
              <CardHeader className="border-b border-kids-yellow/30 bg-gradient-to-r from-kids-purple/5 to-kids-yellow/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center font-black text-kids-purple">
                    <Bot className="w-6 h-6 mr-3 text-kids-purple animate-bounce-gentle" />
                    🤖 AI Homework Helper
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-kids-green text-white border-kids-green font-bold"
                  >
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    🌟 Online & Ready!
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-kids-blue to-kids-green"
                              : "bg-gradient-to-r from-kids-purple to-kids-pink animate-bounce-gentle"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-6 py-4 shadow-lg ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-kids-blue to-kids-green text-white"
                              : "bg-white text-gray-800 border-2 border-kids-yellow/30"
                          }`}
                        >
                          {message.image && (
                            <div className="mb-3">
                              <img
                                src={message.image}
                                alt="Uploaded homework"
                                className="max-w-xs rounded-xl shadow-lg border-2 border-kids-yellow/50"
                              />
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {message.content}
                          </p>
                          <div
                            className={`text-xs mt-3 opacity-70 font-medium ${
                              message.type === "user"
                                ? "text-kids-yellow-light"
                                : "text-gray-500"
                            }`}
                          >
                            ⏰ {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-kids-purple to-kids-pink flex items-center justify-center animate-bounce-gentle">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl px-6 py-4 border-2 border-kids-yellow/30 shadow-lg">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-kids-purple rounded-full animate-bounce"></div>
                            <div
                              className="w-3 h-3 bg-kids-yellow rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-3 h-3 bg-kids-pink rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            🤖 Thinking hard...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-kids-yellow/30 p-4 bg-gradient-to-r from-kids-yellow/5 to-kids-purple/5">
                {uploadedImage && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Upload preview"
                      className="max-w-xs rounded-xl border-2 border-kids-yellow shadow-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg bg-kids-orange hover:bg-red-500"
                      onClick={() => setUploadedImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}

                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="✨ Type your homework question here or upload a photo! I'm excited to help you learn! 🎯"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="min-h-[60px] resize-none border-2 border-kids-yellow/50 rounded-xl focus:border-kids-purple font-medium"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="border-2 border-kids-purple text-kids-purple hover:bg-kids-purple hover:text-white rounded-xl w-12 h-12"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        isLoading ||
                        (!inputMessage.trim() && !uploadedImage) ||
                        credits <= 0
                      }
                      className="bright-button rounded-xl w-12 h-12 font-bold shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {credits <= 0 && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-kids-orange/20 to-kids-yellow/20 border-2 border-kids-orange rounded-xl">
                    <p className="text-sm text-kids-orange font-bold">
                      🎯 Oops! You've used all your learning credits!{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-kids-orange underline font-bold"
                      >
                        Get more credits to continue the fun!
                      </Button>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkHelper;
