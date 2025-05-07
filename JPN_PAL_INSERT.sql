-- insert into JPN_AUTHOR
INSERT INTO JPN_AUTHOR (A_FNAME, A_LNAME, A_STREET, A_CITY, A_STATE, A_COUNTRY, A_ZIPCODE, A_EMAIL)
VALUES
('Mark', 'Twain', '123 Elm St', 'Hartford', 'CT', 'USA', '06103', 'mark.twain@gmail.com'),
('Ernest', 'Hemingway', '456 Oak Ave', 'Key West', 'FL', 'USA', '33040', 'ernest.hemingway@yahoo.com'),
('F. Scott', 'Fitzgerald', '789 Maple Rd', 'Saint Paul', 'MN', 'USA', '55101', 'f.scott@gmail.com'),
('Harper', 'Lee', '321 Pine St', 'Monroeville', 'AL', 'USA', '36460', 'harper.lee@gmail.com'),
('John', 'Steinbeck', '654 Birch Blvd', 'Salinas', 'CA', 'USA', '93901', 'john.steinbeck@yahoo.com'),
('Toni', 'Morrison', '987 Cedar Ln', 'Lorain', 'OH', 'USA', '44052', 'toni.morrison@gmail.com'),
('J.D.', 'Salinger', '147 Spruce Ct', 'New York', 'NY', 'USA', '10001', 'jd.salinger@gmail.com'),
('George', 'Orwell', '258 Aspen Way', 'Cambridge', 'MA', 'USA', '02139', 'george.orwell@yahoo.com'),
('Jane', 'Austen', '369 Poplar Dr', 'Winchester', 'MA', 'USA', '01890', 'jane.austen@gmail.com'),
('Virginia', 'Woolf', '159 Cherry Cir', 'New York', 'NY', 'USA', '10005', 'virginia.woolf@yahoo.com'),
('Edgar Allan', 'Poe', '12 Raven St', 'Boston', 'MA', 'USA', '02118', 'edgar.poe@gmail.com'),
('Ray', 'Bradbury', '34 Dune Rd', 'Los Angeles', 'CA', 'USA', '90001', 'ray.bradbury@yahoo.com'),
('Kurt', 'Vonnegut', '56 Cat\'s Cradle Ln', 'Indianapolis', 'IN', 'USA', '46201', 'kurt.vonnegut@gmail.com'),
('Truman', 'Capote', '78 Breakfast Blvd', 'New Orleans', 'LA', 'USA', '70112', 'truman.capote@yahoo.com'),
('Sylvia', 'Plath', '90 Bell Jar Ave', 'Boston', 'MA', 'USA', '02115', 'sylvia.plath@gmail.com'),
('James', 'Baldwin', '101 Go Tell Ln', 'New York', 'NY', 'USA', '10010', 'james.baldwin@yahoo.com'),
('E.L.', 'James', '112 Fifty Shades Dr', 'Chicago', 'IL', 'USA', '60601', 'el.james@gmail.com'),
('Stephen', 'King', '123 Horror St', 'Bangor', 'ME', 'USA', '04401', 'stephen.king@yahoo.com'),
('Agatha', 'Christie', '134 Mystery Rd', 'New York', 'NY', 'USA', '10011', 'agatha.christie@gmail.com'),
('Arthur', 'Miller', '145 Salesman Ave', 'Detroit', 'MI', 'USA', '48201', 'arthur.miller@yahoo.com'),
('William', 'Faulkner', '156 Fury Blvd', 'Oxford', 'MS', 'USA', '38655', 'william.faulkner@gmail.com'),
('Margaret', 'Atwood', '167 Handmaid Ln', 'San Francisco', 'CA', 'USA', '94101', 'margaret.atwood@yahoo.com'),
('Cormac', 'McCarthy', '178 Roadwork Dr', 'El Paso', 'TX', 'USA', '79901', 'cormac.mccarthy@gmail.com'),
('Zora', 'Hurston', '189 Watching Rd', 'Tampa', 'FL', 'USA', '33602', 'zora.hurston@yahoo.com'),
('Ralph', 'Ellison', '190 Invisible Man Rd', 'Detroit', 'MI', 'USA', '48202', 'ralph.ellison@gmail.com');

