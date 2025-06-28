# 🚀 StudyBuddy Supabase Setup Guide

This guide will help you set up Supabase as the backend for your StudyBuddy application.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic understanding of SQL (optional)

## 🔧 Step 1: Create a Supabase Project

1. **Sign in to Supabase** and create a new project
2. **Choose a project name**: `studybuddy-production` (or similar)
3. **Set a strong database password** and save it securely
4. **Select a region** closest to your users (e.g., Africa for South African users)
5. **Wait for project initialization** (usually 2-3 minutes)

## 🗄️ Step 2: Set Up Database Schema

1. **Open the SQL Editor** in your Supabase dashboard
2. **Copy and paste** the entire contents of `supabase/migrations/001_initial_schema.sql`
3. **Run the SQL script** to create all tables, functions, and security policies
4. **Verify the setup** by checking the Tables tab - you should see:
   - `users`
   - `chat_messages`
   - `achievements`
   - `credit_transactions`

## 🔑 Step 3: Get Your API Keys

1. **Go to Project Settings** → API
2. **Copy your Project URL** (looks like `https://xxxxx.supabase.co`)
3. **Copy your anon/public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)
4. **Keep your service_role key secure** (only use server-side if needed)

## ⚙️ Step 4: Configure Environment Variables

1. **Copy the environment template**:

   ```bash
   cp .env.example .env
   ```

2. **Update your `.env` file**:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_OPENAI_API_KEY=sk-your-openai-key-here  # Optional for real AI
   ```

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## 🔒 Step 5: Configure Authentication

Supabase Auth is already configured in the schema. To customize:

1. **Go to Authentication** → Settings
2. **Configure email templates** (optional)
3. **Set up social providers** like Google (optional)
4. **Configure email confirmation** settings

### Email Templates

You can customize the email templates for:

- Welcome emails
- Password reset emails
- Email confirmation

## 📊 Step 6: Set Up Row Level Security (RLS)

RLS is already configured in the schema, but you can verify:

1. **Go to Authentication** → Policies
2. **Check that policies exist** for all tables
3. **Test policies** by trying to access data through the API

### Key Security Features:

- Users can only access their own data
- All operations are authenticated
- No direct database access for unauthenticated users

## 🎯 Step 7: Test the Integration

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Test user registration**:

   - Try creating a new account
   - Check if user appears in the `users` table

3. **Test homework submissions**:

   - Send a test message
   - Verify it appears in `chat_messages`
   - Check credit deduction works

4. **Test achievements**:
   - Trigger an achievement
   - Verify it appears in `achievements` table

## 🔧 Step 8: Optional Advanced Features

### Enable Real-time Features

```sql
-- Enable real-time for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
```

### Set Up Storage for Images

1. **Go to Storage** in Supabase dashboard
2. **Create a new bucket** called `homework-images`
3. **Set appropriate policies** for image uploads

### Add Full-Text Search

```sql
-- Add full-text search to chat messages
ALTER TABLE chat_messages
ADD COLUMN search_vector tsvector;

CREATE INDEX chat_messages_search_idx
ON chat_messages
USING gin(search_vector);
```

## 📈 Step 9: Production Deployment

### Environment Variables for Production

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key

# Production OpenAI
VITE_OPENAI_API_KEY=sk-your-production-openai-key

# Production App URL
VITE_APP_URL=https://studybuddy.co.za
```

### Database Backup

1. **Set up automated backups** in Supabase dashboard
2. **Export schema** regularly using pg_dump
3. **Test restore procedures**

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**

   - Check your environment variables
   - Ensure `.env` file is not committed to git
   - Restart your development server

2. **"Row Level Security policy violation"**

   - Check if user is authenticated
   - Verify RLS policies are correctly set up
   - Check user ID matches in database

3. **"Schema not found" errors**

   - Ensure you ran the migration SQL completely
   - Check all tables were created
   - Verify functions and triggers exist

4. **Real-time not working**
   - Enable real-time for specific tables
   - Check network connectivity
   - Verify subscription setup in code

### Debug SQL Queries

Use the Supabase dashboard SQL editor to debug:

```sql
-- Check user data
SELECT * FROM users WHERE email = 'user@example.com';

-- Check chat messages
SELECT * FROM chat_messages WHERE user_id = 'user-uuid-here';

-- Check achievements
SELECT * FROM achievements WHERE user_id = 'user-uuid-here';
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)

## 🆘 Support

If you encounter issues:

1. **Check the Supabase Dashboard** logs
2. **Review the browser console** for errors
3. **Check network requests** in developer tools
4. **Consult Supabase documentation**
5. **Ask for help** in Supabase Discord community

---

🎉 **Congratulations!** Your StudyBuddy app is now powered by a production-ready Supabase backend with real authentication, database storage, and scalable architecture!
