-- Inserts a default admin user
INSERT INTO users (email, password, role) 
VALUES (
  'admin@hotel.com', 
  '$2a$10$xVCH4IA5wG42aEdVQokzU.12tgVLp1q4D2uA6ZPqMeOVX8b0/4Q6q', 
  'ADMIN'
);