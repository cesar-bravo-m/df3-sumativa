-- La contraseña para todos los usuarios es 'password'

DELETE FROM USERS;

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(1, 'ForumMaster42', 'forummaster@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'MODERATOR', 1);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(2, 'TechGuru2000', 'techguru@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(3, 'GameLover123', 'gamelover@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(4, 'CoffeeAddict', 'coffee@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(5, 'PixelArtist', 'pixelart@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(6, 'BookWorm87', 'bookworm@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(7, 'MusicFanatic', 'music@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(8, 'CodeNinja', 'codeninja@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(9, 'SciFiGeek', 'scifi@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'NORMAL_POSTER', 0);

INSERT INTO USERS (id, username, email, password, role, ISADMIN) VALUES 
(10, 'SuperModerator', 'supermoderator@example.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'MODERATOR', 1); 