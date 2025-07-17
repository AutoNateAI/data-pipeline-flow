-- Add missing columns to match the existing code expectations

-- Add workflow_data column to user_workflows table
ALTER TABLE public.user_workflows ADD COLUMN workflow_data JSONB;

-- Add is_featured column to prompts table  
ALTER TABLE public.prompts ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Add created_at column to user_workflows table (code expects this instead of started_at)
ALTER TABLE public.user_workflows ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();