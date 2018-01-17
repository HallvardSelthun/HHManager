package server.controllers;

//import jdk.internal.org.objectweb.asm.Handle;
import server.database.ConnectionPool;
import server.restklasser.Handleliste;
import server.restklasser.Vare;

import java.sql.*;
import java.util.ArrayList;

public class HandlelisteController {

    /**
     * Henter en sql-date som gjelder for en handleliste.
     * @param handlelisteId Unik ID for å identifisere hver handleliste
     * @return Date
     */
    public static Date getFrist(int handlelisteId) {
        return GenereltController.getDate("frist","handleliste", handlelisteId);
    }

    public static boolean slettHandleliste(int handlelisteId) {
        return GenereltController.slettRad("handleliste",handlelisteId);
    }

    /**
     * Tar husholdningsId og brukerId og returnerer alle handlelistene brukeren har tilgang til
     * innad i husholdningen.
     * @param husholdningId Unik ID for å identifisere hver handleliste
     * @param brukerId Unik ID for å identifisere hver handleliste
     * @return Handleliste Et fullt handlelisteobjekt.
     */
    public static ArrayList<Handleliste> getHandlelister(int husholdningId, int brukerId) {

        //Hent offentlige handlelister som hører til husholdningen, samt private handlelister som hører til brukeren og husholdningen
        final String getQuery = "SELECT * FROM handleliste WHERE (husholdningId = "+husholdningId+" AND offentlig = 1) OR (skaperId = "+brukerId+" AND husholdningId = "+husholdningId+" AND offentlig = 0)";
        ArrayList<Handleliste> handlelister = new ArrayList<Handleliste>();


        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getStatement = connection.prepareStatement(getQuery)) {

            ResultSet tomHandleliste = getStatement.executeQuery();

            while (tomHandleliste.next()) {
                int handlelisteId = tomHandleliste.getInt("handlelisteId");
                //Hent varer som hører til hver handleliste
                ArrayList<Vare> varer = getVarer(handlelisteId, connection);
                handlelister.add(lagHandlelisteObjekt(tomHandleliste, handlelisteId, varer));
            }
            return handlelister;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }

    }

    /**
     * Tar et ResultSet og legger informasjonen inn i et Handleliste-objekt
     * @param handlelisteId Unik ID for å identifisere hver handleliste
     * @return Handleliste Et fullt handlelisteobjekt.
     */
    private static Handleliste lagHandlelisteObjekt(ResultSet tomHandleliste, int handlelisteId, ArrayList<Vare> varer) throws SQLException{

        Handleliste handleliste = new Handleliste(handlelisteId);
        handleliste.setHusholdningId(tomHandleliste.getInt("husholdningId"));
        handleliste.setSkaperId(tomHandleliste.getInt("skaperId"));
        handleliste.setTittel(tomHandleliste.getString("navn"));
        handleliste.setOffentlig((tomHandleliste.getInt("offentlig"))==1); //Gjør om tinyInt til boolean
        handleliste.setFrist(tomHandleliste.getDate("frist"));
        handleliste.setHandlelisteId(tomHandleliste.getInt("handlelisteId"));
        handleliste.setVarer(varer);

        return handleliste;
    }

    /**
     * Send inn en handlelisteId for å få et Handleliste-objekt fra databasen.
     * Kobler seg også opp mot varer-tabellen for å fylle handlelisten med varer.
     * @param handlelisteId Unik ID for å identifisere hver handleliste
     * @return Handleliste Et fullt handlelisteobjekt.
     */
    public static Handleliste getHandleliste(int handlelisteId) {
        final String getQuery = "SELECT * FROM handleliste WHERE handlelisteId = "+handlelisteId+"";

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getStatement = connection.prepareStatement(getQuery)){

            ResultSet tomHandleliste = getStatement.executeQuery();

            ArrayList<Vare> varer =  getVarer(handlelisteId,connection);
            tomHandleliste.next();
            return lagHandlelisteObjekt(tomHandleliste,handlelisteId,varer);

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Hjelpemetode. Tar imot et resultset fra vare-tabellen og gjør det om til en array av varer.
     * @param handlelisteId ResultSet av varer fra SQL-severen.
     * @return Vare[]
     */
    public static ArrayList<Vare> getVarer(int handlelisteId, Connection connection){

        final String getVarer = "SELECT * FROM vare WHERE handlelisteId = "+handlelisteId+"";
        ArrayList<Vare> varer = new ArrayList<Vare>();

        try (PreparedStatement getVarerStatement = connection.prepareStatement(getVarer)){
            ResultSet varerResultset = getVarerStatement.executeQuery();

            while (varerResultset.next()) {
                Vare nyVare = new Vare();
                nyVare.setVareId(varerResultset.getInt("vareId"));
                nyVare.setKjøperId(varerResultset.getInt("kjøperId"));
                nyVare.setVarenavn(varerResultset.getString("vareNavn"));
                nyVare.setKjøpt((varerResultset.getInt("kjøpt"))==1); //Hvis resultatet == 1, får man true
                nyVare.setDatoKjøpt(varerResultset.getDate("datoKjøpt"));
                nyVare.setHandlelisteId(varerResultset.getInt("handlelisteId"));
                varer.add(nyVare);
            }
            return varer;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * Tar imot et Handleliste-objekt og registrerer det i databasen.
     * Returnerer IDen til handlelisten i databasen hvis det lykkes.
     * @param handlelisteData Et handlelisteobjekt med all nødvendig informasjon. Vi ser bort fra handlelisteId.
     * @return int Handlelistens ID, eller -1 hvis noe gikk galt.
     */
    public static int lagHandleliste(Handleliste handlelisteData) {

        final String INSERT_Handleliste;
        if (handlelisteData.getFrist() != null) {
            INSERT_Handleliste =
                    "INSERT INTO handleliste (husholdningId, offentlig, navn, skaperId, frist) VALUES (?, ?, ?, ?, ?)";
        }
        else {
            INSERT_Handleliste =
                    "INSERT INTO handleliste (husholdningId, offentlig, navn, skaperId) VALUES (?, ?, ?, ?)";
        }

        int nyHandlelisteId = -1;

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement insertStatement = connection.prepareStatement(INSERT_Handleliste, PreparedStatement.RETURN_GENERATED_KEYS);)
        {
            insertStatement.setInt(1, handlelisteData.getHusholdningId());
            insertStatement.setBoolean(2, handlelisteData.isOffentlig());
            insertStatement.setString(3,handlelisteData.getTittel());
            insertStatement.setInt(4, handlelisteData.getSkaperId());

            if (handlelisteData.getFrist() != null) {
                insertStatement.setDate(5, handlelisteData.getFrist());
            }

            //Kjør insert-kall
            try {
                int primaryKey = -1;
                if (insertStatement.executeUpdate() > 0) {
                    ResultSet rs = insertStatement.getGeneratedKeys();
                    while (rs.next()) {
                        primaryKey = rs.getInt(1);
                    }
                }
                return primaryKey;

            } catch (Exception e) {
                e.printStackTrace();
                return -1;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }
    }



    /**
     * Tar imot en handlelisteId og en vare laget i nettleseren. Legger varen inn i databasen
     * med kobling til handleliste. Pass på at erKjøpt er satt til false hvis varen er helt ny.
     * @param vare Vare laget fra før, f.eks. i JavaScript
     * @return int Varens ID, eller -1 hvis noe gikk galt.
     */
    public static int leggInnVare(Vare vare) {

        String INSERT_Vare =
                "INSERT INTO vare (handlelisteId, vareNavn) VALUES (?, ?)";

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement insertStatement = connection.prepareStatement(INSERT_Vare, PreparedStatement.RETURN_GENERATED_KEYS);) {
            
            insertStatement.setInt(1, vare.getHandlelisteId());
            insertStatement.setString(2, vare.getVarenavn());
            

            //Kjør insert-kall
            try {
                int primaryKey = -1;
                if (insertStatement.executeUpdate() > 0) {
                    ResultSet rs = insertStatement.getGeneratedKeys();
                    while (rs.next()) {
                        primaryKey = rs.getInt(1);
                    }
                }
                return primaryKey;

            } catch (Exception e) {
                e.printStackTrace();
                return -1;
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }
    }

    /*
    public static Handleliste[] getHandlelister(int brukerId, int husholdningId) {

        final String getHandlelister = "SELECT * FROM handleliste WHERE skaperId = "+brukerId+" OR husholdningId = "+husholdningId+"";
        ArrayList<Handleliste> varer = new ArrayList<Handleliste>();

        try (Connection connection = ConnectionPool.getConnection();
             PreparedStatement getHandlelisteStatement = connection.prepareStatement(getHandlelister)){
            ResultSet handleResultset = getHandlelisteStatement.executeQuery();

            while (handleResultset.next()) {
                Handleliste nyListe = new Handleliste();
                nyListe.setFrist(handleResultset.getDate("frist"));
                nyListe.setOffentlig(handleResultset.getInt("offentlig")==1);
                nyListe.setTittel(handleResultset.getString("navn"));
                nyListe.setKjøpt((varerResultset.getInt("kjøpt"))==1); //Hvis resultatet == 1, får man true
                nyListe.setDatoKjøpt(varerResultset.getDate("datoKjøpt"));
                varer.add(nyVare);
            }
            return varer;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
    */
}
