-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: 22. Jan, 2018 11:07 AM
-- Server-versjon: 5.7.20-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `g_tdat2003_t6`
--

--
-- Dataark for tabell `husholdning`
--

INSERT INTO `husholdning` (`husholdningId`, `navn`) VALUES
  (1, 'Scrumgruppa'),
  (2, 'The Crib');

--
-- Dataark for tabell `bruker`
--

INSERT INTO `bruker` (`brukerId`, `favorittHusholdning`, `hash`, `navn`, `epost`, `salt`) VALUES
(1, 1, 'f17a90d2d95839d3df484b99411d265f', 'Brage', 'bragehs@hotmail.com', NULL ),
(2, 1, '207023ccb44feb4d7dadca005ce29a64', 'Karol', 'debikkarol@gmail.com', NULL ),
(3, 2, '62c8ad0a15d9d1ca38d5dee762a16e01', 'Truls', 'trulsmatias@gmail.com', NULL ),
(4, NULL, 'e1faa913c211ad7285b299df2d054257', 'Toni', 'tonivuc@gmail.com', NULL ),
(5, 1, 'bad803b9f5196821f8ca62059a953621', 'Hallvard2', 'hallvsa@stud.ntnu.no', NULL ),
(6, 1, '5c913be9b7d3732443786aeebbad0818', 'Kimia', 'kimia.abtahi@gmail.com', NULL ),
(7, 1, 'b208c80e4037ebe5017cbba02dcca6d7', 'Britt', 'nora@gmail.com', NULL ),
(8, 1, 'a6008231fa64ff879ecb286a657b6a99', 'Charlotte', 'charlotte.groder@gmail.com', NULL ),
(79, 1, 'BI/FT4he0uo2fYrHgA/ESQ==', 'truls3', 'trulsmt@stud.ntnu.no', 'hMyGazWOII40+/+elYNU7g==');

--
-- Dataark for tabell `hhmedlem`
--

INSERT INTO `hhmedlem` (`brukerId`, `husholdningId`, `admin`) VALUES
  (1, 1, 1),
  (2, 1, 0),
  (3, 2, 1),
  (4, 2, 0),
  (5, 1, 0),
  (6, 1, 0),
  (7, 2, 0),
  (8, 2, 0);

--
-- Dataark for tabell `gjøremål`
--

INSERT INTO `gjøremål` (`gjøremålId`, `husholdningId`, `utførerId`, `fullført`, `beskrivelse`, `frist`) VALUES
(1, 1, 1, 0, 'vaske huset', '2017-02-23'),
(2, 1, NULL, 0, 'rydde rommet', '2017-02-23'),
(3, 1, 2, 0, 'vaske huset', '2017-02-23'),
(4, 1, 8, 1, 'smile til naboen', '2018-01-24'),
(5, 1, 4, 0, 'Vaske toalettet', '2018-01-30'),
(6, 1, 8, 1, 'kaste bosset', '2018-01-19'),
(7, 1, 7, 0, ':)', '2018-01-13'),
(8, 1, 6, 0, ':(', '2018-01-27'),
(9, 1, 5, 1, 'danse', '2018-01-20'),
(10, 1, 4, 1, 'leke', '2018-01-27'),
(11, 1, 3, 1, 'spille fotball', '2018-01-26'),
(12, 1, 6, 0, 'ri på hest', '2018-01-28'),
(13, 1, 6, 0, 'turne', '2018-01-27'),
(14, 1, 6, 0, 'spise', '2018-01-31');

--
-- Dataark for tabell `handleliste`
--

