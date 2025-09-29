-- Add price column to menus table
ALTER TABLE menus ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Copy existing prices from dishes to menus (if needed for data migration)
-- This is commented out as we don't have a clear mapping
-- UPDATE menus SET price = (SELECT AVG(price) FROM dishes WHERE dishes.user_id = menus.user_id);

-- Remove price column from dishes table
ALTER TABLE dishes DROP COLUMN IF EXISTS price;