-- insert into JPN_TOPIC
INSERT INTO JPN_TOPIC (T_NAME)
VALUES
('History'),
('Children'),
('Science'),
('Arts'),
('Travel'),
('Adventures'),
('Drama'),
('Technology'),
('Cooking'),
('Philosophy'),
('Mystery'),
('Romance'),
('Biography'),
('Fiction'),
('Poetry'),
('Non-Fiction'),
('Thriller'),
('Fantasy'),
('Self-Help'),
('Comics'),
('Horror'),
('Western'),
('Satire'),
('Cyberpunk'),
('Memoir');

-- insert into JPN_CUSTOMER
INSERT INTO JPN_CUSTOMER (CUST_FNAME, CUST_LNAME, CUST_PHONE, CUST_EMAIL, CUST_UID_TYPE, CUST_UID_NO)
VALUES
('Bruce', 'Lee', '2125550001', 'bruce.lee@gmail.com', 'PASSPORT', 'P123456'),
('Tom', 'Cruise', '3105550002', 'tom.cruise@yahoo.com', 'SSN', '123-45-6789'),
('Angelina', 'Jolie', '2135550003', 'angelina.jolie@gmail.com', 'DRIVER LICENSE', 'D7654321'),
('Brad', 'Pitt', '3235550004', 'brad.pitt@gmail.com', 'PASSPORT', 'P234567'),
('Meryl', 'Streep', '4155550005', 'meryl.streep@yahoo.com', 'SSN', '234-56-7890'),
('Johnny', 'Depp', '5165550006', 'johnny.depp@gmail.com', 'DRIVER LICENSE', 'D3456789'),
('Scarlett', 'Johansson', '6175550007', 'scarlett.j@gmail.com', 'PASSPORT', 'P345678'),
('Will', 'Smith', '7185550008', 'will.smith@yahoo.com', 'SSN', '345-67-8901'),
('Jennifer', 'Lawrence', '8195550009', 'jennifer.lawrence@gmail.com', 'DRIVER LICENSE', 'D4567890'),
('George', 'Clooney', '9205550010', 'george.clooney@gmail.com', 'PASSPORT', 'P456789'),
('Morgan', 'Freeman', '2125550011', 'morgan.freeman@yahoo.com', 'SSN', '456-78-9012'),
('Emma', 'Stone', '3105550012', 'emma.stone@gmail.com', 'DRIVER LICENSE', 'D5678901'),
('Denzel', 'Washington', '2135550013', 'denzel.washington@yahoo.com', 'PASSPORT', 'P567890'),
('Natalie', 'Portman', '3235550014', 'natalie.portman@gmail.com', 'SSN', '567-89-0123'),
('Leonardo', 'DiCaprio', '4155550015', 'leonardo.dicaprio@yahoo.com', 'DRIVER LICENSE', 'D6789012'),
('Robert', 'Downey', '5165550016', 'robert.downey@gmail.com', 'PASSPORT', 'P678901'),
('Chris', 'Hemsworth', '6175550017', 'chris.hemsworth@yahoo.com', 'SSN', '678-90-1234'),
('Samuel', 'Jackson', '7185550018', 'samuel.jackson@gmail.com', 'DRIVER LICENSE', 'D7890123'),
('Hugh', 'Jackman', '8195550019', 'hugh.jackman@yahoo.com', 'PASSPORT', 'P789012'),
('Nicole', 'Kidman', '9205550020', 'nicole.kidman@gmail.com', 'SSN', '789-01-2345'),
('Kate', 'Winslet', '2125550021', 'kate.winslet@yahoo.com', 'DRIVER LICENSE', 'D8901234'),
('Sandra', 'Bullock', '3105550022', 'sandra.bullock@gmail.com', 'PASSPORT', 'P890123'),
('Julia', 'Roberts', '2135550023', 'julia.roberts@yahoo.com', 'SSN', '890-12-3456'),
('Keanu', 'Reeves', '3235550024', 'keanu.reeves@gmail.com', 'DRIVER LICENSE', 'D9012345'),
('Matt', 'Damon', '4155550025', 'matt.damon@yahoo.com', 'PASSPORT', 'P901234'),
('Ben', 'Affleck', '5165550026', 'ben.affleck@gmail.com', 'SSN', '901-23-4567'),
('Angelina', NULL, '6175550027', 'angelina@gmail.com', 'DRIVER LICENSE', 'D0123456'),
('Johnny', NULL, '7185550028', 'johnny@gmail.com', 'PASSPORT', 'P012345'),
('Beyonce', 'Knowles', '8195550029', 'beyonce.knowles@yahoo.com', 'SSN', '012-34-5678'),
('Rihanna', 'Fenty', '9205550030', 'rihanna.fenty@gmail.com', 'DRIVER LICENSE', 'D1234567');

