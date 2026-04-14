-- ==========================================
-- Personal Finance Tracker - Custom Auth Schema
-- ==========================================

-- 1. CUSTOM USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL, -- 'income' or 'expense'
    color text
);

-- 3. TRANSACTIONS TABLE (Linked to our custom users table)
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    amount numeric NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    transaction_date date NOT NULL DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now()
);

-- Initial Categories
INSERT INTO public.categories (name, type, color) VALUES 
('Maaş', 'income', '#2ecc71'),
('Kira', 'expense', '#e74c3c'),
('Market', 'expense', '#f1c40f'),
('Ulaşım', 'expense', '#3498db'),
('Eğlence', 'expense', '#9b59b6'),
('Fatura', 'expense', '#f39c12')
ON CONFLICT (id) DO NOTHING;
