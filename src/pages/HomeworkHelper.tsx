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
import { apiClient, detectSubject } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setCredits(userData.credits);
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Redirect to login if user is not authenticated
      navigate("/");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage || "I uploaded an image with my homework question.",
      timestamp: new Date(),
      image: uploadedImagePreview || undefined,
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
        // Send image to backend
        response = await apiClient.sendImage(currentImage, currentMessage);
      } else {
        // Send text message to backend
        const subject = detectSubject(currentMessage);
        response = await apiClient.sendMessage({
          message: currentMessage,
          subject,
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCredits(response.credits_remaining);

      // Show success toast
      toast({
        title: "✨ StudyBuddy responded!",
        description: `${response.credits_remaining} credits remaining`,
      });
    } catch (error: any) {
      console.error("Failed to send message:", error);

      // Handle specific error cases
      if (error.message.includes("402")) {
        toast({
          title: "😔 No credits remaining",
          description: "Please purchase more credits to continue learning!",
          variant: "destructive",
        });
      } else if (error.message.includes("401")) {
        toast({
          title: "🔐 Authentication required",
          description: "Please log in to continue using StudyBuddy",
          variant: "destructive",
        });
        navigate("/");
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "🤖 Oops! I'm having a little trouble right now. Please try again in a moment! 💝",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        toast({
          title: "😔 Something went wrong",
          description: "Please try again in a moment!",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
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
      toast({
        title: "🎉 Credits purchased!",
        description: `Successfully added ${amount} credits to your account!`,
      });
    } catch (error) {
      console.error("Failed to purchase credits:", error);
      toast({
        title: "😔 Purchase failed",
        description: "Unable to purchase credits. Please try again.",
        variant: "destructive",
      });
    }
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
                onClick={() => handlePurchaseCredits(10)}
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
                    🎯 You're running low on learning power! Get more credits
                    for unlimited homework adventures!
                  </p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full bright-button font-bold"
                      onClick={() => handlePurchaseCredits(10)}
                    >
                      🚀 Get 10 Credits (R 10)
                    </Button>
                    <Button
                      size="sm"
                      className="w-full purple-button font-bold"
                      onClick={() => handlePurchaseCredits(50)}
                    >
                      💎 Get 50 Credits (R 40)
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
                        onClick={() => handlePurchaseCredits(10)}
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
