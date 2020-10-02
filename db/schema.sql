DROP DATABASE IF EXISTS `empdb`;

-- Create Database
CREATE DATABASE  IF NOT EXISTS `empdb` ;

USE `empdb`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `department`;

-- Table structure for table `department`

CREATE TABLE `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
); 

-- Table structure for table `role`

CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `salary` decimal(8,0) NOT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dept_idx` (`department_id`),
  UNIQUE INDEX `title_UNIQUE` (`title` ASC) VISIBLE,
  CONSTRAINT `fk_dept` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for table `employee`

CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `role_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `manager_id_idx` (`manager_id`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `employee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);



