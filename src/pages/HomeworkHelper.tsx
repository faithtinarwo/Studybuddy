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
        "Hi! I'm StudyBuddy, your AI homework assistant. I'm here to help you understand your homework questions. You can upload a photo of your homework or type your question directly. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(5); // Sample credits
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I can see your homework question! Let me break this down for you step by step:\n\n1. **Understanding the Problem**: This appears to be a math word problem about calculating percentages.\n\n2. **Step-by-Step Solution**:\n   - First, identify what we know\n   - Then, set up the equation\n   - Finally, solve for the unknown\n\n3. **Parent Tip**: When helping your child, encourage them to read the problem aloud first. This helps with comprehension!\n\nWould you like me to explain any specific part in more detail?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      setCredits((prev) => Math.max(0, prev - 1));
    }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-brand-500 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">
                  StudyBuddy
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="bg-brand-50 text-brand-700 border-brand-200"
              >
                <Zap className="w-3 h-3 mr-1" />
                {credits} credits left
              </Badge>
              <Button variant="outline" className="hidden sm:flex">
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Take clear photos with good lighting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include the full question in your photo</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ask follow-up questions for clarity</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Work through examples together</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Subjects We Cover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary" className="mr-2 mb-2">
                  Mathematics
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  Science
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  English
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  Social Studies
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  Geography
                </Badge>
                <Badge variant="secondary" className="mr-2 mb-2">
                  History
                </Badge>
              </CardContent>
            </Card>

            {credits <= 2 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-orange-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Low Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-600 mb-3">
                    You're running low on credits. Consider upgrading to our
                    Family Plan for unlimited questions!
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-brand-500" />
                    Homework Assistant
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === "user"
                              ? "bg-brand-500"
                              : "bg-gradient-to-r from-purple-500 to-pink-500"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-brand-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.image && (
                            <div className="mb-2">
                              <img
                                src={message.image}
                                alt="Uploaded homework"
                                className="max-w-xs rounded-lg"
                              />
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div
                            className={`text-xs mt-2 opacity-70 ${
                              message.type === "user"
                                ? "text-brand-100"
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
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                {uploadedImage && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Upload preview"
                      className="max-w-xs rounded-lg border"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={() => setUploadedImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your homework question here or upload a photo..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
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
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        isLoading ||
                        (!inputMessage.trim() && !uploadedImage) ||
                        credits <= 0
                      }
                      className="bg-brand-500 hover:bg-brand-600"
                    >
                      <Send className="w-4 h-4" />
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
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      You've run out of credits.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-red-600 underline"
                      >
                        Buy more credits
                      </Button>{" "}
                      to continue.
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
