-- Seed data for database named 'empdb'
-- @author Abhijeet Bhagat


-- Seed data for table `department`

LOCK TABLES `department` WRITE;

INSERT INTO `department` (name) 
VALUES 
('HR') /* department id 1*/,
('Engineering') /* department id 2*/,
('R&D') /* department id 3*/,
('Marketing') /* department id 4*/,
('Accounting and Finance') /* department id 5*/,
('Administration') /* department id 6*/,
('Infosec') /* department id 7*/;

UNLOCK TABLES;


-- Seed data for table `role`

LOCK TABLES `role` WRITE;

INSERT INTO `role` (title,salary,department_id) 
VALUES
    ('HR Officer',100000,1), /* 1 */
    ('HR Manager',120000,1), /* 2 */
    ('Recruiter',90000,1), /* 3 */
    ('Software Engineer',120000,2), /* 4 */
    ('Senior Software Engineer',140000,2), /* 5 */
    ('Junior Scientist',130000,3), /* 6 */
    ('Senior Scientist',150000,3), /* 7 */
    ('Marketing Executive',100000,4), /* 8 */
    ('Marketing Manager',130000,4), /* 9 */
    ('Accounts Officer',110000,5), /* 10 */
    ('Finance Manager',130000,5), /* 11 */
    ('Admin Clerk',90000,6), /* 12 */
    ('Admin Manager',100000,6), /* 13 */
    ('Infosec Officer',90000,7), /* 14 */
    ('Infosec Manager',120000,7); /* 15 */

UNLOCK TABLES;


-- Seed data for table `employee`

LOCK TABLES `employee` WRITE;

INSERT INTO `employee` (first_name,last_name,role_id,manager_id)
VALUES 
    ('Joseph','Cutler',2,NULL),
    ('Edward','Hawk',1,1),
    ('Saina','Chopra',3,1),
    ('Sean', 'Gomez',5,NULL),
    ('David ', 'Sener',4,4);

UNLOCK TABLES;