-- insert into JPN_ROOM
INSERT INTO JPN_ROOM (ROOM_ID, ROOM_CAPACITY)
VALUES
(101, 30),
(102, 10),
(103, 20),
(201, 25),
(202, 30),
(203, 15),
(204, 40),
(301, 35),
(302, 20),
(303, 25),
(304, 30),
(305, 18),
(401, 22),
(402, 28),
(403, 33),
(404, 35),
(405, 40),
(501, 45),
(502, 20),
(503, 15),
(504, 30),
(505, 25),
(601, 50),
(602, 30),
(603, 40);

-- insert into JPN_SPONSOR
INSERT INTO JPN_SPONSOR (SP_FNAME, SP_LNAME, SP_TYPE)
VALUES
('Tom', 'Hanks', 'I'),
('Oprah', 'Winfrey', 'I'),
('Leonardo', 'DiCaprio', 'I'),
('Denzel', 'Washington', 'I'),
('Meryl', 'Streep', 'I'),
('Will', 'Smith', 'I'),
('Angelina', 'Jolie', 'I'),
('Robert', 'Downey', 'I'),
('Jennifer', 'Lawrence', 'I'),
('Johnny', 'Depp', 'I'),
('Paramount Pictures', NULL, 'O'),
('Warner Bros', NULL, 'O'),
('Universal Studios', NULL, 'O'),
('20th Century Fox', NULL, 'O'),
('Sony Pictures', NULL, 'O'),
('MGM Studios', NULL, 'O'),
('Disney', NULL, 'O'),
('Netflix', NULL, 'O'),
('Amazon Studios', NULL, 'O'),
('Lionsgate', NULL, 'O');

-- insert into JPN_SEMINAR
CALL SP_INSERT_JPN_SEMINAR_EVENT('Modern American Literature', '2025-08-01 09:00:00', '2025-08-01 12:00:00', 14, 'Harper', 'Lee');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Exploring Mystery Novels', '2025-08-02 10:00:00', '2025-08-02 13:00:00', 11, 'Agatha', 'Christie');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Poetry and Its Impact', '2025-08-03 11:00:00', '2025-08-03 14:00:00', 15, 'Maya', 'Angelou');
CALL SP_INSERT_JPN_SEMINAR_EVENT('The Science of Cooking', '2025-08-04 12:00:00', '2025-08-04 15:00:00', 9, 'Alton', 'Brown');
CALL SP_INSERT_JPN_SEMINAR_EVENT('History Revisited', '2025-08-05 13:00:00', '2025-08-05 16:00:00', 1, 'David', 'McCullough');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Contemporary Fiction Trends', '2025-08-06 09:00:00', '2025-08-06 12:00:00', 14, 'James', 'Baldwin');
CALL SP_INSERT_JPN_SEMINAR_EVENT('The Art of Storytelling', '2025-08-07 10:00:00', '2025-08-07 13:00:00', 15, 'Sylvia', 'Plath');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Science Fiction Visions', '2025-08-08 11:00:00', '2025-08-08 14:00:00', 8, 'Stephen', 'King');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Digital Humanities Seminar', '2025-08-09 09:30:00', '2025-08-09 12:30:00', 8, 'Nicholas', 'Carr');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Creative Writing Workshop', '2025-08-10 10:00:00', '2025-08-10 13:00:00', 15, 'Margaret', 'Atwood');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Literary Criticism Roundtable', '2025-08-11 11:00:00', '2025-08-11 14:00:00', 14, 'James', 'Baldwin');
CALL SP_INSERT_JPN_SEMINAR_EVENT('Narrative Storytelling', '2025-08-12 12:00:00', '2025-08-12 15:00:00', 15, 'Toni', 'Morrison');

