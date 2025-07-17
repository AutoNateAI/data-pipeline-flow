-- Update database schema to match the exact target schema
-- Drop policies first before dropping columns

-- Drop workflows table as it's not in the target schema
DROP TABLE IF EXISTS public.workflows CASCADE;

-- Drop old policies that reference columns we're about to drop
DROP POLICY IF EXISTS "Users can view their own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can create their own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can update their own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can delete their own workflows" ON public.workflows;

DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can create their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;

DROP POLICY IF EXISTS "Users can view their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.templates;

DROP POLICY IF EXISTS "Users can view their own workflow progress" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can create their own workflow progress" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can update their own workflow progress" ON public.user_workflows;
DROP POLICY IF EXISTS "Users can delete their own workflow progress" ON public.user_workflows;

-- Drop indexes that reference columns we're about to drop
DROP INDEX IF EXISTS idx_prompts_user_id;
DROP INDEX IF EXISTS idx_templates_user_id;
DROP INDEX IF EXISTS idx_workflows_user_id;
DROP INDEX IF EXISTS idx_user_workflows_workflow_id;

-- Update comments table
ALTER TABLE public.comments 
  DROP CONSTRAINT IF EXISTS comments_item_type_check,
  ADD COLUMN parent_comment_id uuid,
  ADD CONSTRAINT comments_item_type_check CHECK (item_type = ANY (ARRAY['prompt'::text, 'template'::text]));

-- Update favorites table
ALTER TABLE public.favorites 
  DROP CONSTRAINT IF EXISTS favorites_item_type_check,
  DROP CONSTRAINT IF EXISTS favorites_user_id_item_id_item_type_key,
  ADD CONSTRAINT favorites_item_type_check CHECK (item_type = ANY (ARRAY['prompt'::text, 'template'::text]));

-- Update profiles table
ALTER TABLE public.profiles 
  ADD COLUMN institution text,
  ADD COLUMN research_area text,
  ADD COLUMN avatar_url text,
  ADD COLUMN bio text,
  ADD COLUMN xp_points integer DEFAULT 0,
  ADD COLUMN weekly_streak integer DEFAULT 0,
  ADD COLUMN total_prompts_copied integer DEFAULT 0,
  ADD COLUMN total_templates_copied integer DEFAULT 0;

-- Update prompts table
ALTER TABLE public.prompts 
  ADD COLUMN description text,
  ADD COLUMN difficulty_level text CHECK (difficulty_level = ANY (ARRAY['Beginner'::text, 'Intermediate'::text, 'Advanced'::text])),
  ADD COLUMN estimated_time text,
  ADD COLUMN like_count integer DEFAULT 0,
  ADD COLUMN dislike_count integer DEFAULT 0,
  ADD COLUMN created_by uuid,
  ALTER COLUMN category SET NOT NULL,
  DROP COLUMN user_id;

-- Update templates table
ALTER TABLE public.templates 
  ADD COLUMN description text,
  ADD COLUMN type text NOT NULL DEFAULT 'document',
  ADD COLUMN file_type text,
  ADD COLUMN file_size text,
  ADD COLUMN download_count integer DEFAULT 0,
  ADD COLUMN like_count integer DEFAULT 0,
  ADD COLUMN created_by uuid,
  ALTER COLUMN category SET NOT NULL,
  DROP COLUMN user_id,
  DROP COLUMN copy_count;

-- Remove the default from type column now that it's added
ALTER TABLE public.templates ALTER COLUMN type DROP DEFAULT;

-- Update user_interactions table (remove workflow_data column)
ALTER TABLE public.user_interactions DROP COLUMN IF EXISTS workflow_data;

-- Update user_workflows table - remove all workflow-specific columns
ALTER TABLE public.user_workflows 
  DROP COLUMN IF EXISTS workflow_id,
  DROP COLUMN IF EXISTS current_step,
  DROP COLUMN IF EXISTS completed_steps,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS started_at,
  DROP COLUMN IF EXISTS completed_at,
  ALTER COLUMN workflow_data SET NOT NULL;

-- Create new RLS policies with correct column references
CREATE POLICY "Users can view all prompts" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Users can create prompts" ON public.prompts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own prompts" ON public.prompts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own prompts" ON public.prompts FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can view all templates" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Users can create templates" ON public.templates FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own templates" ON public.templates FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own templates" ON public.templates FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can view their own user workflows" ON public.user_workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own user workflows" ON public.user_workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own user workflows" ON public.user_workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own user workflows" ON public.user_workflows FOR DELETE USING (auth.uid() = user_id);

-- Create new indexes for the updated schema
CREATE INDEX idx_prompts_created_by ON public.prompts(created_by);
CREATE INDEX idx_templates_created_by ON public.templates(created_by);
CREATE INDEX idx_comments_parent_comment_id ON public.comments(parent_comment_id);