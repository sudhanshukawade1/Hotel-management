INSERT INTO room (room_number, type, price_per_night, is_available)
SELECT '101', 'Single', 50.0, 1
WHERE NOT EXISTS (SELECT 1 FROM room WHERE room_number = '101');

INSERT INTO room (room_number, type, price_per_night, is_available)
SELECT '102', 'Double', 80.0, 1
WHERE NOT EXISTS (SELECT 1 FROM room WHERE room_number = '102');

INSERT INTO room (room_number, type, price_per_night, is_available)
SELECT '201', 'Suite', 150.0, 1
WHERE NOT EXISTS (SELECT 1 FROM room WHERE room_number = '201');