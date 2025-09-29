-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create establishments table
CREATE TABLE IF NOT EXISTS establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for establishments and menus (many-to-many)
CREATE TABLE IF NOT EXISTS establishment_menus (
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (establishment_id, menu_id)
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for menus and dishes (many-to-many)
CREATE TABLE IF NOT EXISTS menu_dishes (
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  position INTEGER, -- for ordering dishes in menu
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (menu_id, dish_id)
);

-- Create unit_types enum for ingredients
DO $$ BEGIN
  CREATE TYPE unit_type AS ENUM ('gram', 'kilogram', 'piece', 'liter', 'milliliter', 'tablespoon', 'teaspoon', 'cup');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit unit_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for dishes and ingredients (many-to-many with quantity)
CREATE TABLE IF NOT EXISTS dish_ingredients (
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (dish_id, ingredient_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_establishments_user_id ON establishments(user_id);
CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_dishes_user_id ON dishes(user_id);
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX idx_establishment_menus_establishment_id ON establishment_menus(establishment_id);
CREATE INDEX idx_establishment_menus_menu_id ON establishment_menus(menu_id);
CREATE INDEX idx_menu_dishes_menu_id ON menu_dishes(menu_id);
CREATE INDEX idx_menu_dishes_dish_id ON menu_dishes(dish_id);
CREATE INDEX idx_dish_ingredients_dish_id ON dish_ingredients(dish_id);
CREATE INDEX idx_dish_ingredients_ingredient_id ON dish_ingredients(ingredient_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for establishments
CREATE POLICY "Users can view their own establishments" ON establishments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own establishments" ON establishments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own establishments" ON establishments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own establishments" ON establishments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for menus
CREATE POLICY "Users can view their own menus" ON menus
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own menus" ON menus
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own menus" ON menus
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own menus" ON menus
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for establishment_menus (users can only link their own data)
CREATE POLICY "Users can view their establishment-menu links" ON establishment_menus
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM establishments WHERE id = establishment_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert their establishment-menu links" ON establishment_menus
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM establishments WHERE id = establishment_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their establishment-menu links" ON establishment_menus
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM establishments WHERE id = establishment_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
  );

-- RLS Policies for dishes
CREATE POLICY "Users can view their own dishes" ON dishes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own dishes" ON dishes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dishes" ON dishes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dishes" ON dishes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for menu_dishes
CREATE POLICY "Users can view their menu-dish links" ON menu_dishes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert their menu-dish links" ON menu_dishes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update their menu-dish links" ON menu_dishes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their menu-dish links" ON menu_dishes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
  );

-- RLS Policies for ingredients
CREATE POLICY "Users can view their own ingredients" ON ingredients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ingredients" ON ingredients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ingredients" ON ingredients
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ingredients" ON ingredients
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for dish_ingredients
CREATE POLICY "Users can view their dish-ingredient links" ON dish_ingredients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM ingredients WHERE id = ingredient_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert their dish-ingredient links" ON dish_ingredients
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM ingredients WHERE id = ingredient_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update their dish-ingredient links" ON dish_ingredients
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM ingredients WHERE id = ingredient_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their dish-ingredient links" ON dish_ingredients
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM dishes WHERE id = dish_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM ingredients WHERE id = ingredient_id AND user_id = auth.uid())
  );

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON establishments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();