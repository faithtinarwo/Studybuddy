import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Camera,
  MessageCircle,
  Star,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Heart,
  Clock,
  Award,
  Smartphone,
  Globe,
  Sparkles,
  Bot,
  GraduationCap,
} from "lucide-react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Camera,
      title: "Snap & Learn",
      description:
        "Just take a photo of homework and get instant, fun explanations!",
      color: "bg-orange-500",
    },
    {
      icon: Bot,
      title: "AI Study Buddy",
      description:
        "Chat with our friendly AI tutor who makes learning fun and easy",
      color: "bg-purple-500",
    },
    {
      icon: BookOpen,
      title: "All Subjects",
      description:
        "Math, Science, English, Social Studies - we've got it all covered!",
      color: "bg-green-500",
    },
    {
      icon: Clock,
      title: "24/7 Helper",
      description:
        "Get help anytime - morning, noon, or night homework sessions",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      title: "Family Friendly",
      description:
        "Made especially for busy parents helping their awesome kids",
      color: "bg-pink-500",
    },
    {
      icon: Award,
      title: "Learn & Grow",
      description: "Not just answers - we help children understand and learn!",
      color: "bg-yellow-400",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mother of 2",
      content:
        "My kids love the colorful explanations! Homework time is actually fun now instead of stressful.",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Father of 3",
      content:
        "The AI tutor explains things so clearly. My daughter actually looks forward to doing homework!",
      rating: 5,
    },
    {
      name: "Maria L.",
      role: "Working Mom",
      content:
        "Best investment for our family! The kids can get help even when I'm busy at work.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Try It Out",
      price: "R 5-10",
      description: "per question",
      features: [
        "Instant AI responses",
        "Photo upload support",
        "Fun explanations",
        "No commitment needed",
      ],
      popular: false,
      color: "kids-blue",
    },
    {
      name: "Family Fun Pack",
      price: "R 50",
      description: "per month",
      features: [
        "Unlimited questions",
        "All subjects covered",
        "Detailed explanations",
        "Family progress tracking",
        "Priority support",
        "Fun homework reminders",
      ],
      popular: true,
      color: "kids-purple",
    },
    {
      name: "School Partnership",
      price: "Custom",
      description: "pricing",
      features: [
        "Bulk family discounts",
        "Teacher dashboard",
        "Student progress reports",
        "Custom integrations",
        "Dedicated support",
      ],
      popular: false,
      color: "kids-green",
    },
  ];

  return (
    <div className="min-h-screen kids-gradient-bg">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 border-kids-yellow/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-kids-purple to-brand-500 p-2 rounded-xl animate-bounce-gentle">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                StudyBuddy
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-kids-purple font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-kids-purple font-medium transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-kids-purple font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-kids-purple font-medium transition-colors"
              >
                Reviews
              </a>
              <Link to="/homework-helper">
                <Button className="bright-button">
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-kids-yellow/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-700 font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-gray-700 font-medium"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-gray-700 font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-gray-700 font-medium"
              >
                Reviews
              </a>
              <Link to="/homework-helper" className="block px-3 py-2">
                <Button className="w-full bright-button">Try Now</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-kids-yellow-light/50 via-transparent to-kids-purple-light/50"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-kids-yellow text-kids-purple-dark hover:bg-kids-yellow-bright font-bold text-lg py-2 px-4 animate-wiggle">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Assistant
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Make Homework
              <span className="block kids-gradient-purple bg-clip-text text-transparent animate-bounce-gentle">
                Fun & Easy!
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
              Help your kids succeed with our AI homework assistant. Snap
              photos, chat with AI, and watch learning become an exciting
              adventure for the whole family.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/homework-helper">
                <Button
                  size="lg"
                  className="bright-button px-10 py-6 text-xl font-black rounded-2xl shadow-2xl"
                >
                  Start Learning Now <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-xl font-bold border-3 border-kids-purple text-kids-purple hover:bg-kids-purple hover:text-white rounded-2xl transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-lg font-medium text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-kids-green mr-3" />
                Free trial available
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-kids-green mr-3" />
                No subscription required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-kids-green mr-3" />
                All subjects covered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Everything You Need for{" "}
              <span className="gradient-text">Amazing Learning</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Our AI assistant makes homework time enjoyable and productive for
              kids and parents alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up border-0 fun-shadow hover:scale-105 rounded-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" /> {/* ✅ Correct usage */}
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-lg">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 kids-gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Simple as <span className="gradient-text">1-2-3</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Get homework help in just three easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="kids-gradient-yellow text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl animate-bounce-gentle">
                1
              </div>
              <h3 className="text-3xl font-black mb-4">Snap or Ask</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Take a clear photo of homework or type your question directly
                into our chat interface.
              </p>
            </div>
            <div className="text-center">
              <div
                className="kids-gradient-purple text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl animate-bounce-gentle"
                style={{ animationDelay: "0.2s" }}
              >
                2
              </div>
              <h3 className="text-3xl font-black mb-4">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our smart AI reads and understands, then creates detailed
                step-by-step explanations.
              </p>
            </div>
            <div className="text-center">
              <div
                className="bg-kids-green text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl animate-bounce-gentle"
                style={{ animationDelay: "0.4s" }}
              >
                3
              </div>
              <h3 className="text-3xl font-black mb-4">Learn Together</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Get clear explanations that help parents and kids learn together
                effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              <span className="gradient-text">Great Value</span> for Every
              Family
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Choose the perfect plan for your family's learning needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-4 border-kids-purple shadow-2xl scale-105 bg-gradient-to-br from-kids-purple-light to-white"
                    : "border-2 border-gray-200 hover:border-kids-yellow shadow-lg"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-kids-yellow text-kids-purple-dark font-black text-lg py-2 px-6 animate-wiggle">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-black">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-black text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2 text-xl font-medium">
                      {plan.description}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-kids-green mr-4 flex-shrink-0" />
                      <span className="text-gray-600 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                  <Button
                    className={`w-full mt-8 font-black text-lg py-4 rounded-2xl transition-all duration-300 ${
                      plan.popular ? "bright-button" : "purple-button"
                    }`}
                  >
                    {plan.name === "School Partnership"
                      ? "Contact Us"
                      : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 kids-gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              What <span className="gradient-text">Families</span> Say
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Real stories from families who love StudyBuddy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 border-0 shadow-xl rounded-2xl bg-white hover:scale-105 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-kids-yellow-bright fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg font-medium">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-kids-pink w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-kids-purple font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 kids-gradient-purple">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-kids-yellow-light mb-8 font-medium">
            Join thousands of families making homework time easier and more
            effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/homework-helper">
              <Button
                size="lg"
                className="bg-kids-yellow hover:bg-kids-yellow-bright text-kids-purple-dark px-10 py-6 text-xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Free Trial <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center text-kids-yellow-light font-medium">
              <Smartphone className="h-6 w-6 mr-3" />
              Works on all devices
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-kids-purple p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-black">StudyBuddy</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-medium">
                Empowering families to make learning an exciting adventure
                through AI-powered homework assistance.
              </p>
            </div>
            <div>
              <h3 className="font-black mb-4 text-kids-yellow">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/homework-helper"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Try Now
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4 text-kids-yellow">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4 text-kids-yellow">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-kids-yellow transition-colors font-medium"
                  >
                    School Partnerships
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="font-medium">
              &copy; 2024 StudyBuddy. Making homework easier for families across
              South Africa and beyond.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
