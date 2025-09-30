-- Add Lasagna dish with ingredients
-- Note: This migration assumes you have a user_id. Replace 'YOUR_USER_ID' with actual user ID or run through application

DO $$
DECLARE
  v_dish_id uuid;
  v_user_id uuid;

  -- Ingredient IDs
  v_ing_pasta_sheets uuid;
  v_ing_ground_beef uuid;
  v_ing_onion uuid;
  v_ing_carrot uuid;
  v_ing_tomato_sauce uuid;
  v_ing_tomato_paste uuid;
  v_ing_butter uuid;
  v_ing_flour uuid;
  v_ing_milk uuid;
  v_ing_parmesan uuid;
  v_ing_nutmeg uuid;
  v_ing_salt uuid;
  v_ing_pepper uuid;
BEGIN
  -- Get first user (or replace with specific user_id)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No user found. Please create a user first.';
    RETURN;
  END IF;

  -- Create or get ingredients (check if exists first)
  SELECT id INTO v_ing_pasta_sheets FROM ingredients WHERE name = 'Листы для лазаньи' AND user_id = v_user_id;
  IF v_ing_pasta_sheets IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Листы для лазаньи', 'gram', v_user_id) RETURNING id INTO v_ing_pasta_sheets;
  END IF;

  SELECT id INTO v_ing_ground_beef FROM ingredients WHERE name = 'Фарш говяжий' AND user_id = v_user_id;
  IF v_ing_ground_beef IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Фарш говяжий', 'gram', v_user_id) RETURNING id INTO v_ing_ground_beef;
  END IF;

  SELECT id INTO v_ing_onion FROM ingredients WHERE name = 'Лук репчатый' AND user_id = v_user_id;
  IF v_ing_onion IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Лук репчатый', 'piece', v_user_id) RETURNING id INTO v_ing_onion;
  END IF;

  SELECT id INTO v_ing_carrot FROM ingredients WHERE name = 'Морковь' AND user_id = v_user_id;
  IF v_ing_carrot IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Морковь', 'piece', v_user_id) RETURNING id INTO v_ing_carrot;
  END IF;

  SELECT id INTO v_ing_tomato_sauce FROM ingredients WHERE name = 'Томатный соус' AND user_id = v_user_id;
  IF v_ing_tomato_sauce IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Томатный соус', 'gram', v_user_id) RETURNING id INTO v_ing_tomato_sauce;
  END IF;

  SELECT id INTO v_ing_tomato_paste FROM ingredients WHERE name = 'Томатная паста' AND user_id = v_user_id;
  IF v_ing_tomato_paste IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Томатная паста', 'gram', v_user_id) RETURNING id INTO v_ing_tomato_paste;
  END IF;

  SELECT id INTO v_ing_butter FROM ingredients WHERE name = 'Масло сливочное' AND user_id = v_user_id;
  IF v_ing_butter IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Масло сливочное', 'gram', v_user_id) RETURNING id INTO v_ing_butter;
  END IF;

  SELECT id INTO v_ing_flour FROM ingredients WHERE name = 'Мука' AND user_id = v_user_id;
  IF v_ing_flour IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Мука', 'gram', v_user_id) RETURNING id INTO v_ing_flour;
  END IF;

  SELECT id INTO v_ing_milk FROM ingredients WHERE name = 'Молоко' AND user_id = v_user_id;
  IF v_ing_milk IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Молоко', 'milliliter', v_user_id) RETURNING id INTO v_ing_milk;
  END IF;

  SELECT id INTO v_ing_parmesan FROM ingredients WHERE name = 'Сыр пармезан' AND user_id = v_user_id;
  IF v_ing_parmesan IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Сыр пармезан', 'gram', v_user_id) RETURNING id INTO v_ing_parmesan;
  END IF;

  SELECT id INTO v_ing_nutmeg FROM ingredients WHERE name = 'Мускатный орех' AND user_id = v_user_id;
  IF v_ing_nutmeg IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Мускатный орех', 'teaspoon', v_user_id) RETURNING id INTO v_ing_nutmeg;
  END IF;

  SELECT id INTO v_ing_salt FROM ingredients WHERE name = 'Соль' AND user_id = v_user_id;
  IF v_ing_salt IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Соль', 'teaspoon', v_user_id) RETURNING id INTO v_ing_salt;
  END IF;

  SELECT id INTO v_ing_pepper FROM ingredients WHERE name = 'Перец молотый' AND user_id = v_user_id;
  IF v_ing_pepper IS NULL THEN
    INSERT INTO ingredients (name, unit, user_id) VALUES ('Перец молотый', 'teaspoon', v_user_id) RETURNING id INTO v_ing_pepper;
  END IF;

  -- Create Lasagna dish
  INSERT INTO dishes (name, description, user_id)
  VALUES (
    'Лазанья',
    'Классическая итальянская лазанья с мясным фаршем, соусом бешамель и сыром пармезан. Сочетание нежных слоев пасты, ароматного мясного соуса и нежного сырного вкуса создает идеальное блюдо для всей семьи.',
    v_user_id
  )
  RETURNING id INTO v_dish_id;

  -- Link ingredients to dish (unit is stored in ingredients table)
  INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity)
  VALUES
    (v_dish_id, v_ing_pasta_sheets, 250),
    (v_dish_id, v_ing_ground_beef, 450),
    (v_dish_id, v_ing_onion, 1),
    (v_dish_id, v_ing_carrot, 1),
    (v_dish_id, v_ing_tomato_sauce, 60),
    (v_dish_id, v_ing_tomato_paste, 60),
    (v_dish_id, v_ing_butter, 90),
    (v_dish_id, v_ing_flour, 60),
    (v_dish_id, v_ing_milk, 800),
    (v_dish_id, v_ing_parmesan, 120),
    (v_dish_id, v_ing_nutmeg, 1),
    (v_dish_id, v_ing_salt, 2),
    (v_dish_id, v_ing_pepper, 1);

  RAISE NOTICE 'Successfully added Lasagna dish with 13 ingredients';
END $$;