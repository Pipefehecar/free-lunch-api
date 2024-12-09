-- Limpiar tablas y restablecer secuencias
TRUNCATE TABLE recipe_ingredients CASCADE;
TRUNCATE TABLE recipes CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Restablecer las secuencias
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;

-- Insertar ingredientes
INSERT INTO ingredients (name, "createdAt", "updatedAt") VALUES
  ('Tomate', NOW(), NOW()),
  ('Cebolla', NOW(), NOW()),
  ('Ajo', NOW(), NOW()),
  ('Pechuga de pollo', NOW(), NOW()),
  ('Arroz', NOW(), NOW()),
  ('Aceite de oliva', NOW(), NOW()),
  ('Sal', NOW(), NOW()),
  ('Pimienta', NOW(), NOW()),
  ('Zanahoria', NOW(), NOW()),
  ('Papa', NOW(), NOW()),
  ('Carne molida', NOW(), NOW()),
  ('Pasta', NOW(), NOW()),
  ('Queso mozzarella', NOW(), NOW()),
  ('Albahaca', NOW(), NOW()),
  ('Pimiento', NOW(), NOW());

-- Insertar recetas
INSERT INTO recipes (name, "createdAt", "updatedAt") VALUES
  ('Pollo al horno', NOW(), NOW()),
  ('Pasta Bolognesa', NOW(), NOW()),
  ('Pizza Margherita', NOW(), NOW()),
  ('Arroz con pollo', NOW(), NOW()),
  ('Sopa de verduras', NOW(), NOW());

-- Asociar ingredientes a recetas
INSERT INTO recipe_ingredients ("recipeId", "ingredientId", quantity, unit) VALUES
-- Pollo al horno (id: 1)
  (1, 4, 1, 'UNIT'),        -- 1 pechuga de pollo
  (1, 6, 30, 'MILLILITER'), -- 30ml aceite de oliva
  (1, 7, 5, 'GRAM'),        -- 5g sal
  (1, 8, 3, 'GRAM'),        -- 3g pimienta

-- Pasta Bolognesa (id: 2)
  (2, 11, 500, 'GRAM'),     -- 500g carne molida
  (2, 12, 400, 'GRAM'),     -- 400g pasta
  (2, 1, 4, 'UNIT'),        -- 4 tomates
  (2, 2, 1, 'UNIT'),        -- 1 cebolla
  (2, 3, 2, 'UNIT'),        -- 2 dientes de ajo

-- Pizza Margherita (id: 3)
  (3, 1, 2, 'UNIT'),        -- 2 tomates
  (3, 13, 200, 'GRAM'),     -- 200g queso mozzarella
  (3, 14, 10, 'GRAM'),      -- 10g albahaca
  (3, 6, 20, 'MILLILITER'), -- 20ml aceite de oliva

-- Arroz con pollo (id: 4)
  (4, 5, 400, 'GRAM'),      -- 400g arroz
  (4, 4, 2, 'UNIT'),        -- 2 pechugas de pollo
  (4, 9, 2, 'UNIT'),        -- 2 zanahorias
  (4, 15, 1, 'UNIT'),       -- 1 pimiento

-- Sopa de verduras (id: 5)
  (5, 9, 2, 'UNIT'),        -- 2 zanahorias
  (5, 10, 2, 'UNIT'),       -- 2 papas
  (5, 2, 1, 'UNIT'),        -- 1 cebolla
  (5, 1, 2, 'UNIT'),        -- 2 tomates
  (5, 7, 5, 'GRAM');        -- 5g sal