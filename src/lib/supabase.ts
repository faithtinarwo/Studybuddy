import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types for StudyBuddy
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          credits?: number;
          level?: number;
          xp?: number;
          current_streak?: number;
          longest_streak?: number;
          subjects_explored?: number;
          perfect_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          credits?: number;
          level?: number;
          xp?: number;
          current_streak?: number;
          longest_streak?: number;
          subjects_explored?: number;
          perfect_days?: number;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          subject: string | null;
          has_image: boolean;
          xp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          subject?: string | null;
          has_image?: boolean;
          xp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_message?: string;
          ai_response?: string;
          subject?: string | null;
          has_image?: boolean;
          xp_earned?: number;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          achievement_name: string;
          achievement_description: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          achievement_name: string;
          achievement_description: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          achievement_name?: string;
          achievement_description?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          transaction_type: "purchase" | "usage" | "bonus";
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          transaction_type: "purchase" | "usage" | "bonus";
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          transaction_type?: "purchase" | "usage" | "bonus";
          description?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Auth helpers
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  // Create user profile in our users table
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      credits: 5, // Free trial credits
    });

    if (profileError) throw profileError;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: Database["public"]["Tables"]["users"]["Update"],
) => {
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addChatMessage = async (
  message: Database["public"]["Tables"]["chat_messages"]["Insert"],
) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const unlockAchievement = async (
  achievement: Database["public"]["Tables"]["achievements"]["Insert"],
) => {
  const { data, error } = await supabase
    .from("achievements")
    .insert(achievement)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const addCreditTransaction = async (
  transaction: Database["public"]["Tables"]["credit_transactions"]["Insert"],
) => {
  const { data, error } = await supabase
    .from("credit_transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCreditHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
