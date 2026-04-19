CREATE DATABASE  IF NOT EXISTS `subastas_lego` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `subastas_lego`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: subastas_lego
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Architecture, Batman, City, Creator 3in1, DC, Disney, Editions, Friends, Fortnite, Harry Potter, Icons, Jurassic World, Lord of the Rings, Marvel, Minecraft, Colección Nike, NINJAGO, ONE PIECE, Juguetes y sets de Pokémon, Powered UP, Sonic the Hedgehog, Speed Champions, LEGO Star Wars, SMART Play, Super Mario, Technic, The Legend of Zelda..',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Architecture'),(2,'Batman'),(3,'City'),(16,'Colección Nike'),(4,'Creator 3in1'),(5,'DC'),(6,'Disney'),(7,'Editions'),(9,'Fortnite'),(8,'Friends'),(10,'Harry Potter'),(11,'Icons'),(19,'Juguetes y sets de Pokemon'),(12,'Jurassic World'),(13,'Lord of the Rings'),(14,'Marvel'),(15,'Minecraft'),(17,'Ninjago'),(18,'ONE PIECE'),(20,'Powered UP'),(21,'Sonic the Hedgehog'),(22,'Speed Champions'),(23,'Star Wars'),(24,'Super Mario'),(25,'Technic'),(26,'The Legend of Zelda');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condiciones_lego`
--

DROP TABLE IF EXISTS `condiciones_lego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condiciones_lego` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'nuevo, usado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condiciones_lego`
--