-- insert into JPN_EXHIBITION
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Children Book Fair', '2025-09-01 10:00:00', '2025-09-01 18:00:00', 2, 3000.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Science Expo', '2025-09-02 11:00:00', '2025-09-02 19:00:00', 3, 4000.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Art & Culture Exhibition', '2025-09-03 09:00:00', '2025-09-03 17:00:00', 4, 3500.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Travel Inspirations', '2025-09-04 10:00:00', '2025-09-04 16:00:00', 5, 3200.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Adventures in Literature', '2025-09-05 12:00:00', '2025-09-05 20:00:00', 6, 2800.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Literary Classics Expo', '2025-09-06 10:00:00', '2025-09-06 18:00:00', 14, 3100.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Modern Art Expo', '2025-09-07 11:00:00', '2025-09-07 19:00:00', 4, 4200.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Culinary Arts Exhibition', '2025-09-08 09:00:00', '2025-09-08 17:00:00', 9, 3800.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Historic Manuscripts Display', '2025-09-09 10:00:00', '2025-09-09 18:00:00', 1, 3500.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Rare Book Exhibition', '2025-09-10 11:00:00', '2025-09-10 19:00:00', 14, 3600.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Documentary Film Festival', '2025-09-11 09:00:00', '2025-09-11 17:00:00', 20, 4000.00);
CALL SP_INSERT_JPN_EXHIBITION_EVENT('Contemporary Art Showcase', '2025-09-12 10:00:00', '2025-09-12 16:00:00', 4, 4500.00);

-- insert into JPN_BOOK
INSERT INTO JPN_BOOK (BOOK_NAME, T_ID)
VALUES
('The Adventures of Finn', 14),
('The Old Man and the Sea', 14),
('The Great Gatsby', 14),
('To Kill a Mockingbird', 14),
('Of Mice and Men', 14),
('Beloved', 14),
('The Catcher in the Rye', 14),
('1984', 14),
('Pride and Prejudice', 12),
('Mrs Dalloway', 7),
('Moby Dick', 14),
('War and Peace', 1),
('Crime and Punishment', 1),
('Ulysses', 14),
('Lolita', 14),
('One Hundred Years of Solitude', 14),
('The Sound and the Fury', 14),
('The Grapes of Wrath', 14),
('The Sun Also Rises', 14),
('Catch-22', 14),
('A Farewell to Arms', 14),
('Brave New World', 14),
('Fahrenheit 451', 14),
('Slaughterhouse-Five', 14),
('Invisible Man', 14);

-- insert into JPN_BOOK_AUTHOR
INSERT INTO JPN_BOOK_AUTHOR (A_ID, BOOK_ID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(7, 5),
(3, 8);

-- insert into JPN_COPIES
INSERT INTO JPN_COPIES (COPY_STATUS, BOOK_ID)
VALUES
('AVAILABLE', 1),
('NOT AVAILABLE', 1),
('AVAILABLE', 2),
('AVAILABLE', 2),
('NOT AVAILABLE', 3),
('AVAILABLE', 3),
('NOT AVAILABLE', 4),
('AVAILABLE', 5),
('AVAILABLE', 6),
('NOT AVAILABLE', 7),
('AVAILABLE', 8),
('AVAILABLE', 9),
('NOT AVAILABLE', 10),
('AVAILABLE', 10),
('NOT AVAILABLE', 11),
('AVAILABLE', 12),
('AVAILABLE', 13),
('NOT AVAILABLE', 14),
('AVAILABLE', 15),
('AVAILABLE', 16),
('NOT AVAILABLE', 17),
('AVAILABLE', 18),
('AVAILABLE', 19),
('NOT AVAILABLE', 20),
('AVAILABLE', 21);

-- insert into JPN_AUTHOR_SEMINAR
INSERT INTO JPN_AUTHOR_SEMINAR (A_ID, E_ID)
VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 3),
(7, 4),
(8, 4),
(9, 5),
(10, 5),
(11, 6),
(12, 6),
(13, 7),
(14, 7),
(15, 8),
(16, 8),
(17, 1),
(18, 2),
(19, 3),
(20, 4);

