-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: DBTeam008
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `logintable`
--

DROP TABLE IF EXISTS `logintable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logintable` (
  `id` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `phoneNumber` int(11) NOT NULL,
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logintable`
--

LOCK TABLES `logintable` WRITE;
/*!40000 ALTER TABLE `logintable` DISABLE KEYS */;
INSERT INTO `logintable` VALUES ('guest123','$2y$10$TxDcqi2Tj46y/tIude1PveoE.JbmUWjaoREhINICmaaBJ2n79c/s2',2025,'123','123','male',123,1),('guest','$2y$10$ZJ76lC8DDpjZYjxUVfjI1.CnZR60pnLftxc43uNiVgYN9BnjvHU3K',2025,'123','도현이바보ㅋ','female',123,2),('123','$2y$10$MNvI51eGuXKdRcl2rXxMIeOBN5Cf/62sCgqjjDwFog6f1LyTF/27u',2025,'123','123','male',123,3);
/*!40000 ALTER TABLE `logintable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patternweight`
--

DROP TABLE IF EXISTS `patternweight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patternweight` (
  `pattern_id` int(11) NOT NULL,
  `difficulty` smallint(6) NOT NULL,
  `weight` float NOT NULL,
  `pattern_name` varchar(30) NOT NULL,
  PRIMARY KEY (`pattern_id`,`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patternweight`
--

LOCK TABLES `patternweight` WRITE;
/*!40000 ALTER TABLE `patternweight` DISABLE KEYS */;
/*!40000 ALTER TABLE `patternweight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rawgamelog`
--

DROP TABLE IF EXISTS `rawgamelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rawgamelog` (
  `game_id` int(11) NOT NULL,
  `turn` smallint(6) NOT NULL,
  `player_color` enum('B','W') NOT NULL,
  `x` tinyint(4) NOT NULL,
  `y` tinyint(4) NOT NULL,
  PRIMARY KEY (`game_id`,`turn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rawgamelog`
--

LOCK TABLES `rawgamelog` WRITE;
/*!40000 ALTER TABLE `rawgamelog` DISABLE KEYS */;
/*!40000 ALTER TABLE `rawgamelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summarylog`
--

DROP TABLE IF EXISTS `summarylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `summarylog` (
  `game_id` int(11) NOT NULL,
  `turn` smallint(6) NOT NULL,
  `eval_category` enum('good','normal','miss','missed_win') NOT NULL,
  `advantage_score` smallint(6) NOT NULL,
  PRIMARY KEY (`game_id`,`turn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summarylog`
--

LOCK TABLES `summarylog` WRITE;
/*!40000 ALTER TABLE `summarylog` DISABLE KEYS */;
/*!40000 ALTER TABLE `summarylog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrating`
--

DROP TABLE IF EXISTS `userrating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userrating` (
  `uid` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 1000,
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`uid`),
  CONSTRAINT `userrating_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `usertable` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrating`
--

LOCK TABLES `userrating` WRITE;
/*!40000 ALTER TABLE `userrating` DISABLE KEYS */;
/*!40000 ALTER TABLE `userrating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertable`
--

DROP TABLE IF EXISTS `usertable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usertable` (
  `uid` int(11) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `score` int(11) NOT NULL,
  `setting` varchar(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertable`
--

LOCK TABLES `usertable` WRITE;
/*!40000 ALTER TABLE `usertable` DISABLE KEYS */;
INSERT INTO `usertable` VALUES (1,'123','male',500,'','2025-11-27 02:36:21'),(2,'도현이바보ㅋ','female',500,'','2025-11-27 02:40:59'),(3,'123','male',500,'','2025-11-27 02:57:05');
/*!40000 ALTER TABLE `usertable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 12:27:25
