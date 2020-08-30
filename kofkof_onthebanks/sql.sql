-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.4.11-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versão:              10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for eff
CREATE DATABASE IF NOT EXISTS `eff` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `eff`;

-- Dumping structure for table eff.other_inv
CREATE TABLE IF NOT EXISTS `other_inv` (
  `id` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `items` longtext DEFAULT '[]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table eff.other_inv: ~18 rows (approximately)
DELETE FROM `other_inv`;
/*!40000 ALTER TABLE `other_inv` DISABLE KEYS */;
INSERT INTO `other_inv` (`id`, `type`, `items`) VALUES
	('TEST', 'trunk', '[]');
/*!40000 ALTER TABLE `other_inv` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
