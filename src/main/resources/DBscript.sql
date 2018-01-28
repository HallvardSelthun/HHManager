-- brukere:
INSERT INTO bruker ( hash, navn, epost )VALUES ( 'passord2' ,'bruker2' ,'bruker2@mail.no' );
INSERT INTO bruker ( hash, navn, epost )VALUES ( 'passord3' ,'bruker3' ,'bruker3@mail.no' );
INSERT INTO bruker ( hash, navn, epost )VALUES ( 'passord4' ,'bruker4' ,'bruker4@mail.no' );
INSERT INTO bruker ( hash, navn, epost )VALUES ( 'passord5' ,'bruker6' ,'bruker6@mail.no' );
INSERT INTO bruker ( hash, navn, epost )VALUES ( 'passord6' ,'bruker6' ,'bruker6@mail.no' );

-- husholdninger:
INSERT INTO husholdning(navn) VALUES( 'husholdning1');
INSERT INTO husholdning(navn) VALUES( 'husholdning2');
INSERT INTO husholdning(navn) VALUES( 'husholdning3');
INSERT INTO husholdning(navn) VALUES( 'husholdning4');

-- hhmedlemmer:
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (1,1,1);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (1,2,1);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (2,1,0);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (3,1,0);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (4,2,1);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (5,2,1);
INSERT INTO hhmedlem (hhBrukerId, husholdningsId, admin) VALUES (6,2,1);

-- nyhetsinnlegg:
INSERT INTO nyhetsinnlegg(husholdningsId,tekst,dato) VALUES (1, 'nyhestekst', '2012-03-04');
INSERT INTO nyhetsinnlegg(husholdningsId,tekst,dato) VALUES (1, 'nyhestekst2', '2012-03-04');

-- gjoremal:
INSERT INTO gjoremal ( husholdningsId, utførerId, fullført, beskrivelse, frist) VALUES (1, 1,0, 'vaske huset','2017-02-23');
INSERT INTO gjoremal ( husholdningsId,  fullført, beskrivelse, frist) VALUES (1, 0, 'rydde rommet','2017-02-23');
INSERT INTO gjoremal ( husholdningsId, utførerId, fullført, beskrivelse, frist) VALUES (1, 2,0, 'vaske huset','2017-02-23');



-- handleliste
INSERT INTO handleliste (husholdningsId, frist, offentlig, navn, skaperId) VALUES (1,'2017-02-23', 0,'renhold',1);
INSERT INTO handleliste (husholdningsId, frist, offentlig, navn, skaperId) VALUES (1,'2017-02-23', 1,'renhold1',1);


-- varer:
INSERT INTO vare  (handlelisteId, kjøperID, vareNavn, kjopt, datoKjøpt) VALUES (1,1,'mat',1,'2017-01-02');
INSERT INTO vare  (handlelisteId, kjøperID, vareNavn, kjopt, datoKjøpt) VALUES (1,1,'kule ting',1,'2017-01-02');
INSERT INTO vare  (handlelisteId, vareNavn, kjopt) VALUES (1, 'mat',0);
INSERT INTO vare  (handlelisteId, vareNavn, kjopt) VALUES (1, 'mindre kule ting',0);
INSERT INTO vare  (handlelisteId, vareNavn, kjopt) VALUES (1, 'superkule ting',0);

-- utlegg:
INSERT INTO utlegg (utleggerId, sum, beskrivelse)VALUES (1, 200, 'varer');
INSERT INTO utlegg (utleggerId, sum, beskrivelse)VALUES (1, 300, 'varer');

-- utleggsvarer:
INSERT INTO utleggsvare (vareId, utleggId) VALUES (1,1);
INSERT INTO utleggsvare (vareId, utleggId) VALUES (2,2);


-- utleggsbetaler
INSERT INTO utleggsbetaler (utleggId, medlemsId, betalt,delSum)  VALUES (1,2, 1, 100.0);
INSERT INTO utleggsbetaler (utleggId, medlemsId, betalt,delSum)  VALUES (1,3, 1, 100.0);
INSERT INTO utleggsbetaler (utleggId, medlemsId, betalt,delSum)  VALUES (1,2, 1, 150.0);

















