-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete their own analyses" ON analyses;

-- Disable RLS temporarily to recreate policies
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with proper permissions
CREATE POLICY "Enable read access for users based on user_id" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON analyses TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
