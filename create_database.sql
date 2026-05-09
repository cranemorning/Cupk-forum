-- 创建数据库
CREATE DATABASE IF NOT EXISTS big_event CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE big_event;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL,
  `user_pic` VARCHAR(255),
  `sex` VARCHAR(10),
  `email` VARCHAR(100),
  `profile` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL
);

-- 创建角色表
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL
);

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `alias` VARCHAR(50) NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS `article` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `cover_img` VARCHAR(255),
  `state` VARCHAR(20) NOT NULL,
  `category_id` INT NOT NULL,
  `create_user` INT NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`create_user`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS `comment` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `score` INT NOT NULL,
  `article_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_id` INT,
  `target_user_id` INT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL,
  FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- 插入默认角色
INSERT IGNORE INTO `role` (`id`, `name`) VALUES
(1, '普通用户'),
(2, '社区管理员');

-- 插入默认分类
INSERT IGNORE INTO `category` (`id`, `name`, `alias`, `create_time`, `update_time`) VALUES
(1, '美食', 'food', NOW(), NOW()),
(2, '人文', 'culture', NOW(), NOW()),
(3, '军事', 'military', NOW(), NOW()),
(4, '游戏', 'game', NOW(), NOW()),
(5, '日常', 'daily', NOW(), NOW()),
(6, '其他', 'other', NOW(), NOW());
