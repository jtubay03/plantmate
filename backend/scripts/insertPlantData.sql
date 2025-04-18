-- Seed data script for plant_catalog table

-- 1. European Silver Fir
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (1, 'European Silver Fir', 'Abies alba', 'A majestic coniferous tree native to the mountainous regions of Europe, known for its silver-gray bark and symmetrical pyramidal shape.', 'medium', 'Part shade to full sun', 'Keep soil moist but not soggy; water deeply once weekly', '40-75°F (4-24°C)', 'Prefers moderate humidity', TRUE, 'https://example.com/images/european_silver_fir.jpg');

-- 2. Monstera Deliciosa
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (2, 'Swiss Cheese Plant', 'Monstera deliciosa', 'A popular tropical houseplant known for its large, glossy, perforated leaves and ease of care.', 'easy', 'Bright indirect light', 'Water when top 1-2 inches of soil is dry, typically every 1-2 weeks', '65-85°F (18-30°C)', 'Moderate to high humidity preferred', FALSE, 'https://example.com/images/monstera.jpg');

-- 3. Snake Plant
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (3, 'Snake Plant', 'Sansevieria trifasciata', 'A hardy succulent with stiff, upright leaves, perfect for beginners and known for air purifying qualities.', 'easy', 'Low light to bright indirect light', 'Allow soil to dry completely between waterings, typically every 2-8 weeks', '60-85°F (15-29°C)', 'Tolerant of low humidity', FALSE, 'https://example.com/images/snake_plant.jpg');

-- 4. Peace Lily
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (4, 'Peace Lily', 'Spathiphyllum wallisii', 'An elegant flowering houseplant with glossy leaves and white spathes, known for air purification.', 'easy', 'Low to medium indirect light', 'Keep soil consistently moist; water when top inch of soil is dry', '65-80°F (18-27°C)', 'Prefers high humidity', FALSE, 'https://example.com/images/peace_lily.jpg');

-- 5. Fiddle Leaf Fig
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (5, 'Fiddle Leaf Fig', 'Ficus lyrata', 'A popular indoor tree with large, violin-shaped leaves that adds a dramatic touch to any space.', 'hard', 'Bright, filtered light', 'Water when top 2 inches of soil are dry; typically every 7-10 days', '65-75°F (18-24°C)', 'Moderate to high humidity', TRUE, 'https://example.com/images/fiddle_leaf_fig.jpg');

-- 6. Boston Fern
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (6, 'Boston Fern', 'Nephrolepis exaltata', 'A classic fern with arching fronds that's perfect for hanging baskets and known for air purification.', 'medium', 'Medium to bright indirect light', 'Keep soil consistently moist; water when top surface begins to dry', '60-75°F (15-24°C)', 'Requires high humidity', TRUE, 'https://example.com/images/boston_fern.jpg');

-- 7. Aloe Vera
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (7, 'Aloe Vera', 'Aloe barbadensis miller', 'A succulent with medicinal properties, storing water in its thick, pointed leaves.', 'easy', 'Bright, indirect sunlight', 'Water deeply but infrequently, allowing soil to dry completely between waterings', '55-80°F (13-27°C)', 'Prefers low humidity', FALSE, 'https://example.com/images/aloe_vera.jpg');

-- 8. Orchid (Phalaenopsis)
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (8, 'Moth Orchid', 'Phalaenopsis spp.', 'A popular flowering houseplant with long-lasting blooms and aerial roots.', 'medium', 'Bright, indirect light', 'Water thoroughly when potting medium is nearly dry, typically every 7-10 days', '65-80°F (18-27°C)', 'Moderate to high humidity', TRUE, 'https://example.com/images/moth_orchid.jpg');

-- 9. ZZ Plant
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (9, 'ZZ Plant', 'Zamioculcas zamiifolia', 'An extremely durable houseplant with glossy, dark green leaves that can tolerate neglect.', 'easy', 'Low to bright indirect light', 'Allow soil to dry completely between waterings, typically every 2-3 weeks', '65-79°F (18-26°C)', 'Tolerant of low humidity', FALSE, 'https://example.com/images/zz_plant.jpg');

-- 10. Japanese Maple
INSERT INTO plant_catalog (id, common_name, scientific_name, description, care_difficulty, light_requirements, water_frequency, temperature_range, humidity_needs, pet_friendly, image_url)
VALUES (10, 'Japanese Maple', 'Acer palmatum', 'A small, deciduous tree with delicate, palmate leaves that turn vibrant colors in fall.', 'hard', 'Partial shade to full sun, depending on variety', 'Consistent moisture, especially when young; weekly deep watering', '20-85°F (-6-29°C)', 'Prefers moderate humidity', TRUE, 'https://example.com/images/japanese_maple.jpg');