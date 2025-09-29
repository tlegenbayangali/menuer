-- Fix: Add INSERT policy for profiles table
-- The trigger needs to be able to insert into profiles table

CREATE POLICY "Allow profile creation on signup" ON profiles
  FOR INSERT WITH CHECK (true);

-- Also ensure the function has proper permissions
-- Recreate function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Could not create profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;