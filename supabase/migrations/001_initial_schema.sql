-- StudyBuddy Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    credits INTEGER DEFAULT 5,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    subjects_explored INTEGER DEFAULT 0,
    perfect_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    subject TEXT,
    has_image BOOLEAN DEFAULT FALSE,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage', 'bonus')) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only see their own chat messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own credit transactions
CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit transactions" ON public.credit_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'StudyBuddy User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle credit deduction and XP gain
CREATE OR REPLACE FUNCTION public.process_homework_submission(
    p_user_id UUID,
    p_user_message TEXT,
    p_ai_response TEXT,
    p_subject TEXT DEFAULT NULL,
    p_has_image BOOLEAN DEFAULT FALSE,
    p_xp_earned INTEGER DEFAULT 15
)
RETURNS JSON AS $$
DECLARE
    v_user_credits INTEGER;
    v_new_credits INTEGER;
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_chat_message_id UUID;
    v_result JSON;
BEGIN
    -- Check if user has enough credits
    SELECT credits, xp INTO v_user_credits, v_new_xp 
    FROM public.users 
    WHERE id = p_user_id;
    
    IF v_user_credits < 1 THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;
    
    -- Calculate new values
    v_new_credits := v_user_credits - 1;
    v_new_xp := v_new_xp + p_xp_earned;
    v_new_level := FLOOR(v_new_xp / 100) + 1;
    
    -- Insert chat message
    INSERT INTO public.chat_messages (user_id, user_message, ai_response, subject, has_image, xp_earned)
    VALUES (p_user_id, p_user_message, p_ai_response, p_subject, p_has_image, p_xp_earned)
    RETURNING id INTO v_chat_message_id;
    
    -- Update user stats
    UPDATE public.users 
    SET 
        credits = v_new_credits,
        xp = v_new_xp,
        level = v_new_level,
        subjects_explored = (
            SELECT COUNT(DISTINCT subject) 
            FROM public.chat_messages 
            WHERE user_id = p_user_id AND subject IS NOT NULL
        )
    WHERE id = p_user_id;
    
    -- Record credit usage
    INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
    VALUES (p_user_id, -1, 'usage', 'Homework question: ' || LEFT(p_user_message, 50));
    
    -- Return result
    SELECT json_build_object(
        'chat_message_id', v_chat_message_id,
        'credits_remaining', v_new_credits,
        'xp_earned', p_xp_earned,
        'total_xp', v_new_xp,
        'level', v_new_level
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to purchase credits
CREATE OR REPLACE FUNCTION public.purchase_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_cost DECIMAL
)
RETURNS JSON AS $$
DECLARE
    v_new_credits INTEGER;
    v_result JSON;
BEGIN
    -- Update user credits
    UPDATE public.users 
    SET credits = credits + p_amount
    WHERE id = p_user_id
    RETURNING credits INTO v_new_credits;
    
    -- Record credit purchase
    INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
    VALUES (p_user_id, p_amount, 'purchase', 
            'Purchased ' || p_amount || ' credits for R' || p_cost);
    
    -- Return result
    SELECT json_build_object(
        'success', TRUE,
        'credits_purchased', p_amount,
        'new_balance', v_new_credits,
        'cost', p_cost
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample achievements data
INSERT INTO public.achievements (user_id, achievement_id, achievement_name, achievement_description)
SELECT 
    '00000000-0000-0000-0000-000000000000'::UUID, -- Placeholder, will be replaced with actual user IDs
    unnest(ARRAY['first_question', 'streak_starter', 'question_master', 'week_warrior', 'subject_explorer', 'perfect_student']),
    unnest(ARRAY['Getting Started', 'Streak Starter', 'Question Master', 'Week Warrior', 'Subject Explorer', 'Perfect Student']),
    unnest(ARRAY[
        'Ask your first question',
        'Learn for 3 days in a row', 
        'Ask 10 questions',
        'Learn for 7 days in a row',
        'Try all 5 subjects',
        'Complete 5 perfect learning days'
    ])
WHERE FALSE; -- Don't actually insert, this is just for reference

-- Create view for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.credits,
    u.level,
    u.xp,
    u.current_streak,
    u.longest_streak,
    u.subjects_explored,
    u.perfect_days,
    COUNT(cm.id) as total_questions,
    COUNT(a.id) as achievements_unlocked,
    SUM(CASE WHEN ct.transaction_type = 'purchase' THEN ct.amount ELSE 0 END) as total_credits_purchased
FROM public.users u
LEFT JOIN public.chat_messages cm ON u.id = cm.user_id
LEFT JOIN public.achievements a ON u.id = a.user_id
LEFT JOIN public.credit_transactions ct ON u.id = ct.user_id
GROUP BY u.id, u.email, u.full_name, u.credits, u.level, u.xp, 
         u.current_streak, u.longest_streak, u.subjects_explored, u.perfect_days;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.achievements TO authenticated;
GRANT ALL ON public.credit_transactions TO authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_homework_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_credits TO authenticated;
