-- Limpiar tablas y restablecer secuencias
TRUNCATE TABLE recipe_ingredients CASCADE;
TRUNCATE TABLE recipes CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Restablecer las secuencias
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;

-- Insertar ingredientes
INSERT INTO ingredients (name, "createdAt", "updatedAt") VALUES
  ('Tomato', NOW(), NOW()),
  ('Lemon', NOW(), NOW()),
  ('Potato', NOW(), NOW()),
  ('Rice', NOW(), NOW()),
  ('Ketchup', NOW(), NOW()),
  ('Lettuce', NOW(), NOW()),
  ('Onion', NOW(), NOW()),
  ('Cheese', NOW(), NOW()),
  ('Meat', NOW(), NOW()),
  ('Chicken', NOW(), NOW());

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
  (1, 10, 1, 'UNIT'),        -- 1 chicken
  (1, 2, 1, 'UNIT'),         -- 1 lemon
  (1, 7, 1, 'UNIT'),         -- 1 onion
  (1, 6, 50, 'MILLILITER'),  -- 50ml ketchup

-- Pasta Bolognesa (id: 2)
  (2, 9, 500, 'GRAM'),       -- 500g meat
  (2, 4, 300, 'GRAM'),       -- 300g rice
  (2, 1, 3, 'UNIT'),         -- 3 tomatoes
  (2, 7, 1, 'UNIT'),         -- 1 onion
  (2, 6, 30, 'MILLILITER'),  -- 30ml ketchup

-- Pizza Margherita (id: 3)
  (3, 1, 2, 'UNIT'),         -- 2 tomatoes
  (3, 8, 200, 'GRAM'),       -- 200g cheese
  (3, 6, 50, 'GRAM'),        -- 50g lettuce

-- Arroz con pollo (id: 4)
  (4, 4, 400, 'GRAM'),       -- 400g rice
  (4, 10, 2, 'UNIT'),        -- 2 chicken
  (4, 3, 2, 'UNIT'),         -- 2 potatoes
  (4, 2, 1, 'UNIT'),         -- 1 lemon

-- Sopa de verduras (id: 5)
  (5, 3, 3, 'UNIT'),         -- 3 potatoes
  (5, 7, 1, 'UNIT'),         -- 1 onion
  (5, 1, 2, 'UNIT'),         -- 2 tomatoes
  (5, 2, 1, 'UNIT'),         -- 1 lemon,
  (5, 6, 20, 'GRAM');        -- 20g lettuce
