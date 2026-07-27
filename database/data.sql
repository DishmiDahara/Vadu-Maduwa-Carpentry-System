-- WoodCraftPro Sample Seed Data Script
USE woodcraftpro_db;

-- 1. SEED ADMIN USER (Username: admin, Password: adminpassword / BCrypt hash or plain demo)
INSERT INTO users (username, password, email, full_name, role) VALUES
('admin', 'admin123', 'admin@woodcraftpro.com', 'System Administrator', 'ROLE_ADMIN');

-- 2. SEED CUSTOMERS
INSERT INTO customers (name, phone, email, address) VALUES
('Kamal Perera', '0771234567', 'kamal@gmail.com', 'No. 45, Galle Road, Colombo 03'),
('Nimali Silva', '0719876543', 'nimali.s@hotmail.com', 'No. 12, Kandy Road, Kiribathgoda'),
('Sunil Fernando', '0754443322', 'sunil.f@yahoo.com', 'Main Street, Negombo');

-- 3. SEED CATEGORIES
INSERT INTO categories (name, description, image_url) VALUES
('Beds & Bedroom', 'Custom luxury teak & mahogany wooden bed frames, nightstands, and dressers', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'),
('Dining & Kitchen', 'Solid timber dining table sets, dining chairs, and pantry cabinets', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'),
('Living Room', 'Wooden sofas, TV consoles, coffee tables, and display units', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'),
('Wardrobes & Closets', 'Fitted wall-to-wall wardrobes, sliding doors, and walk-in closets', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'),
('Doors & Windows', 'Handcrafted carved main doors, timber window frames, and louvers', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');

-- 4. SEED PRODUCTS
INSERT INTO products (category_id, product_name, description, base_price, image_url, available) VALUES
(1, 'Teak King Size Bed with Storage', 'Crafted from 100% genuine Sri Lankan Teak wood with under-bed storage drawers', 185000.00, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', true),
(1, 'Mahogany Queen Bed Frame', 'Classic carved headboard with durable matte varnish finish', 145000.00, 'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80', true),
(2, '6-Seater Teak Dining Table Set', 'Includes 1 rectangular heavy timber table and 6 ergonomic wooden chairs', 220000.00, 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', true),
(2, 'Modular Kitchen Pantry Cabinet Set', 'Custom fitted kitchen counters with soft-close drawers and granite top fitting', 350000.00, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', true),
(3, '3-Seater Cushion Wooden Sofa', 'Heavy duty Nadun timber sofa with premium fabric upholstery cushions', 165000.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', true),
(3, 'Modern Teak TV Console Unit', 'Sleek design with cable management and tempered glass cabinet doors', 85000.00, 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?auto=format&fit=crop&w=800&q=80', true),
(4, '4-Door Sliding Wardrobe with Mirror', 'Spacious interior with dedicated hanging rails, shelves, and internal lockable drawers', 280000.00, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', true),
(5, 'Carved Jackwood Main Entrance Door', 'Traditional Sri Lankan wood carving design with heavy duty frame', 125000.00, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', true);

-- 5. SEED SERVICES
INSERT INTO services (service_name, description, icon_name, image_url) VALUES
('Custom Furniture Design', 'Tailor-made beds, tables, and cabinets built to your exact space dimensions and timber choice.', 'PenTool', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'),
('Modular Kitchen Fitting', 'Complete pantry design, cabinet manufacturing, counter fitting, and installation.', 'ChefHat', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'),
('Wood Polishing & Refurbishment', 'Professional timber sanding, staining, lacquering, and antique restoration.', 'Sparkles', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80'),
('Doors, Windows & Ceiling Woodwork', 'Precision crafted entrance doors, sash windows, timber ceiling panelling, and wooden stairs.', 'Home', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');

-- 6. SEED GALLERY
INSERT INTO gallery (title, description, category, image_url, completed_date) VALUES
('Luxury Teak Bedroom Suite - Nawala Villa', 'Complete master bedroom interior with king size bed, side tables, and sliding closet.', 'Bedroom', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', '2026-05-15'),
('Open Plan Modular Pantry Kitchen - Colombo 07', 'High-end mahogany pantry cabinets with concealed lighting and breakfast bar.', 'Kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', '2026-06-02'),
('Solid Wood Dining Room Setup - Kandy Residence', '10-seater custom teak dining table with custom carved chairs.', 'Dining', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', '2026-06-20');

-- 7. SEED INQUIRIES
INSERT INTO inquiries (customer_name, customer_phone, customer_email, message, status) VALUES
('Kamal Perera', '0771234567', 'kamal@gmail.com', 'I need a quotation for a custom 4-door teak wardrobe for my master bedroom in Nawala.', 'NEW'),
('Nimali Silva', '0719876543', 'nimali.s@hotmail.com', 'Looking for pantry cabinet installation services. Can you visit site for measurement?', 'CONTACTED'),
('Sunil Fernando', '0754443322', 'sunil.f@yahoo.com', 'Do you make custom carved entrance doors in Jackwood?', 'COMPLETED');

-- 8. SEED QUOTATIONS & ITEMS
INSERT INTO quotations (quotation_number, customer_name, customer_phone, customer_email, customer_address, material_cost, labour_cost, additional_charges, total_amount, status, valid_until) VALUES
('WCP-QT-2026-001', 'Kamal Perera', '0771234567', 'kamal@gmail.com', 'No. 45, Galle Road, Colombo 03', 180000.00, 60000.00, 10000.00, 250000.00, 'ACCEPTED', '2026-08-30'),
('WCP-QT-2026-002', 'Nimali Silva', '0719876543', 'nimali.s@hotmail.com', 'No. 12, Kandy Road, Kiribathgoda', 220000.00, 80000.00, 15000.00, 315000.00, 'SENT', '2026-08-15');

INSERT INTO quotation_items (quotation_id, item_name, quantity, unit_price, total_price) VALUES
(1, '4-Door Custom Teak Wardrobe', 1, 220000.00, 220000.00),
(1, 'Mirror fitting & soft close hinges', 1, 30000.00, 30000.00),
(2, 'Modular Pantry Wall Cabinets (Teak veneer)', 1, 250000.00, 250000.00),
(2, 'Granite Countertop installation', 1, 65000.00, 65000.00);

-- 9. SEED BILLS & PAYMENTS
INSERT INTO bills (bill_number, quotation_id, customer_name, total_amount, paid_amount, balance_amount, status, due_date) VALUES
('WCP-INV-2026-001', 1, 'Kamal Perera', 250000.00, 100000.00, 150000.00, 'PARTIAL', '2026-09-01');

INSERT INTO payments (bill_id, receipt_number, amount, payment_method, notes) VALUES
(1, 'REC-2026-001', 100000.00, 'BANK_TRANSFER', 'Advance payment for Wardrobe order');
