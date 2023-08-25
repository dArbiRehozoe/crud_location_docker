CREATE DATABASE locations;
use locations;

CREATE TABLE location (
  numloc int(11) NOT NULL,
  nom_loc varchar(255) DEFAULT NULL,
  design_voiture varchar(255) DEFAULT NULL,
  Nombre_de_jours int(11) DEFAULT NULL,
  taux_journalier decimal(10,2) DEFAULT NULL
);

INSERT INTO location (numloc, nom_loc, design_voiture, Nombre_de_jours, taux_journalier) 
VALUES
(19, 'd\'Arbi', 'Ferari', 46, '20.30'),
(20, 'Kevin', 'Camping Car', 2, '12.30');