INSERT INTO `handleliste` (`handlelisteId`, `husholdningId`, `frist`, `offentlig`, `navn`, `skaperId`, `gjemt`) VALUES
(1, 1, '2017-02-23', 0, 'renhold', 1, 0),
(2, 1, '2017-02-23', 1, 'renhold1', 1, 0),
(3, 1, '2018-01-12', 1, 'Kakebaking', 2, 1),
(12, 2, '2018-01-12', 1, 'Den beste listen', 2, 1),
(13, 1, '2018-01-24', 0, 'Brages Liste', 8, 0),
(14, 2, '2018-01-25', 1, 'Brages shady liste', 8, 0),
(15, 2, '2018-01-15', 1, 'Handleliste laget av test-metode', 2, 1),
(34, 2, '2018-01-15', 1, 'Handleliste laget av test-metode', 2, 0),
(62, 1, NULL, 1, 'Tacokveld for boysa :)', 8, 0),
(64, 1, NULL, 1, 'tacokveld for GIRLSA', 8, 0),
(65, 1, NULL, 1, 'britt :D blir fit', 1, 0),
(69, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(70, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(71, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(72, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(73, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(74, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(75, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(76, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(77, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(78, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(79, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(80, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(81, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(82, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(83, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(84, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(85, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(86, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(87, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(88, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(89, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(90, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(91, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(92, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(93, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(94, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(95, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(96, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(97, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(98, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(99, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(100, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(101, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(102, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(103, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(104, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(105, 2, '2018-01-19', 1, 'Handleliste laget av test-metode', 2, 0),
(106, 2, '2018-01-20', 1, 'Handleliste laget av test-metode', 2, 0),
(107, 2, '2018-01-21', 1, 'Handleliste laget av test-metode', 2, 0),
(108, 2, '2018-01-22', 1, 'Handleliste laget av test-metode', 2, 0),
(109, 2, '2018-01-22', 1, 'Handleliste laget av test-metode', 2, 0),
(110, 2, '2018-01-22', 1, 'Handleliste laget av test-metode', 2, 0),
(111, 2, '2018-01-22', 1, 'Handleliste laget av test-metode', 2, 0),
(112, 2, '2018-01-22', 1, 'Handleliste laget av test-metode', 2, 0);

--
-- Dataark for tabell `nyhetsinnlegg`
--

INSERT INTO `nyhetsinnlegg` (`nyhetsinnleggId`, `husholdningId`, `tekst`, `dato`, `forfatterId`) VALUES
(1, 1, 'nyhestekst', '2012-03-04', 1),
(2, 1, 'nyhestekst2', '2012-03-04', 2),
(22, 1, 'heia :)', '2018-01-16', 8),
(54, 1, 'bli venner da', '2018-01-16', 3),
(60, 1, 'HALLO ALLE SAMMEN!!!! NORA HAR ANKOMMET :D :D :D VÆR HILSET', '2018-01-17', 1),
(70, 1, 'YEYY, endelig fikk jeg bli med igjen etter å ha blitt holdt utenfor. Tusen takk. Appreciate it', '2018-01-17', 1),
(71, 1, 'BRITT where u at?', '2018-01-17', 1),
(75, 1, 'britt commit :D', '2018-01-17', 1),
(76, 1, 'britt push', '2018-01-17', 1),
(79, 1, 'britt alt+f4', '2018-01-17', 8),
(81, 1, 'god morgen gruppe<3', '2018-01-18', 8),
(82, 1, 'God morgen suppe <3', '2018-01-18', 7),
(89, 1, 'heg er tilbake :DDDD', '2018-01-18', 6),
(90, 1, 'hash:charlotte', '2018-01-18', 7),
(91, 1, 'pass på det', '2018-01-18', 6),
(92, 1, 'Scrum er kjempemorsomt!', '2018-01-18', 4),
(93, 1, 'Møtest i morgen for å jobbe med scrum, venner! :D', '2018-01-18', 8),
(94, 1, 'Å jobbe med scrum har virkelig latt meg spre vingene innen systemutvikling! :D', '2018-01-18', 4),
(95, 1, ':-)\n', '2018-01-18', 5),
(96, 1, 'VI MÅ FÅ A!!!!!', '2018-01-18', 6),
(97, 1, 'Nytt innlegg', '2018-01-18', 4),
(98, 1, 'TONI, YOU HERE?!', '2018-01-18', 8),
(102, 1, 'SCRUm er så gøy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!JEG VIL HJEM', '2018-01-19', 7),
(103, 1, 'la oss gå det er fredag så skjera\n', '2018-01-19', 6),
(104, 1, 'plisplispliiiiiiiiiiiiiiiiiiiiiiiiiiiis', '2018-01-19', 6),
(105, 1, 'Heihå', '2018-01-21', 8),
(106, 1, 'Hade', '2018-01-22', 1);

--
-- Dataark for tabell `utlegg`
--

INSERT INTO `utlegg` (`utleggId`, `utleggerId`, `sum`, `beskrivelse`) VALUES
(1, 1, 200, 'varer'),
(2, 1, 300, 'varer'),
(3, 2, 400, ':D'),
(4, 2, 400, ':D'),
(5, 2, 400, ':D');

--
-- Dataark for tabell `utleggsbetaler`
--

INSERT INTO `utleggsbetaler` (`utleggId`, `skyldigBrukerId`, `betalt`, `delSum`) VALUES
(1, 2, 1, 100),
(2, 3, 1, 100);

--
-- Dataark for tabell `vare`
--

INSERT INTO `vare` (`vareId`, `handlelisteId`, `kjøperId`, `vareNavn`, `kjøpt`, `datoKjøpt`) VALUES
(1, 2, 8, 'mat', 1, '2018-01-02'),
(2, 2, 8, 'kule ting', 1, '2018-01-02'),
(3, 2, NULL, 'mat', 0, NULL),
(4, 2, NULL, 'mindre kule ting', 0, NULL),
(5, 2, NULL, 'superkule ting', 0, NULL),
(6, 13, NULL, 'Spaghetti', 0, NULL),
(7, 2, NULL, 'Testvare fra testklassen', 0, NULL),
(9, 3, 1, 'tannkrem', 0, NULL),
(61, 1, NULL, 'Testvare fra testklassen', NULL, NULL),
(62, 2, NULL, 'aaaaaaaaaaaaaaaaa', NULL, NULL),
(63, 1, NULL, 'Testvare fra testklassen', NULL, NULL),
(64, 1, NULL, 'Testvare fra testklassen', NULL, NULL),
(65, 1, NULL, 'Testvare fra testklassen', NULL, NULL);

--
-- Dataark for tabell `utleggvare`
--

INSERT INTO `utleggvare` (`vareId`, `utleggId`) VALUES
  (1, 1),
  (2, 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
