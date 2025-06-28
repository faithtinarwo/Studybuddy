// StudyBuddy API Client with Supabase Integration
import {
  supabase,
  type Database,
  getCurrentUser,
  signUp,
  signIn,
  signOut,
  getUserProfile,
  updateUserProfile,
  addChatMessage,
  getChatHistory,
  unlockAchievement,
  getUserAchievements,
  addCreditTransaction,
} from "./supabase";
import { generateAIResponse } from "./ai-service";

export interface User {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  subjects_explored: number;
  perfect_days: number;
}

export interface ChatRequest {
  message: string;
  subject?: string;
}

export interface ChatResponse {
  message: string;
  credits_remaining: number;
  xp_earned: number;
  level: number;
}

export interface AuthResponse {
  user: User;
  session: any;
}

export interface Achievement {
  id: string;
  achievement_id: string;
  achievement_name: string;
  achievement_description: string;
  unlocked_at: string;
}

class SupabaseApiClient {
  constructor() {
    // Initialize auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user?.email);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      }
    });
  }

  // Authentication methods
  async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await signUp(email, password, fullName);
      if (error) throw error;

      if (!data.user) throw new Error("Registration failed");

      const userProfile = await getUserProfile(data.user.id);

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name,
          credits: userProfile.credits,
          level: userProfile.level,
          xp: userProfile.xp,
          current_streak: userProfile.current_streak,
          longest_streak: userProfile.longest_streak,
          subjects_explored: userProfile.subjects_explored,
          perfect_days: userProfile.perfect_days,
        },
        session: data.session,
      };
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      if (!data.user) throw new Error("Login failed");

      const userProfile = await getUserProfile(data.user.id);

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name,
          credits: userProfile.credits,
          level: userProfile.level,
          xp: userProfile.xp,
          current_streak: userProfile.current_streak,
          longest_streak: userProfile.longest_streak,
          subjects_explored: userProfile.subjects_explored,
          perfect_days: userProfile.perfect_days,
        },
        session: data.session,
      };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut();
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const userProfile = await getUserProfile(authUser.id);

      return {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name,
        credits: userProfile.credits,
        level: userProfile.level,
        xp: userProfile.xp,
        current_streak: userProfile.current_streak,
        longest_streak: userProfile.longest_streak,
        subjects_explored: userProfile.subjects_explored,
        perfect_days: userProfile.perfect_days,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to get current user");
    }
  }

  // Chat and AI methods
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const userProfile = await getUserProfile(authUser.id);

      if (userProfile.credits < 1) {
        throw new Error("Insufficient credits");
      }

      // Generate AI response
      const aiResponse = await generateAIResponse(
        request.message,
        request.subject,
      );

      // Calculate XP earned (10-30 XP based on complexity)
      const xpEarned = Math.floor(Math.random() * 20) + 10;

      // Use Supabase function to process the submission
      const { data, error } = await supabase.rpc(
        "process_homework_submission",
        {
          p_user_id: authUser.id,
          p_user_message: request.message,
          p_ai_response: aiResponse,
          p_subject: request.subject || null,
          p_has_image: false,
          p_xp_earned: xpEarned,
        },
      );

      if (error) throw error;

      return {
        message: aiResponse,
        credits_remaining: data.credits_remaining,
        xp_earned: data.xp_earned,
        level: data.level,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to send message");
    }
  }

  async sendImage(file: File, message?: string): Promise<ChatResponse> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const userProfile = await getUserProfile(authUser.id);

      if (userProfile.credits < 1) {
        throw new Error("Insufficient credits");
      }

      // TODO: Upload image to Supabase Storage
      // For now, we'll process the text message and indicate it had an image

      const questionText =
        message || "I uploaded an image with my homework question.";
      const aiResponse = await generateAIResponse(
        questionText,
        undefined,
        true,
      );

      const xpEarned = Math.floor(Math.random() * 20) + 15; // Slightly more XP for image uploads

      // Use Supabase function to process the submission
      const { data, error } = await supabase.rpc(
        "process_homework_submission",
        {
          p_user_id: authUser.id,
          p_user_message: questionText,
          p_ai_response: aiResponse,
          p_subject: detectSubject(questionText),
          p_has_image: true,
          p_xp_earned: xpEarned,
        },
      );

      if (error) throw error;

      return {
        message: aiResponse,
        credits_remaining: data.credits_remaining,
        xp_earned: data.xp_earned,
        level: data.level,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to process image");
    }
  }

  async getChatHistory(): Promise<any[]> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const messages = await getChatHistory(authUser.id);

      return messages.map((msg) => ({
        id: msg.id,
        user_message: msg.user_message,
        ai_response: msg.ai_response,
        subject: msg.subject,
        has_image: msg.has_image,
        xp_earned: msg.xp_earned,
        created_at: msg.created_at,
      }));
    } catch (error: any) {
      throw new Error(error.message || "Failed to get chat history");
    }
  }

  // Credits methods
  async getCredits(): Promise<{ credits: number }> {
    try {
      const user = await this.getCurrentUser();
      return { credits: user.credits };
    } catch (error: any) {
      throw new Error(error.message || "Failed to get credits");
    }
  }

  async purchaseCredits(amount: number): Promise<{
    success: boolean;
    new_balance: number;
    amount_purchased: number;
    cost: number;
  }> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      // Credit pricing in Rands
      const pricing: { [key: number]: number } = {
        5: 5, // R 5 for 5 credits
        10: 10, // R 10 for 10 credits
        25: 20, // R 20 for 25 credits (bonus!)
        50: 40, // R 40 for 50 credits (better deal!)
        100: 75, // R 75 for 100 credits (best value!)
      };

      const cost = pricing[amount];
      if (!cost) {
        throw new Error("Invalid credit package");
      }

      // Use Supabase function to purchase credits
      const { data, error } = await supabase.rpc("purchase_credits", {
        p_user_id: authUser.id,
        p_amount: amount,
        p_cost: cost,
      });

      if (error) throw error;

      return {
        success: data.success,
        new_balance: data.new_balance,
        amount_purchased: data.credits_purchased,
        cost: data.cost,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to purchase credits");
    }
  }

  // Achievement methods
  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const achievements = await getUserAchievements(authUser.id);
      return achievements;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get achievements");
    }
  }

  async unlockAchievement(
    achievementId: string,
    name: string,
    description: string,
  ): Promise<Achievement> {
    try {
      const authUser = await getCurrentUser();
      if (!authUser) throw new Error("Not authenticated");

      const achievement = await unlockAchievement({
        user_id: authUser.id,
        achievement_id: achievementId,
        achievement_name: name,
        achievement_description: description,
      });

      return achievement;
    } catch (error: any) {
      // If achievement already exists, that's ok
      if (error.message.includes("duplicate key")) {
        throw new Error("Achievement already unlocked");
      }
      throw new Error(error.message || "Failed to unlock achievement");
    }
  }
}

export const apiClient = new SupabaseApiClient();

// Helper functions for detecting subjects
export const detectSubject = (message: string): string | undefined => {
  const mathKeywords = [
    "calculate",
    "solve",
    "equation",
    "add",
    "subtract",
    "multiply",
    "divide",
    "fraction",
    "percentage",
    "algebra",
    "geometry",
    "math",
    "mathematics",
  ];
  const scienceKeywords = [
    "experiment",
    "hypothesis",
    "biology",
    "chemistry",
    "physics",
    "atom",
    "molecule",
    "energy",
    "force",
    "science",
  ];
  const englishKeywords = [
    "essay",
    "paragraph",
    "grammar",
    "sentence",
    "verb",
    "noun",
    "adjective",
    "write",
    "composition",
    "english",
    "literature",
  ];

  const lowerMessage = message.toLowerCase();

  if (mathKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "math";
  }
  if (scienceKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "science";
  }
  if (englishKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "english";
  }

  return undefined;
};
