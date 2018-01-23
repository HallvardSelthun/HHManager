CREATE TABLE `husholdning` (
  `husholdningId` int(11) NOT NULL AUTO_INCREMENT,
  `navn` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`husholdningId`)
);

CREATE TABLE `bruker` (
  `brukerId` int(11) NOT NULL AUTO_INCREMENT,
  `favorittHusholdning` int(11) DEFAULT NULL,
  `passord` varchar(255) DEFAULT NULL,
  `navn` varchar(255) DEFAULT NULL,
  `epost` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`brukerId`),
  CONSTRAINT `bruker_ibfk_1` FOREIGN KEY (`favorittHusholdning`) REFERENCES `husholdning` (`husholdningId`)
);

CREATE TABLE `gjøremål` (
  `gjøremålId` int(11) NOT NULL AUTO_INCREMENT,
  `husholdningId` int(11) NOT NULL,
  `utførerId` int(11) DEFAULT NULL,
  `fullført` tinyint(1) DEFAULT NULL,
  `beskrivelse` text,
  `frist` date DEFAULT NULL,
  PRIMARY KEY (`gjøremålId`,`husholdningId`),
  CONSTRAINT `gjøremål___fk_2` FOREIGN KEY (`utførerId`) REFERENCES `bruker` (`brukerId`),
  CONSTRAINT `gjøremål_ibfk_1` FOREIGN KEY (`husholdningId`) REFERENCES `husholdning` (`husholdningId`)
);

CREATE TABLE `handleliste` (
  `handlelisteId` int(11) NOT NULL AUTO_INCREMENT,
  `husholdningId` int(11) NOT NULL,
  `frist` date DEFAULT NULL,
  `offentlig` tinyint(1) DEFAULT NULL,
  `navn` text,
  `skaperId` int(11) DEFAULT NULL,
  `gjemt` tinyint(4) NOT NULL,
  PRIMARY KEY (`handlelisteId`,`husholdningId`),
  CONSTRAINT `handleliste_ibfk_1` FOREIGN KEY (`husholdningId`) REFERENCES `husholdning` (`husholdningId`),
  CONSTRAINT `handleliste_ibfk_2` FOREIGN KEY (`skaperId`) REFERENCES `bruker` (`brukerId`)
);

CREATE TABLE `hhmedlem` (
  `brukerId` int(11) NOT NULL,
  `husholdningId` int(11) NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`brukerId`,`husholdningId`),
  CONSTRAINT `hhmedlem_ibfk_1` FOREIGN KEY (`brukerId`) REFERENCES `bruker` (`brukerId`),
  CONSTRAINT `hhmedlem_ibfk_2` FOREIGN KEY (`husholdningId`) REFERENCES `husholdning` (`husholdningId`)
);

CREATE TABLE `nyhetsinnlegg` (
  `nyhetsinnleggId` int(11) NOT NULL AUTO_INCREMENT,
  `husholdningId` int(11) NOT NULL,
  `tekst` text,
  `dato` date DEFAULT NULL,
  `forfatterId` int(11) DEFAULT NULL,
  PRIMARY KEY (`nyhetsinnleggId`,`husholdningId`),
  CONSTRAINT `nyhetsinnlegg___fk_2` FOREIGN KEY (`forfatterId`) REFERENCES `bruker` (`brukerId`),
  CONSTRAINT `nyhetsinnlegg_ibfk_1` FOREIGN KEY (`husholdningId`) REFERENCES `husholdning` (`husholdningId`)
);

CREATE TABLE `utlegg` (
  `utleggId` int(11) NOT NULL AUTO_INCREMENT,
  `utleggerId` int(11) NOT NULL,
  `sum` double DEFAULT NULL,
  `beskrivelse` text,
  PRIMARY KEY (`utleggId`,`utleggerId`),
  CONSTRAINT `utlegg_ibfk_1` FOREIGN KEY (`utleggerId`) REFERENCES `bruker` (`brukerId`)
);

CREATE TABLE `utleggsbetaler` (
  `utleggId` int(11) NOT NULL,
  `skyldigBrukerId` int(11) NOT NULL,
  `betalt` tinyint(1) DEFAULT NULL,
  `delSum` double DEFAULT NULL,
  PRIMARY KEY (`utleggId`,`skyldigBrukerId`),
  CONSTRAINT `utleggsbetaler_ibfk_1` FOREIGN KEY (`utleggId`) REFERENCES `utlegg` (`utleggId`),
  CONSTRAINT `utleggsbetaler_ibfk_2` FOREIGN KEY (`skyldigBrukerId`) REFERENCES `bruker` (`brukerId`)
);

CREATE TABLE `vare` (
  `vareId` int(11) NOT NULL AUTO_INCREMENT,
  `handlelisteId` int(11) NOT NULL,
  `kjøperId` int(11) DEFAULT NULL,
  `vareNavn` text,
  `kjøpt` tinyint(1) DEFAULT NULL,
  `datoKjøpt` date DEFAULT NULL,
  PRIMARY KEY (`vareId`,`handlelisteId`),
  CONSTRAINT `vare___fk_2` FOREIGN KEY (`kjøperId`) REFERENCES `hhmedlem` (`brukerId`),
  CONSTRAINT `vare_ibfk_1` FOREIGN KEY (`handlelisteId`) REFERENCES `handleliste` (`handlelisteId`)
);

CREATE TABLE `utleggvare` (
  `vareId` int(11) NOT NULL,
  `utleggId` int(11) NOT NULL,
  PRIMARY KEY (`vareId`,`utleggId`),
  CONSTRAINT `utleggvare_ibfk_1` FOREIGN KEY (`vareId`) REFERENCES `vare` (`vareId`),
  CONSTRAINT `utleggvare_ibfk_2` FOREIGN KEY (`utleggId`) REFERENCES `utlegg` (`utleggId`)
);