-- insert into JPN_CUSTOMER_EXHIBITION
INSERT INTO JPN_CUSTOMER_EXHIBITION (CUST_ID, E_ID)
VALUES
(1, 13),
(2, 14),
(3, 15),
(4, 16),
(5, 17),
(6, 18),
(7, 19),
(8, 20),
(9, 21),
(10, 22),
(11, 23),
(12, 24),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20);

-- insert into JPN_RENTAL
INSERT INTO JPN_RENTAL (R_STATUS, R_BORROWDATE, R_EX_RETURNDATE, CUST_ID, COPY_ID)
VALUES
('BORROWED', '2025-10-01 09:00:00', '2025-10-10 09:00:00', 1, 2),
('BORROWED', '2025-10-02 10:00:00', '2025-10-11 10:00:00', 2, 5),
('BORROWED', '2025-10-03 11:00:00', '2025-10-12 11:00:00', 3, 7),
('BORROWED', '2025-10-04 09:30:00', '2025-10-13 09:30:00', 4, 10),
('BORROWED', '2025-10-05 14:00:00', '2025-10-14 14:00:00', 5, 13),
('BORROWED', '2025-10-06 15:00:00', '2025-10-15 15:00:00', 6, 15),
('BORROWED', '2025-10-07 10:30:00', '2025-10-16 10:30:00', 7, 18),
('BORROWED', '2025-10-08 11:30:00', '2025-10-17 11:30:00', 8, 21),
('BORROWED', '2025-10-09 12:30:00', '2025-10-18 12:30:00', 9, 24),
('BORROWED', '2025-10-10 13:00:00', '2025-10-19 13:00:00', 10, 2),
('BORROWED', '2025-10-11 09:00:00', '2025-10-20 09:00:00', 11, 5),
('BORROWED', '2025-10-12 10:00:00', '2025-10-21 10:00:00', 12, 7),
('BORROWED', '2025-10-13 11:00:00', '2025-10-22 11:00:00', 13, 10),
('BORROWED', '2025-10-14 09:30:00', '2025-10-23 09:30:00', 14, 13),
('BORROWED', '2025-10-15 14:00:00', '2025-10-24 14:00:00', 15, 15),
('BORROWED', '2025-10-16 15:00:00', '2025-10-25 15:00:00', 16, 18),
('BORROWED', '2025-10-17 10:30:00', '2025-10-26 10:30:00', 17, 21),
('BORROWED', '2025-10-18 11:30:00', '2025-10-27 11:30:00', 18, 24),
('BORROWED', '2025-10-19 12:30:00', '2025-10-28 12:30:00', 19, 2),
('BORROWED', '2025-10-20 13:00:00', '2025-10-29 13:00:00', 20, 5);

-- Update first group of rental records to set actual return dates
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-08 10:00:00' WHERE R_ID = 1;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-12 09:00:00' WHERE R_ID = 2;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-12 10:30:00' WHERE R_ID = 3;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-13 09:00:00' WHERE R_ID = 4;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-14 14:30:00' WHERE R_ID = 5;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-15 15:30:00' WHERE R_ID = 6;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-16 10:00:00' WHERE R_ID = 7;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-17 11:00:00' WHERE R_ID = 8;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-18 12:00:00' WHERE R_ID = 9;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-19 13:30:00' WHERE R_ID = 10;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-20 10:00:00' WHERE R_ID = 11;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-21 09:30:00' WHERE R_ID = 12;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-22 10:30:00' WHERE R_ID = 13;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-23 09:00:00' WHERE R_ID = 14;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-24 14:30:00' WHERE R_ID = 15;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-25 15:30:00' WHERE R_ID = 16;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-26 10:00:00' WHERE R_ID = 17;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-27 11:00:00' WHERE R_ID = 18;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-28 12:30:00' WHERE R_ID = 19;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-29 13:30:00' WHERE R_ID = 20;

