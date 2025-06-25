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
} from "lucide-react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Camera,
      title: "Photo Upload",
      description:
        "Simply take a photo of homework questions and get instant help",
    },
    {
      icon: MessageCircle,
      title: "AI Chat Assistant",
      description:
        "Interactive AI that explains concepts in simple, parent-friendly language",
    },
    {
      icon: BookOpen,
      title: "All Subjects",
      description:
        "Math, Science, English, Social Studies - we cover everything",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description:
        "Get help anytime, whether it's evening homework or weekend projects",
    },
    {
      icon: Users,
      title: "Family Friendly",
      description:
        "Designed specifically for busy parents helping their children",
    },
    {
      icon: Award,
      title: "Educational Focus",
      description: "Not just answers - explanations that help children learn",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mother of 2",
      content:
        "This app saved my evenings! I can finally help my kids with math homework without feeling lost.",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Father of 3",
      content:
        "Perfect for science questions I haven't thought about since school. My daughter loves the explanations.",
      rating: 5,
    },
    {
      name: "Maria L.",
      role: "Working Mom",
      content:
        "Worth every shilling! Quick, accurate, and explains things so I can help my son understand.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Pay-per-Use",
      price: "KES 5-10",
      description: "per question",
      features: [
        "Instant AI responses",
        "Photo upload support",
        "Basic explanations",
        "No commitment",
      ],
      popular: false,
    },
    {
      name: "Family Plan",
      price: "KES 500",
      description: "per month",
      features: [
        "Unlimited questions",
        "All subjects covered",
        "Detailed explanations",
        "Family progress tracking",
        "Priority support",
        "Homework reminders",
      ],
      popular: true,
    },
    {
      name: "School Partnership",
      price: "Custom",
      description: "pricing",
      features: [
        "Bulk discounts",
        "Teacher dashboard",
        "Student progress reports",
        "Custom integrations",
        "Dedicated support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-brand-500 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                StudyBuddy
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-brand-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-brand-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-brand-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-brand-600 transition-colors"
              >
                Reviews
              </a>
              <Link to="/homework-helper">
                <Button className="bg-brand-500 hover:bg-brand-600">
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
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700">
                How it Works
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700">
                Pricing
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700">
                Reviews
              </a>
              <Link to="/homework-helper" className="block px-3 py-2">
                <Button className="w-full bg-brand-500 hover:bg-brand-600">
                  Try Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-brand-100 text-brand-700 hover:bg-brand-200">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Homework Assistant
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Never Feel Lost During
              <span className="gradient-text block">Homework Time Again</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Help your children succeed with our AI-powered homework assistant.
              Upload photos of questions or chat with our AI tutor for instant,
              parent-friendly explanations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/homework-helper">
                <Button
                  size="lg"
                  className="bg-brand-500 hover:bg-brand-600 px-8 py-4 text-lg"
                >
                  Start Helping Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Free trial available
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No subscription required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Help Your Child</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI assistant makes homework time less stressful for both
              parents and children
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow animate-slide-up border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="bg-brand-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple as <span className="gradient-text">1-2-3</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get homework help in just three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Upload or Ask</h3>
              <p className="text-gray-600 leading-relaxed">
                Take a photo of the homework question or type your question
                directly into the chat
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Analyzes</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI understands the question and prepares a clear,
                step-by-step explanation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Learn Together</h3>
              <p className="text-gray-600 leading-relaxed">
                Get parent-friendly explanations that help you guide your child
                through the solution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="gradient-text">Affordable</span> Help for Every
              Family
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for your family's needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative p-6 ${plan.popular ? "border-brand-500 shadow-xl scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {plan.description}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                  <Button
                    className={`w-full mt-6 ${plan.popular ? "bg-brand-500 hover:bg-brand-600" : "bg-gray-900 hover:bg-gray-800"}`}
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
      <section id="testimonials" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What <span className="gradient-text">Parents Say</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from families who've transformed homework time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-brand-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Heart className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
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
      <section className="py-20 bg-brand-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Homework Time Easier?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Join thousands of parents who've already transformed their
            children's learning experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/homework-helper">
              <Button
                size="lg"
                className="bg-white text-brand-500 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center text-brand-100">
              <Smartphone className="h-5 w-5 mr-2" />
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
                <div className="bg-brand-500 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">StudyBuddy</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering parents to help their children succeed in education
                through AI-powered assistance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/homework-helper"
                    className="hover:text-white transition-colors"
                  >
                    Try Now
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Email Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    School Partnerships
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 StudyBuddy. Making homework easier for families across
              Kenya.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
