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
INSERT INTO `estados_subasta` VALUES (1,'activa'),(3,'cancelada'),(2,'finalizada');
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes`
--

LOCK TABLES `imagenes` WRITE;
/*!40000 ALTER TABLE `imagenes` DISABLE KEYS */;
INSERT INTO `imagenes` VALUES (1,'uploads/millennium-falcon/1.png',1,1),(2,'uploads/millennium-falcon/2.jpg',0,1),(3,'uploads/millennium-falcon/3.jpg',0,1),(4,'uploads/millennium-falcon/4.jpg',0,1),(5,'uploads/bugatti-chiron/1.jpg',1,2),(6,'uploads/bugatti-chiron/2.jpg',0,2),(7,'uploads/bugatti-chiron/3.jpg',0,2),(8,'uploads/bugatti-chiron/4.jpg',0,2),(9,'uploads/bugatti-chiron/5.jpg',0,2),(10,'uploads/estacion-policia/1.png',1,3),(11,'uploads/estacion-policia/2.png',0,3),(12,'uploads/estacion-policia/3.png',0,3),(13,'uploads/estacion-policia/3.png',0,3),(14,'uploads/ninjago-dragon-de-hielo/1.png',1,4),(15,'uploads/ninjago-dragon-de-hielo/2.png',0,4),(16,'uploads/ninjago-dragon-de-hielo/3.png',0,4),(17,'uploads/ninjago-dragon-de-hielo/4.png',0,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lego`
--

LOCK TABLES `lego` WRITE;
/*!40000 ALTER TABLE `lego` DISABLE KEYS */;
INSERT INTO `lego` VALUES (1,'Millennium Falcon UCS 75192','Set completo, 7541 piezas, caja sellada',1,1,2,'2026-02-21 15:12:52',23),(2,'Estación de Policía LEGO City 60316','Muy buen estado, con 5 minifiguras',2,1,2,'2026-02-21 15:12:52',3),(3,'Ninjago Dragón de Hielo 71766','Nuevo en caja original',1,1,2,'2026-02-21 15:12:52',17),(4,'LEGO Technic Bugatti Chiron 42083','Usado pero completo',2,1,2,'2026-02-21 15:12:52',25);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pujas`
--

LOCK TABLES `pujas` WRITE;
/*!40000 ALTER TABLE `pujas` DISABLE KEYS */;
INSERT INTO `pujas` VALUES (1,1,3,870.00,'2026-02-11 15:30:00'),(2,1,4,900.00,'2026-02-12 09:15:00'),(3,2,3,125.00,'2026-01-28 18:45:00'),(4,3,4,195.00,'2026-02-10 14:20:00'),(5,1,3,870.00,'2026-02-11 15:30:00'),(6,1,4,900.00,'2026-02-12 09:15:00'),(7,2,3,125.00,'2026-01-28 18:45:00'),(8,3,4,195.00,'2026-02-10 14:20:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subastas`
--

LOCK TABLES `subastas` WRITE;
/*!40000 ALTER TABLE `subastas` DISABLE KEYS */;
INSERT INTO `subastas` VALUES (1,1,2,'2026-02-10 10:00:00','2026-02-20 22:00:00',850.00,20.00,1),(2,2,2,'2026-01-15 14:00:00','2026-02-01 20:00:00',120.00,5.00,2),(3,3,2,'2026-02-05 09:00:00','2026-02-18 21:00:00',180.00,10.00,1),(4,4,2,'2026-02-01 11:00:00','2026-02-10 19:00:00',320.00,15.00,3),(5,1,2,'2026-02-10 10:00:00','2026-02-20 22:00:00',850.00,20.00,1),(6,2,2,'2026-01-15 14:00:00','2026-02-01 20:00:00',120.00,5.00,2),(7,3,2,'2026-02-05 09:00:00','2026-02-18 21:00:00',180.00,10.00,1),(8,4,2,'2026-02-01 11:00:00','2026-02-10 19:00:00',320.00,15.00,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@subastaslego.cr','$2y$10$examplehashadmin','Administrador Sistema',3,1,'2026-02-21 15:12:52'),(2,'vendedor1@subastaslego.cr','$2y$10$examplehashvendedor','Carlos Lego Vendedor',2,1,'2026-02-21 15:12:52'),(3,'comprador1@subastaslego.cr','$2y$10$examplehashcomprador','Ana Coleccionista',1,1,'2026-02-21 15:12:52'),(4,'comprador2@subastaslego.cr','$2y$10$examplehashcomprador','Juan Fan Lego',1,1,'2026-02-21 15:12:52');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'subastas_lego'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-22 17:47:22