-- insert into JPN_RENTAL (additional 17 records: R_ID 21 to 37)
INSERT INTO JPN_RENTAL (R_STATUS, R_BORROWDATE, R_EX_RETURNDATE, CUST_ID, COPY_ID)
VALUES
('BORROWED', '2025-10-21 09:00:00', '2025-10-30 09:00:00', 21, 3),
('BORROWED', '2025-10-22 10:00:00', '2025-10-31 10:00:00', 22, 4),
('BORROWED', '2025-10-23 11:00:00', '2025-11-01 11:00:00', 23, 6),
('BORROWED', '2025-10-24 09:30:00', '2025-11-02 09:30:00', 24, 8),
('BORROWED', '2025-10-25 14:00:00', '2025-11-03 14:00:00', 25, 10),
('BORROWED', '2025-10-26 15:00:00', '2025-11-04 15:00:00', 26, 12),
('BORROWED', '2025-10-27 10:30:00', '2025-11-05 10:30:00', 27, 14),
('BORROWED', '2025-10-28 11:30:00', '2025-11-06 11:30:00', 28, 16),
('BORROWED', '2025-10-29 12:30:00', '2025-11-07 12:30:00', 29, 18),
('BORROWED', '2025-10-30 13:00:00', '2025-11-08 13:00:00', 30, 20),
('BORROWED', '2025-10-31 09:00:00', '2025-11-09 09:00:00', 1, 22),
('BORROWED', '2025-11-01 10:00:00', '2025-11-10 10:00:00', 2, 24),
('BORROWED', '2025-11-02 11:00:00', '2025-11-11 11:00:00', 3, 1),
('BORROWED', '2025-11-03 09:30:00', '2025-11-12 09:30:00', 4, 5),
('BORROWED', '2025-11-04 14:00:00', '2025-11-13 14:00:00', 5, 7),
('BORROWED', '2025-11-05 15:00:00', '2025-11-14 15:00:00', 6, 9),
('BORROWED', '2025-11-06 10:30:00', '2025-11-15 10:30:00', 7, 11);

-- Update additional rental records (R_ID 21 to 37) to set actual return dates
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-30 10:00:00' WHERE R_ID = 21;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-10-31 10:30:00' WHERE R_ID = 22;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-01 11:30:00' WHERE R_ID = 23;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-02 09:45:00' WHERE R_ID = 24;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-03 14:15:00' WHERE R_ID = 25;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-04 15:15:00' WHERE R_ID = 26;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-05 10:45:00' WHERE R_ID = 27;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-06 11:45:00' WHERE R_ID = 28;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-07 12:45:00' WHERE R_ID = 29;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-08 13:15:00' WHERE R_ID = 30;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-09 09:15:00' WHERE R_ID = 31;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-10 10:15:00' WHERE R_ID = 32;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-11 11:15:00' WHERE R_ID = 33;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-12 09:45:00' WHERE R_ID = 34;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-13 14:15:00' WHERE R_ID = 35;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-14 15:15:00' WHERE R_ID = 36;
UPDATE JPN_RENTAL SET R_AC_RETURNDATE = '2025-11-15 10:45:00' WHERE R_ID = 37;

