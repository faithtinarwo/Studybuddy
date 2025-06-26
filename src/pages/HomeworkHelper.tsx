import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ShoppingCart,
  Gift,
  ChevronDown,
  Flame,
  Award,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { apiClient, detectSubject } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Confetti } from "@/components/ui/confetti";
import {
  AchievementSystem,
  AchievementNotification,
  Achievement,
  UserStats,
} from "@/components/ui/achievement-system";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  image?: string;
  xpEarned?: number;
  subject?: string;
}

interface CreditPackage {
  credits: number;
  price: number;
  currency: string;
  description: string;
  bonus?: boolean;
}

const HomeworkHelper = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi there! I'm StudyBuddy, your AI homework helper. I'm here to make learning easier and more effective for you and your family.\n\nYou can take a photo of your homework question or type it directly - I'm ready to help with math, science, English, and more subjects.\n\nLet's make homework time productive! What would you like help with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Gamification states
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] =
    useState<Achievement | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestions: 0,
    currentStreak: 1,
    longestStreak: 1,
    subjectsExplored: 0,
    perfectDays: 0,
    level: 1,
    xp: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    loadCreditPackages();
    loadUserStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setCredits(userData.credits);
    } catch (error) {
      console.error("Failed to load user data:", error);
      // For demo purposes, create a mock user if no authentication
      setUser({
        id: 1,
        email: "demo@studybuddy.com",
        full_name: "Demo User",
        credits: 3,
      });
      setCredits(3);
    }
  };

  const loadCreditPackages = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/credits/packages",
      );
      const data = await response.json();
      setCreditPackages(data.packages);
    } catch (error) {
      console.error("Failed to load credit packages:", error);
      // Fallback credit packages
      setCreditPackages([
        { credits: 5, price: 5, currency: "R", description: "Starter Pack" },
        {
          credits: 10,
          price: 10,
          currency: "R",
          description: "Popular Choice",
        },
        {
          credits: 25,
          price: 20,
          currency: "R",
          description: "Great Value!",
          bonus: true,
        },
        {
          credits: 50,
          price: 40,
          currency: "R",
          description: "Family Pack",
          bonus: true,
        },
        {
          credits: 100,
          price: 75,
          currency: "R",
          description: "Best Deal!",
          bonus: true,
        },
      ]);
    }
  };

  const loadUserStats = () => {
    // Load from localStorage for demo
    const savedStats = localStorage.getItem("studybuddy_stats");
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  };

  const updateUserStats = (updates: Partial<UserStats>) => {
    const newStats = { ...userStats, ...updates };
    setUserStats(newStats);
    localStorage.setItem("studybuddy_stats", JSON.stringify(newStats));
  };

  const playSound = (type: "success" | "achievement" | "level_up") => {
    if (!soundEnabled) return;

    // Create different pitched beeps for different events
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      success: [523.25, 659.25, 783.99], // C, E, G
      achievement: [523.25, 659.25, 783.99, 1046.5], // C, E, G, C
      level_up: [392, 523.25, 659.25, 783.99, 1046.5], // G, C, E, G, C
    };

    const sequence = frequencies[type];
    let noteIndex = 0;

    const playNote = () => {
      if (noteIndex < sequence.length) {
        oscillator.frequency.setValueAtTime(
          sequence[noteIndex],
          audioContext.currentTime,
        );
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.2,
        );

        noteIndex++;
        setTimeout(playNote, 150);
      } else {
        oscillator.stop();
      }
    };

    oscillator.start();
    playNote();
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage || "I uploaded an image with my homework question.",
      timestamp: new Date(),
      image: uploadedImagePreview || undefined,
      subject: detectSubject(inputMessage),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    const currentImage = uploadedImage;
    setInputMessage("");
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setIsLoading(true);

    try {
      let response;

      if (currentImage) {
        response = await apiClient.sendImage(currentImage, currentMessage);
      } else {
        const subject = detectSubject(currentMessage);
        response = await apiClient.sendMessage({
          message: currentMessage,
          subject,
        });
      }

      const xpEarned = Math.floor(Math.random() * 20) + 10; // 10-30 XP per question

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.message,
        timestamp: new Date(),
        xpEarned,
        subject: userMessage.subject,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCredits(response.credits_remaining);

      // Update stats
      const newTotalQuestions = userStats.totalQuestions + 1;
      const newXP = userStats.xp + xpEarned;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > userStats.level;

      // Track subjects explored
      const subjectsSet = new Set(
        messages
          .filter((m) => m.subject)
          .map((m) => m.subject)
          .concat(userMessage.subject ? [userMessage.subject] : []),
      );

      updateUserStats({
        totalQuestions: newTotalQuestions,
        xp: newXP,
        level: newLevel,
        subjectsExplored: subjectsSet.size,
      });

      // Play appropriate sound
      if (leveledUp) {
        playSound("level_up");
        setShowConfetti(true);
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached Level ${newLevel}!`,
        });
      } else {
        playSound("success");
      }

      toast({
        title: "StudyBuddy responded!",
        description: `+${xpEarned} XP earned! ${response.credits_remaining} credits remaining`,
      });
    } catch (error: any) {
      console.error("Failed to send message:", error);

      // For demo purposes, simulate AI response
      const simulatedResponse = generateSimulatedResponse(
        currentMessage,
        currentImage,
      );
      const xpEarned = Math.floor(Math.random() * 20) + 10;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: simulatedResponse,
        timestamp: new Date(),
        xpEarned,
        subject: userMessage.subject,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Simulate credit deduction and XP gain
      const newCredits = Math.max(0, credits - 1);
      setCredits(newCredits);

      const newTotalQuestions = userStats.totalQuestions + 1;
      const newXP = userStats.xp + xpEarned;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > userStats.level;

      updateUserStats({
        totalQuestions: newTotalQuestions,
        xp: newXP,
        level: newLevel,
      });

      if (leveledUp) {
        playSound("level_up");
        setShowConfetti(true);
      } else {
        playSound("success");
      }

      toast({
        title: "StudyBuddy responded!",
        description: `+${xpEarned} XP earned! ${newCredits} credits remaining`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSimulatedResponse = (message: string, hasImage: boolean) => {
    const subject = detectSubject(message);

    if (hasImage) {
      return `🔍 I can see your homework photo! Let me help you solve this step by step:

📝 **Problem Analysis:**
From your image, I can see this is a ${subject || "homework"} question that needs some careful thinking!

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

    switch (subject) {
      case "math":
        return `🔢 Great math question! Let me help you solve this step by step!

🎯 **Understanding the Problem:**
Math can be like solving a fun puzzle! Let's break it down:

📊 **Step-by-Step Solution:**

1️⃣ **Read Carefully**: First, let's read the problem twice to understand what it's asking
2️⃣ **Find the Numbers**: What numbers do we have to work with?
3️⃣ **Choose the Operation**: Do we need to add ➕, subtract ➖, multiply ✖️, or divide ➗?
4️⃣ **Solve**: Let's work through it together!
5️⃣ **Check**: Does our answer make sense?

💰 **South African Example**: If you have R15 and buy sweets for R8, how much change do you get? R15 - R8 = R7!

👨‍👩‍👧‍👦 **Parent Tip**: Help your child draw pictures or use objects to visualize the problem - this makes math much easier to understand!

🌟 Remember: Every math expert started as a beginner. You're building your math superpowers! 💪

What specific part would you like me to explain more? I'm here to help make math fun! 🚀`;

      case "science":
        return `🔬 Awesome science question! Science is all about discovering how our amazing world works!

🌟 **Let's Explore Together:**

🔍 **Observation**: What do we notice or see in this problem?
🤔 **Question**: What are we trying to understand or find out?
🧪 **Investigation**: How can we find the answer?
💡 **Explanation**: Let's understand why this happens!

🦁 **South African Example**: The big baobab trees in Limpopo use photosynthesis to make their own food from sunlight!

🌱 **Fun Fact**: Science is everywhere around us! From the plants in your garden to the stars in the sky!

👨‍👩‍👧‍👦 **Parent Tip**: Encourage your child to ask "Why?" and "How?" - these are the most important questions in science!

🎯 **Remember**: Scientists make discoveries by being curious and asking questions - just like you're doing right now!

What part of science would you like to explore deeper? Let's go on a learning adventure! 🚀🌟`;

      case "english":
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

🇿🇦 **South African Example**: "The braai was lekker" vs "The braai was delicious" - both work in South African English!

👨‍👩‍👧‍👦 **Parent Tip**: Reading together every day helps build strong language skills. Make it fun with different voices for characters!

🌟 **Remember**: Every great writer started with a single word. You're building your storytelling superpowers! ✨

What part of English would you like to work on? Let's create something amazing together! 🎨📝`;

      default:
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
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePurchaseCredits = async (amount: number) => {
    try {
      const response = await apiClient.purchaseCredits(amount);
      setCredits(response.new_balance);
      setShowCreditDialog(false);
      toast({
        title: "🎉 Credits purchased!",
        description: `Successfully added ${amount} credits to your account!`,
      });
    } catch (error) {
      console.error("Failed to purchase credits:", error);
      // For demo purposes, simulate credit purchase
      const newCredits = credits + amount;
      setCredits(newCredits);
      setShowCreditDialog(false);
      toast({
        title: "🎉 Credits purchased!",
        description: `Successfully added ${amount} credits to your account!`,
      });
    }
  };

  const handleSubjectQuickStart = (subject: string) => {
    const subjectPrompts = {
      math: "I need help with a math problem",
      science: "I have a science question about",
      english: "I need help with English grammar and writing",
      history: "I have a history question about",
      geography: "I need help understanding geography",
    };

    setInputMessage(
      subjectPrompts[subject as keyof typeof subjectPrompts] ||
        "I need help with homework",
    );
  };

  const handleAchievementUnlocked = (achievement: Achievement) => {
    setUnlockedAchievement(achievement);
    playSound("achievement");
    setShowConfetti(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen kids-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-kids-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading StudyBuddy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen kids-gradient-bg">
      {/* Confetti and Achievement Notifications */}
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <AchievementNotification
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />

      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 border-kids-yellow/30">
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
              {/* Level and XP Display */}
              <div className="hidden sm:flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-kids-purple to-kids-blue text-white font-bold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Level {userStats.level}
                </Badge>
                <Badge className="bg-kids-yellow text-kids-purple-dark font-bold">
                  {userStats.xp} XP
                </Badge>
              </div>

              <Badge
                variant="outline"
                className={`border-2 font-bold px-3 py-1 ${
                  credits <= 2
                    ? "bg-red-50 text-red-600 border-red-300 animate-pulse"
                    : "bg-kids-yellow text-kids-purple-dark border-kids-yellow"
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                {credits} credits
              </Badge>

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hidden sm:flex"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>

              {/* Achievements Button */}
              <Button
                variant="outline"
                onClick={() => setShowAchievements(!showAchievements)}
                className="hidden sm:flex"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </Button>

              <Dialog
                open={showCreditDialog}
                onOpenChange={setShowCreditDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bright-button">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-kids-purple font-black">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Learning Credits
                    </DialogTitle>
                    <DialogDescription>
                      Choose the perfect credit package for your learning
                      journey!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    {creditPackages.map((pkg, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer hover:shadow-lg transition-all ${pkg.bonus ? "border-2 border-kids-yellow" : ""}`}
                      >
                        <CardContent
                          className="p-4"
                          onClick={() => handlePurchaseCredits(pkg.credits)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-lg">
                                  {pkg.credits} Credits
                                </span>
                                {pkg.bonus && (
                                  <Badge className="bg-kids-orange text-white">
                                    <Gift className="w-3 h-3 mr-1" />
                                    BONUS
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-xl text-kids-purple">
                                {pkg.currency}
                                {pkg.price}
                              </div>
                              {pkg.bonus && (
                                <div className="text-xs text-kids-orange font-bold">
                                  Save {pkg.currency}
                                  {Math.round(
                                    pkg.credits *
                                      (pkg.price / pkg.credits) *
                                      1.2 -
                                      pkg.price,
                                  )}
                                  !
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Achievement System - Collapsible */}
            <Collapsible
              open={showAchievements}
              onOpenChange={setShowAchievements}
            >
              <CollapsibleTrigger asChild>
                <Card className="rounded-2xl border-2 border-kids-yellow/50 shadow-xl cursor-pointer hover:shadow-2xl transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between font-black text-kids-purple">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-kids-yellow-bright" />
                        Achievements
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${showAchievements ? "rotate-180" : ""}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="rounded-2xl border-2 border-kids-yellow/30 shadow-xl">
                  <CardContent className="p-4">
                    <AchievementSystem
                      stats={userStats}
                      onAchievementUnlocked={handleAchievementUnlocked}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Card className="rounded-2xl border-2 border-kids-yellow/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center font-black text-kids-purple">
                  <Sparkles className="w-5 h-5 mr-2 text-kids-yellow-bright" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start bg-kids-orange hover:bg-kids-orange/80 text-white font-bold"
                  onClick={() => handleSubjectQuickStart("math")}
                >
                  🔢 Math Help
                </Button>
                <Button
                  className="w-full justify-start bg-kids-green hover:bg-kids-green/80 text-white font-bold"
                  onClick={() => handleSubjectQuickStart("science")}
                >
                  🔬 Science Questions
                </Button>
                <Button
                  className="w-full justify-start bg-kids-blue hover:bg-kids-blue/80 text-white font-bold"
                  onClick={() => handleSubjectQuickStart("english")}
                >
                  📚 English Help
                </Button>
                <Button
                  className="w-full justify-start bg-kids-pink hover:bg-kids-pink/80 text-white font-bold"
                  onClick={() => handleSubjectQuickStart("history")}
                >
                  🏛️ History Topics
                </Button>
                <Button
                  className="w-full justify-start bg-kids-purple hover:bg-kids-purple/80 text-white font-bold"
                  onClick={() => handleSubjectQuickStart("geography")}
                >
                  🗺️ Geography
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-kids-purple/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center font-black text-kids-purple">
                  <Star className="w-5 h-5 mr-2 text-kids-yellow-bright" />
                  Learning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Take clear, bright photos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Include the full question</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Ask follow-up questions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-4 h-4 text-kids-yellow-bright mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    Learn together with family
                  </span>
                </div>
              </CardContent>
            </Card>

            {credits <= 2 && (
              <Card className="border-2 border-kids-orange bg-gradient-to-br from-kids-orange/10 to-kids-yellow/10 rounded-2xl shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-kids-orange font-black">
                    <AlertCircle className="w-5 w-5 mr-2" />
                    Low Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-kids-orange font-medium mb-3">
                    You're running low on credits. Purchase more to continue
                    getting homework help.
                  </p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full bright-button font-bold"
                      onClick={() => setShowCreditDialog(true)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Credits
                    </Button>
                  </div>
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
                    AI Homework Helper
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-kids-green text-white border-kids-green font-bold"
                  >
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Online & Ready
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
                          {message.xpEarned && (
                            <div className="mt-2 flex items-center justify-end">
                              <Badge className="bg-kids-yellow text-kids-purple-dark font-bold">
                                <Sparkles className="w-3 h-3 mr-1" />+
                                {message.xpEarned} XP
                              </Badge>
                            </div>
                          )}
                          <div
                            className={`text-xs mt-3 opacity-70 font-medium ${
                              message.type === "user"
                                ? "text-kids-yellow-light"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
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
                            Thinking hard...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-kids-yellow/30 p-4 bg-gradient-to-r from-kids-yellow/5 to-kids-purple/5">
                {uploadedImagePreview && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={uploadedImagePreview}
                      alt="Upload preview"
                      className="max-w-xs rounded-xl border-2 border-kids-yellow shadow-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg bg-kids-orange hover:bg-red-500"
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedImagePreview(null);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )}

                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your homework question here or upload a photo. I'm ready to help you learn!"
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
                      You've used all your credits.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-kids-orange underline font-bold"
                        onClick={() => setShowCreditDialog(true)}
                      >
                        Purchase more credits to continue.
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
