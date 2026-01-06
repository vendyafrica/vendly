-- Shoe Store Seed Data for Shoemart
-- Run this script in your Neon database SQL editor

-- First, create/update the tenant
INSERT INTO tenants (id, slug, status, created_at, updated_at) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'shoemart',
  'ready',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET 
  status = 'ready',
  updated_at = NOW();

-- Create the store
INSERT INTO stores (id, tenant_id, name, slug, description, logo_url, status, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  (SELECT id FROM tenants WHERE slug = 'shoemart'),
  'ShoeMart',
  'shoemart',
  'Your one-stop shop for quality footwear. From sneakers to formal shoes, we''ve got you covered.',
  'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=64&h=64&fit=crop&crop=face',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Create categories
INSERT INTO categories (id, store_id, name, slug, image_url, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Sneakers', 'sneakers', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Running', 'running', 'https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=300&fit=crop', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Formal', 'formal', 'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=300&fit=crop', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Sports', 'sports', 'https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=300&fit=crop', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Outdoor', 'outdoor', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Casual', 'casual', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=300&fit=crop', NOW(), NOW())
ON CONFLICT (store_id, slug) DO NOTHING;

-- Create products
INSERT INTO products (id, store_id, title, description, price_amount, currency, status, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440009'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Air Max 90 Sneakers', 'Classic running shoes with visible Air cushioning for ultimate comfort.', 12000, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Leather Derby Shoes', 'Formal leather derby shoes perfect for business meetings and special occasions.', 18000, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440011'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Ultra Boost Running Shoes', 'High-performance running shoes with responsive cushioning for athletes.', 14000, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440012'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Canvas High-Tops', 'Stylish canvas high-top sneakers for casual everyday wear.', 6500, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440013'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Hiking Boots Waterproof', 'Durable waterproof hiking boots with excellent grip for outdoor adventures.', 11000, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440014'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Basketball High-Tops', 'Professional basketball shoes with ankle support and superior traction.', 13000, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440015'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Loafers Classic', 'Comfortable leather loafers perfect for smart-casual occasions.', 9500, 'USD', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440016'::uuid, (SELECT id FROM stores WHERE slug = 'shoemart'), 'Training Shoes', 'Versatile training shoes designed for gym workouts and cross-training.', 8500, 'USD', 'active', NOW(), NOW())
ON CONFLICT (store_id, title) DO NOTHING;

-- Create product images
INSERT INTO product_images (id, product_id, url, sort_order, created_at) VALUES
  -- Air Max 90
  ('550e8400-e29b-41d4-a716-446655440017'::uuid, (SELECT id FROM products WHERE title = 'Air Max 90 Sneakers' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440018'::uuid, (SELECT id FROM products WHERE title = 'Air Max 90 Sneakers' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Leather Derby
  ('550e8400-e29b-41d4-a716-446655440019'::uuid, (SELECT id FROM products WHERE title = 'Leather Derby Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440020'::uuid, (SELECT id FROM products WHERE title = 'Leather Derby Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Ultra Boost
  ('550e8400-e29b-41d4-a716-446655440021'::uuid, (SELECT id FROM products WHERE title = 'Ultra Boost Running Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440022'::uuid, (SELECT id FROM products WHERE title = 'Ultra Boost Running Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Canvas High-Tops
  ('550e8400-e29b-41d4-a716-446655440023'::uuid, (SELECT id FROM products WHERE title = 'Canvas High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440024'::uuid, (SELECT id FROM products WHERE title = 'Canvas High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Hiking Boots
  ('550e8400-e29b-41d4-a716-446655440025'::uuid, (SELECT id FROM products WHERE title = 'Hiking Boots Waterproof' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440026'::uuid, (SELECT id FROM products WHERE title = 'Hiking Boots Waterproof' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Basketball High-Tops
  ('550e8400-e29b-41d4-a716-446655440027'::uuid, (SELECT id FROM products WHERE title = 'Basketball High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440028'::uuid, (SELECT id FROM products WHERE title = 'Basketball High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Loafers Classic
  ('550e8400-e29b-41d4-a716-446655440029'::uuid, (SELECT id FROM products WHERE title = 'Loafers Classic' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440030'::uuid, (SELECT id FROM products WHERE title = 'Loafers Classic' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW()),
  
  -- Training Shoes
  ('550e8400-e29b-41d4-a716-446655440031'::uuid, (SELECT id FROM products WHERE title = 'Training Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop', 0, NOW()),
  ('550e8400-e29b-41d4-a716-446655440032'::uuid, (SELECT id FROM products WHERE title = 'Training Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 'https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800', 1, NOW())
ON CONFLICT DO NOTHING;

-- Link products to categories
INSERT INTO product_categories (product_id, category_id) VALUES
  -- Air Max 90 -> Sneakers
  ((SELECT id FROM products WHERE title = 'Air Max 90 Sneakers' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'sneakers' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Leather Derby -> Formal
  ((SELECT id FROM products WHERE title = 'Leather Derby Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'formal' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Ultra Boost -> Running
  ((SELECT id FROM products WHERE title = 'Ultra Boost Running Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'running' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Canvas High-Tops -> Casual
  ((SELECT id FROM products WHERE title = 'Canvas High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'casual' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Hiking Boots -> Outdoor
  ((SELECT id FROM products WHERE title = 'Hiking Boots Waterproof' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'outdoor' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Basketball High-Tops -> Sports
  ((SELECT id FROM products WHERE title = 'Basketball High-Tops' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'sports' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Loafers Classic -> Formal
  ((SELECT id FROM products WHERE title = 'Loafers Classic' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'formal' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart'))),
  
  -- Training Shoes -> Sports
  ((SELECT id FROM products WHERE title = 'Training Shoes' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')), 
   (SELECT id FROM categories WHERE slug = 'sports' AND store_id = (SELECT id FROM stores WHERE slug = 'shoemart')))
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 
  t.slug as tenant_slug,
  t.status as tenant_status,
  s.name as store_name,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT c.id) as category_count
FROM tenants t
LEFT JOIN stores s ON t.id = s.tenant_id
LEFT JOIN products p ON s.id = p.store_id
LEFT JOIN categories c ON s.id = c.store_id
WHERE t.slug = 'shoemart'
GROUP BY t.slug, t.status, s.name;