LOCK TABLES `condiciones_lego` WRITE;
/*!40000 ALTER TABLE `condiciones_lego` DISABLE KEYS */;
INSERT INTO `condiciones_lego` VALUES (2,'Nuevo abierto pero sin usar'),(1,'Nuevo en caja sellada'),(4,'Usado - bueno'),(5,'Usado - con piezas faltantes'),(3,'Usado - excelente');
/*!40000 ALTER TABLE `condiciones_lego` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_lego`
--

DROP TABLE IF EXISTS `estados_lego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_lego` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'activo, inactivo, subastado.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_lego`
--

LOCK TABLES `estados_lego` WRITE;
/*!40000 ALTER TABLE `estados_lego` DISABLE KEYS */;
INSERT INTO `estados_lego` VALUES (1,'Disponible'),(2,'En subasta'),(5,'Inactivo'),(4,'Retirado'),(3,'Vendido');
/*!40000 ALTER TABLE `estados_lego` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_subasta`
--

DROP TABLE IF EXISTS `estados_subasta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_subasta` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'activa, finalizada, cancelada',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_subasta`
--

LOCK TABLES `estados_subasta` WRITE;
/*!40000 ALTER TABLE `estados_subasta` DISABLE KEYS */;
INSERT INTO `estados_subasta` VALUES (1,'activa'),(4,'borrador'),(3,'cancelada'),(2,'finalizada');
/*!40000 ALTER TABLE `estados_subasta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_usuario`
--

DROP TABLE IF EXISTS `estados_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_usuario` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'activo, bloqueado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_usuario`
--

LOCK TABLES `estados_usuario` WRITE;
/*!40000 ALTER TABLE `estados_usuario` DISABLE KEYS */;
INSERT INTO `estados_usuario` VALUES (1,'activo'),(2,'bloqueado');
/*!40000 ALTER TABLE `estados_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes`
--

DROP TABLE IF EXISTS `imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `es_principal` tinyint(1) DEFAULT 0 COMMENT '1 = imagen principal',
  `id_lego` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_lego` (`id_lego`),
  CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`id_lego`) REFERENCES `lego` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes`
--

LOCK TABLES `imagenes` WRITE;
/*!40000 ALTER TABLE `imagenes` DISABLE KEYS */;
INSERT INTO `imagenes` VALUES (1,'uploads/millennium-falcon/1.png',1,1),(2,'uploads/millennium-falcon/2.jpg',0,1),(3,'uploads/millennium-falcon/3.jpg',0,1),(4,'uploads/millennium-falcon/4.jpg',0,1),(5,'uploads/bugatti-chiron/1.jpg',1,2),(6,'uploads/bugatti-chiron/2.jpg',0,2),(7,'uploads/bugatti-chiron/3.jpg',0,2),(8,'uploads/bugatti-chiron/4.jpg',0,2),(9,'uploads/bugatti-chiron/5.jpg',0,2),(10,'uploads/estacion-policia/1.png',1,3),(11,'uploads/estacion-policia/2.png',0,3),(12,'uploads/estacion-policia/3.png',0,3),(13,'uploads/estacion-policia/3.png',0,3),(14,'uploads/ninjago-dragon-de-hielo/1.png',1,4),(15,'uploads/ninjago-dragon-de-hielo/2.png',0,4),(16,'uploads/ninjago-dragon-de-hielo/3.png',0,4),(17,'uploads/ninjago-dragon-de-hielo/4.png',0,4),(93,'uploads/Pokemon_3_Iniciales/69e1297e2dad5_1776363902.png',1,31),(94,'uploads/Pokemon_3_Iniciales/69e1297e39d84_1776363902.png',0,31),(95,'uploads/Pokemon_3_Iniciales/69e1297e45979_1776363902.png',0,31),(96,'uploads/Pokemon_3_Iniciales/69e1297e4dcc7_1776363902.png',0,31),(97,'uploads/Pokemon_3_Iniciales/69e1297e55dd9_1776363902.png',0,31),(98,'uploads/Castillo_harry_potter_/69e27fbed97f9_1776451518.png',1,32),(99,'uploads/Castillo_harry_potter_/69e27fbee355c_1776451518.jpg',0,32),(100,'uploads/Castillo_harry_potter_/69e27fbeec2dd_1776451518.jpg',0,32),(101,'uploads/Castillo_harry_potter_/69e27fbf03bf2_1776451519.jpg',0,32),(102,'uploads/Castillo_harry_potter_/69e27fbf10402_1776451519.jpg',0,32),(103,'uploads/Castillo_harry_potter_/69e27fbf1c74e_1776451519.jpg',0,32);
/*!40000 ALTER TABLE `imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lego`
--

DROP TABLE IF EXISTS `lego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lego` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `id_condicion` tinyint(3) unsigned NOT NULL,
  `id_estado` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `id_vendedor` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_condicion` (`id_condicion`),
  KEY `id_vendedor` (`id_vendedor`),
  KEY `lego_ibfk_estado` (`id_estado`),
  KEY `fk_lego_categoria` (`id_categoria`),
  CONSTRAINT `fk_lego_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `lego_ibfk_1` FOREIGN KEY (`id_condicion`) REFERENCES `condiciones_lego` (`id`),
  CONSTRAINT `lego_ibfk_3` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lego_ibfk_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados_lego` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lego`
--

LOCK TABLES `lego` WRITE;
/*!40000 ALTER TABLE `lego` DISABLE KEYS */;
INSERT INTO `lego` VALUES (1,'Millennium Falcon UCS 75192','Set completo, 7541 piezas, caja sellada',1,1,2,'2026-02-21 15:12:52',23),(2,'LEGO Technic Bugatti Chiron 42083','Usado pero completo',2,1,2,'2026-02-21 15:12:52',25),(3,'Estación de Policía LEGO City 60316','Muy buen estado, con 5 minifiguras',2,1,2,'2026-02-21 15:12:52',3),(4,'Ninjago Dragón de Hielo 71766','Nuevo en caja original',1,1,2,'2026-02-21 15:12:52',17),(31,'Pokemon 3 Iniciales','Este épico set de 6838 piezas incluye 3 figuras de acción de batalla Pokémon: Venusaur tiene lianas y pies móviles, Blastoise tiene cabeza, brazos y cañones de agua articulados, y las alas, piernas, brazos y cabeza de Charizard se pueden colocar en diferentes posiciones.',5,1,5,'2026-04-16 12:25:02',19),(32,'Castillo harry potter ','6000 piezas, 4 magos originales, 27 personajes de las peliculas, etc',3,1,5,'2026-04-17 12:45:18',10);
/*!40000 ALTER TABLE `lego` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pujas`
--

DROP TABLE IF EXISTS `pujas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pujas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_subasta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_subasta` (`id_subasta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pujas_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pujas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pujas`
--

LOCK TABLES `pujas` WRITE;
/*!40000 ALTER TABLE `pujas` DISABLE KEYS */;
INSERT INTO `pujas` VALUES (1,1,3,870.00,'2026-02-11 15:30:00'),(2,1,4,900.00,'2026-02-12 09:15:00'),(3,2,3,125.00,'2026-01-28 18:45:00'),(4,3,4,195.00,'2026-02-10 14:20:00'),(5,1,3,870.00,'2026-02-11 15:30:00'),(6,1,4,900.00,'2026-02-12 09:15:00'),(7,2,3,125.00,'2026-01-28 18:45:00'),(8,3,4,195.00,'2026-02-10 14:20:00'),(9,20,1,600.00,'2026-04-17 23:43:30'),(10,20,1,700.00,'2026-04-17 23:43:39'),(11,20,1,900.00,'2026-04-17 23:47:54'),(12,20,1,1000.00,'2026-04-17 23:54:18'),(13,20,1,1100.00,'2026-04-17 23:57:29'),(14,20,1,1200.00,'2026-04-18 13:49:25'),(15,20,1,1500.00,'2026-04-18 13:49:35'),(16,20,1,1700.00,'2026-04-18 14:23:42'),(17,20,1,1800.00,'2026-04-18 14:24:01'),(18,20,1,1900.00,'2026-04-18 14:24:10'),(19,20,1,2000.00,'2026-04-18 14:38:13'),(20,20,1,2500.00,'2026-04-18 14:57:12'),(21,20,1,2600.00,'2026-04-18 14:57:31'),(22,20,1,2700.00,'2026-04-18 15:00:34'),(23,20,1,2800.00,'2026-04-18 15:46:11'),(24,20,1,2900.00,'2026-04-18 15:57:07'),(25,20,1,3000.00,'2026-04-18 16:15:13'),(26,20,1,3100.00,'2026-04-18 16:47:59'),(27,21,1,11.00,'2026-04-18 17:54:40'),(28,21,1,13.00,'2026-04-18 18:02:21'),(29,21,1,14.00,'2026-04-18 18:02:25'),(30,21,1,15.00,'2026-04-18 18:09:37'),(31,21,1,16.00,'2026-04-18 18:15:04'),(32,21,1,18.00,'2026-04-18 18:17:42'),(33,21,1,20.00,'2026-04-18 18:18:10'),(34,21,1,21.00,'2026-04-18 18:18:42'),(35,20,1,3200.00,'2026-04-18 18:23:27'),(36,20,1,3300.00,'2026-04-18 18:30:57'),(37,20,1,3400.00,'2026-04-18 18:32:00'),(38,20,1,3500.00,'2026-04-18 18:33:22'),(39,20,1,3600.00,'2026-04-18 18:33:41'),(40,20,1,3700.00,'2026-04-18 18:33:56'),(41,21,1,23.00,'2026-04-18 20:02:07'),(42,21,1,25.00,'2026-04-18 20:02:18'),(43,21,3,26.00,'2026-04-18 20:02:59'),(44,21,1,27.00,'2026-04-18 20:03:25'),(45,21,3,28.00,'2026-04-18 20:04:30');
/*!40000 ALTER TABLE `pujas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'comprador, vendedor, administrador',
  `descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'comprador',NULL),(2,'vendedor',NULL),(3,'administrador',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subastas`
--

DROP TABLE IF EXISTS `subastas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subastas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lego` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_cierre` datetime NOT NULL,
  `precio_base` decimal(12,2) NOT NULL,
  `incremento_minimo` decimal(12,2) NOT NULL DEFAULT 1.00,
  `id_estado` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `id_lego` (`id_lego`),
  KEY `id_creador` (`id_creador`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `subastas_ibfk_1` FOREIGN KEY (`id_lego`) REFERENCES `lego` (`id`),
  CONSTRAINT `subastas_ibfk_2` FOREIGN KEY (`id_creador`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `subastas_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados_subasta` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subastas`
--

LOCK TABLES `subastas` WRITE;
/*!40000 ALTER TABLE `subastas` DISABLE KEYS */;
INSERT INTO `subastas` VALUES (1,1,2,'2026-02-10 10:00:00','2026-02-20 22:00:00',850.00,20.00,2),(2,2,2,'2026-01-15 14:00:00','2026-02-01 20:00:00',120.00,5.00,2),(3,3,2,'2026-02-05 09:00:00','2026-02-18 21:00:00',180.00,10.00,2),(4,4,2,'2026-04-18 20:26:00','2026-04-18 20:27:00',320.00,15.00,4),(20,2,2,'2026-04-18 13:00:00','2026-04-18 20:28:00',500.00,100.00,2),(21,32,5,'2026-04-18 17:55:00','2026-04-18 20:07:00',10.00,1.00,2),(22,31,5,'2026-04-18 23:22:00','2026-04-18 23:23:00',5.00,1.00,4),(23,1,2,'2026-04-18 20:18:00','2026-04-19 20:17:00',5.00,1.00,1);
/*!40000 ALTER TABLE `subastas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `id_rol` tinyint(3) unsigned NOT NULL,
  `id_estado` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@subastaslego.cr','123456789','Diego',3,1,'2026-02-21 15:12:52'),(2,'vendedor1@subastaslego.cr','123456789','Pablo',2,1,'2026-02-21 15:12:52'),(3,'comprador1@subastaslego.cr','123456789','Johanna',1,1,'2026-02-21 15:12:52'),(4,'comprador2@subastaslego.cr','123456789','Natalia',1,1,'2026-02-21 15:12:52'),(5,'eliasvendedor@gmail.com','123456789','Elias',2,1,'2026-03-22 18:34:17'),(6,'gustavocomprado@gmail.com','123456789','Gustavo',1,1,'2026-03-22 19:53:27');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-18 23:36:42