-- insert into JPN_PAYMENT (via stored procedures)
-- Payment calls for first 10 rentals (invoices 1 to 10)
CALL SP_INSERT_JPN_PAYMENT_CASH(1, '2025-10-08 11:00:00', 1.4);
CALL SP_INSERT_JPN_PAYMENT_CARD(2, '2025-10-12 10:00:00', 2.2, 'Tom Cruise', '4111111111111111', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(3, '2025-10-15 09:00:00', 1.8, 'scarlett.j@gmail.com');
CALL SP_INSERT_JPN_PAYMENT_CASH(4, '2025-10-16 10:00:00', 2.0);
CALL SP_INSERT_JPN_PAYMENT_CARD(5, '2025-10-17 11:00:00', 1.6, 'Brad Pitt', '4222222222222222', 'DEBIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(6, '2025-10-18 12:00:00', 2.4, 'will.smith@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CASH(7, '2025-10-19 13:00:00', 2.0);
CALL SP_INSERT_JPN_PAYMENT_CARD(8, '2025-10-20 14:00:00', 1.8, 'Angelina Jolie', '4333333333333333', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(9, '2025-10-21 15:00:00', 2.2, 'meryl.streep@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CASH(10, '2025-10-22 16:00:00', 2.0);

-- Additional Payment Calls for Invoice IDs 11 to 37
-- Group 1: Invoice IDs 11 to 19 (9 calls: Cash=3, Card=4, PayPal=2)
CALL SP_INSERT_JPN_PAYMENT_CASH(11, '2025-10-30 11:00:00', 1.5);
CALL SP_INSERT_JPN_PAYMENT_CARD(12, '2025-10-31 11:00:00', 2.3, 'Tom Cruise', '4111111111111111', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(13, '2025-11-01 11:00:00', 1.9, 'scarlett.j@gmail.com');
CALL SP_INSERT_JPN_PAYMENT_CARD(14, '2025-11-02 11:00:00', 2.1, 'Brad Pitt', '4222222222222222', 'DEBIT');
CALL SP_INSERT_JPN_PAYMENT_CASH(15, '2025-11-03 11:00:00', 1.7);
CALL SP_INSERT_JPN_PAYMENT_CARD(16, '2025-11-04 11:00:00', 2.5, 'Angelina Jolie', '4333333333333333', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(17, '2025-11-05 11:00:00', 1.8, 'will.smith@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CARD(18, '2025-11-06 11:00:00', 2.4, 'Jennifer Lawrence', '4444444444444444', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_CASH(19, '2025-11-07 11:00:00', 1.6);

-- Group 2: Invoice IDs 20 to 28 (9 calls: Cash=2, Card=4, PayPal=3)
CALL SP_INSERT_JPN_PAYMENT_CARD(20, '2025-11-08 11:00:00', 2.0, 'George Clooney', '4555555555555555', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(21, '2025-11-09 11:00:00', 1.9, 'meryl.streep@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CASH(22, '2025-11-10 11:00:00', 1.8);
CALL SP_INSERT_JPN_PAYMENT_CARD(23, '2025-11-11 11:00:00', 2.2, 'Morgan Freeman', '4666666666666666', 'DEBIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(24, '2025-11-12 11:00:00', 1.7, 'emma.stone@gmail.com');
CALL SP_INSERT_JPN_PAYMENT_CARD(25, '2025-11-13 11:00:00', 2.3, 'Denzel Washington', '4777777777777777', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_CASH(26, '2025-11-14 11:00:00', 1.5);
CALL SP_INSERT_JPN_PAYMENT_CARD(27, '2025-11-15 11:00:00', 2.4, 'Natalie Portman', '4888888888888888', 'DEBIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(28, '2025-11-16 11:00:00', 1.8, 'leonardo.dicaprio@yahoo.com');

-- Group 3: Invoice IDs 29 to 37 (9 calls: Cash=2, Card=3, PayPal=4)
CALL SP_INSERT_JPN_PAYMENT_CASH(29, '2025-11-17 11:00:00', 1.7);
CALL SP_INSERT_JPN_PAYMENT_CARD(30, '2025-11-18 11:00:00', 2.5, 'Robert Downey', '4999999999999999', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(31, '2025-11-19 11:00:00', 1.8, 'chris.hemsworth@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CARD(32, '2025-11-20 11:00:00', 2.1, 'Samuel Jackson', '4111111111111112', 'DEBIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(33, '2025-11-21 11:00:00', 1.9, 'hugh.jackman@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_CASH(34, '2025-11-22 11:00:00', 1.6);
CALL SP_INSERT_JPN_PAYMENT_CARD(35, '2025-11-23 11:00:00', 2.3, 'Nicole Kidman', '4222222222222223', 'CREDIT');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(36, '2025-11-24 11:00:00', 1.8, 'kate.winslet@yahoo.com');
CALL SP_INSERT_JPN_PAYMENT_PAYPAL(37, '2025-11-25 11:00:00', 1.9, 'sandra.bullock@gmail.com');

-- insert into JPN_RESERVATION
INSERT INTO JPN_RESERVATION (RES_STARTTIME, RES_ENDTIME, RES_DESC, RES_COUNT, CUST_ID, ROOM_ID)
VALUES
('2025-11-01 09:00:00', '2025-11-01 11:00:00', 'Study Session', 5, 1, 101),
('2025-11-02 10:00:00', '2025-11-02 12:00:00', 'Group Meeting', 4, 2, 203),
('2025-11-03 11:00:00', '2025-11-03 13:00:00', 'Workshop', 6, 3, 302),
('2025-11-04 12:00:00', '2025-11-04 14:00:00', 'Team Discussion', 3, 4, 404),
('2025-11-05 13:00:00', '2025-11-05 15:00:00', 'Seminar Prep', 7, 5, 505),
('2025-11-06 14:00:00', '2025-11-06 16:00:00', 'Project Meeting', 8, 6, 601),
('2025-11-07 15:00:00', '2025-11-07 17:00:00', 'Reading Club', 5, 7, 602),
('2025-11-08 16:00:00', '2025-11-08 18:00:00', 'Exam Prep', 4, 8, 603),
('2025-11-09 17:00:00', '2025-11-09 19:00:00', 'Discussion Group', 6, 9, 102),
('2025-11-10 18:00:00', '2025-11-10 20:00:00', 'Study Session', 7, 10, 103),
('2025-11-11 09:00:00', '2025-11-11 11:00:00', 'Morning Study', 5, 11, 201),
('2025-11-12 10:00:00', '2025-11-12 12:00:00', 'Afternoon Meeting', 4, 12, 202),
('2025-11-13 11:00:00', '2025-11-13 13:00:00', 'Workshop', 6, 13, 304),
('2025-11-14 12:00:00', '2025-11-14 14:00:00', 'Team Sync', 3, 14, 305),
('2025-11-15 13:00:00', '2025-11-15 15:00:00', 'Brainstorming', 7, 15, 401),
('2025-11-16 14:00:00', '2025-11-16 16:00:00', 'Project Discussion', 8, 16, 402),
('2025-11-17 15:00:00', '2025-11-17 17:00:00', 'Reading Club', 5, 17, 403),
('2025-11-18 16:00:00', '2025-11-18 18:00:00', 'Exam Prep', 4, 18, 404),
('2025-11-19 17:00:00', '2025-11-19 19:00:00', 'Discussion Group', 6, 19, 405),
('2025-11-20 18:00:00', '2025-11-20 20:00:00', 'Study Session', 7, 20, 501);

-- insert into JPN_SPONSOR_SEMINAR
INSERT INTO JPN_SPONSOR_SEMINAR (SP_ID, E_ID, AMOUNT)
VALUES
(1, 1, 1234.56),
(2, 1, 2345.67),
(3, 2, 3456.78),
(4, 2, 4567.89),
(5, 3, 5678.90),
(6, 3, 6789.01),
(8, 4, 7890.12),
(7, 4, 8901.23),
(9, 5, 9012.34),
(10, 5, 1123.45),
(1, 6, 2234.56),
(2, 6, 3345.67),
(3, 7, 4456.78),
(4, 7, 5567.89),
(5, 8, 6678.90),
(6, 8, 7789.01),
(7, 9, 8890.12),
(8, 9, 9901.23),
(9, 10, 1012.34),
(10, 10, 1213.45);
